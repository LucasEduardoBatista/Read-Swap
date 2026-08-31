<?php
require_once __DIR__ . '/../includes/config.php';
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

if (!isset($_SESSION['usuario_id'])) {
    http_response_code(401);
    echo json_encode(['erro' => 'Você precisa estar logado.'], JSON_UNESCAPED_UNICODE);
    exit;
}

function decodificarMensagens(?string $json): array {
    $mensagens = json_decode($json ?? '[]', true);
    return is_array($mensagens) ? array_values($mensagens) : [];
}

$usuarioId = (int)$_SESSION['usuario_id'];
$acao = $_GET['acao'] ?? $_POST['acao'] ?? 'contatos';

if ($acao === 'contatos') {
    $stmt = $conn->prepare("
        SELECT p.idPerfis, p.Nome, p.Foto, c.conteudo, c.DataEnvio
        FROM PerfisADMs p
        INNER JOIN (
            SELECT DISTINCT l.IdDono AS contatoId FROM SwapsADMs s
            INNER JOIN LivrosADMs l ON l.idLivrosADMs = s.idLivro
            WHERE s.idUsuario = ? AND s.Gostou = 1
              AND EXISTS (
                  SELECT 1 FROM SwapsADMs reciproco
                  INNER JOIN LivrosADMs livro_reciproco ON livro_reciproco.idLivrosADMs = reciproco.idLivro
                  WHERE reciproco.idUsuario = l.IdDono
                    AND livro_reciproco.IdDono = ?
                    AND reciproco.Gostou = 1
              )
        ) contatos ON contatos.contatoId = p.idPerfis
        LEFT JOIN conversasADMs c
          ON c.id1 = LEAST(?, p.idPerfis) AND c.id2 = GREATEST(?, p.idPerfis) AND c.Statuscvs = 0
        WHERE p.Status = 0
        ORDER BY COALESCE(c.DataEnvio, '1970-01-01') DESC, p.Nome
    ");
    $stmt->bind_param('iiii', $usuarioId, $usuarioId, $usuarioId, $usuarioId);
    $stmt->execute();
    $contatos = [];
    foreach ($stmt->get_result() as $row) {
        $historico = decodificarMensagens($row['conteudo'] ?? null);
        $ultima = $historico ? $historico[array_key_last($historico)] : null;
        $contatos[] = [
            'id' => (int)$row['idPerfis'],
            'nome' => $row['Nome'],
            'foto' => !empty($row['Foto']) ? blobParaDataUri($row['Foto']) : './Imagens/default-profile.jpg',
            'ultimaMensagem' => $ultima['texto'] ?? '',
            'ultimaData' => $ultima['data'] ?? ($row['DataEnvio'] ?? '')
        ];
    }
    echo json_encode($contatos, JSON_UNESCAPED_UNICODE);
    exit;
}

$contatoId = filter_input(INPUT_GET, 'contato_id', FILTER_VALIDATE_INT)
    ?: filter_input(INPUT_POST, 'contato_id', FILTER_VALIDATE_INT);
if (!$contatoId || $contatoId === $usuarioId) {
    http_response_code(422);
    echo json_encode(['erro' => 'Contato inválido.'], JSON_UNESCAPED_UNICODE);
    exit;
}

$idMenor = min($usuarioId, (int)$contatoId);
$idMaior = max($usuarioId, (int)$contatoId);
$permissao = $conn->prepare('
    SELECT 1
    FROM SwapsADMs saida
    INNER JOIN LivrosADMs livro_saida ON livro_saida.idLivrosADMs = saida.idLivro
    WHERE saida.idUsuario = ? AND livro_saida.IdDono = ? AND saida.Gostou = 1
      AND EXISTS (
          SELECT 1 FROM SwapsADMs volta
          INNER JOIN LivrosADMs livro_volta ON livro_volta.idLivrosADMs = volta.idLivro
          WHERE volta.idUsuario = ? AND livro_volta.IdDono = ? AND volta.Gostou = 1
      )
    LIMIT 1
');
$permissao->bind_param('iiii', $usuarioId, $contatoId, $contatoId, $usuarioId);
$permissao->execute();
$podeConversar = (bool)$permissao->get_result()->fetch_row();
if (!$podeConversar) {
    http_response_code(403);
    echo json_encode(['erro' => 'Esta conversa não pertence aos seus matches.'], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($acao === 'mensagens') {
    $stmt = $conn->prepare('SELECT conteudo FROM conversasADMs WHERE id1 = ? AND id2 = ? AND Statuscvs = 0 LIMIT 1');
    $stmt->bind_param('ii', $idMenor, $idMaior);
    $stmt->execute();
    $row = $stmt->get_result()->fetch_assoc();
    $mensagens = [];
    foreach (decodificarMensagens($row['conteudo'] ?? null) as $indice => $mensagem) {
        $mensagens[] = [
            'id' => (int)($mensagem['id'] ?? $indice + 1),
            'tipo' => (int)($mensagem['remetente'] ?? 0) === $usuarioId ? 'sent' : 'received',
            'texto' => (string)($mensagem['texto'] ?? ''),
            'data' => (string)($mensagem['data'] ?? '')
        ];
    }
    echo json_encode($mensagens, JSON_UNESCAPED_UNICODE);
    exit;
}

if ($acao === 'enviar' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    exigirCsrf();
    $texto = trim($_POST['conteudo'] ?? '');
    if ($texto === '' || tamanhoTexto($texto) > 2000) {
        http_response_code(422);
        echo json_encode(['erro' => 'A mensagem deve ter entre 1 e 2000 caracteres.'], JSON_UNESCAPED_UNICODE);
        exit;
    }
    $valida = $conn->prepare('SELECT idPerfis FROM PerfisADMs WHERE idPerfis = ? AND Status = 0');
    $valida->bind_param('i', $contatoId);
    $valida->execute();
    if (!$valida->get_result()->fetch_assoc()) {
        http_response_code(404);
        echo json_encode(['erro' => 'Usuário não encontrado.'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    try {
        $conn->begin_transaction();
        $stmt = $conn->prepare('SELECT idConversa, conteudo FROM conversasADMs WHERE id1 = ? AND id2 = ? FOR UPDATE');
        $stmt->bind_param('ii', $idMenor, $idMaior);
        $stmt->execute();
        $conversa = $stmt->get_result()->fetch_assoc();
        $historico = decodificarMensagens($conversa['conteudo'] ?? null);
        $novaMensagem = ['id' => count($historico) + 1, 'remetente' => $usuarioId, 'texto' => $texto, 'data' => date('Y-m-d H:i:s')];
        $historico[] = $novaMensagem;
        $json = json_encode($historico, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR);

        if ($conversa) {
            $stmt = $conn->prepare('UPDATE conversasADMs SET conteudo = ?, DataEnvio = CURRENT_TIMESTAMP WHERE idConversa = ?');
            $stmt->bind_param('si', $json, $conversa['idConversa']);
        } else {
            $stmt = $conn->prepare('INSERT INTO conversasADMs (id1, id2, conteudo, Statuscvs) VALUES (?, ?, ?, 0)');
            $stmt->bind_param('iis', $idMenor, $idMaior, $json);
        }
        $stmt->execute();
        $conn->commit();
        echo json_encode(['sucesso' => true, 'id' => $novaMensagem['id']], JSON_UNESCAPED_UNICODE);
    } catch (Throwable $e) {
        $conn->rollback();
        error_log('ReadSwap: falha ao salvar conversa: ' . $e->getMessage());
        http_response_code(500);
        echo json_encode(['erro' => 'Não foi possível salvar a mensagem.'], JSON_UNESCAPED_UNICODE);
    }
    exit;
}

http_response_code(400);
echo json_encode(['erro' => 'Ação inválida.'], JSON_UNESCAPED_UNICODE);
