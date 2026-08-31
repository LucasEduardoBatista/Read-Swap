<?php
require_once __DIR__ . '/../includes/config.php';
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

$acao = $_GET['acao'] ?? 'buscar';

if ($acao === 'buscar') {
    $usuario = usuarioAtual($conn);
    if (!$usuario || (int)($usuario['Status'] ?? 1) !== 0) {
        http_response_code(401);
        echo json_encode(['erro' => 'Autenticação necessária.'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $termo = trim($_GET['q'] ?? '');
    if (tamanhoTexto($termo) < 2) {
        echo json_encode([], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $busca = '%' . $termo . '%';
    $stmt = $conn->prepare('
        SELECT idPerfis, Nome, Cidade, Foto
        FROM PerfisADMs
        WHERE Status = 0 AND Nome LIKE ?
        ORDER BY Nome
        LIMIT 8
    ');
    $stmt->bind_param('s', $busca);
    $stmt->execute();
    $perfis = [];
    foreach ($stmt->get_result() as $perfil) {
        $perfis[] = [
            'id' => (int)$perfil['idPerfis'],
            'nome' => $perfil['Nome'] ?? '',
            'cidade' => $perfil['Cidade'] ?? '',
            'foto' => !empty($perfil['Foto']) ? './backend/imagens/publica.php?tipo=perfil&id=' . (int)$perfil['idPerfis'] : './Imagens/default-profile.jpg',
        ];
    }
    echo json_encode($perfis, JSON_UNESCAPED_UNICODE);
    exit;
}

if ($acao === 'detalhes') {
    $perfilId = filter_var($_GET['id'] ?? null, FILTER_VALIDATE_INT);
    if (!$perfilId) {
        http_response_code(422);
        echo json_encode(['erro' => 'Perfil inválido.'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $stmt = $conn->prepare('SELECT idPerfis, Nome, Cidade, Foto, Premium, Generos FROM PerfisADMs WHERE idPerfis = ? AND Status = 0 LIMIT 1');
    $stmt->bind_param('i', $perfilId);
    $stmt->execute();
    $perfil = $stmt->get_result()->fetch_assoc();
    if (!$perfil) {
        http_response_code(404);
        echo json_encode(['erro' => 'Perfil não encontrado.'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $stmt = $conn->prepare('
        SELECT idLivrosADMs, Nome, Autor, Genero, EstadoConservacao, Fotolivro
        FROM LivrosADMs
        WHERE IdDono = ? AND Status = 0
        ORDER BY idLivrosADMs DESC
    ');
    $stmt->bind_param('i', $perfilId);
    $stmt->execute();
    $livros = [];
    foreach ($stmt->get_result() as $livro) {
        $livros[] = [
            'id' => (int)$livro['idLivrosADMs'],
            'nome' => $livro['Nome'] ?? '',
            'autor' => $livro['Autor'] ?? '',
            'genero' => $livro['Genero'] ?? '',
            'estado' => $livro['EstadoConservacao'] ?? '',
            'foto' => !empty($livro['Fotolivro']) ? './backend/imagens/publica.php?tipo=livro&id=' . (int)$livro['idLivrosADMs'] : './Imagens/sem_livros.png',
        ];
    }

    $generosSalvos = json_decode($perfil['Generos'] ?? '', true);
    $generosPerfil = is_array($generosSalvos)
        ? array_values(array_filter(array_map('trim', $generosSalvos)))
        : array_values(array_filter(array_map('trim', explode(',', $perfil['Generos'] ?? ''))));

    echo json_encode([
        'perfil' => [
            'id' => (int)$perfil['idPerfis'],
            'nome' => $perfil['Nome'] ?? '',
            'cidade' => $perfil['Cidade'] ?? '',
            'foto' => !empty($perfil['Foto']) ? './backend/imagens/publica.php?tipo=perfil&id=' . (int)$perfil['idPerfis'] : './Imagens/default-profile.jpg',
            'premium' => (bool)$perfil['Premium'],
            'generos' => $generosPerfil,
        ],
        'livros' => $livros,
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

http_response_code(400);
echo json_encode(['erro' => 'Ação inválida.'], JSON_UNESCAPED_UNICODE);
