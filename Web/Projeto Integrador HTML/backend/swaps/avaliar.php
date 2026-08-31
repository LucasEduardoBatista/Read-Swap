<?php
require_once __DIR__ . '/../includes/config.php';
header('Content-Type: application/json; charset=utf-8');

if (!isset($_SESSION['usuario_id'])) {
    http_response_code(401);
    echo json_encode(['erro' => 'Você precisa estar logado.'], JSON_UNESCAPED_UNICODE);
    exit;
}
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['erro' => 'Método não permitido.'], JSON_UNESCAPED_UNICODE);
    exit;
}
exigirCsrf();

$usuarioId = (int)$_SESSION['usuario_id'];
$livroId = filter_input(INPUT_POST, 'livro_id', FILTER_VALIDATE_INT);
$gostou = filter_input(INPUT_POST, 'gostou', FILTER_VALIDATE_INT);
if (!$livroId || !in_array($gostou, [0, 1], true)) {
    http_response_code(422);
    echo json_encode(['erro' => 'Avaliação inválida.'], JSON_UNESCAPED_UNICODE);
    exit;
}

$valida = $conn->prepare('SELECT IdDono FROM LivrosADMs WHERE idLivrosADMs = ? AND IdDono <> ? AND Status = 0');
$valida->bind_param('ii', $livroId, $usuarioId);
$valida->execute();
$livro = $valida->get_result()->fetch_assoc();
if (!$livro) {
    http_response_code(404);
    echo json_encode(['erro' => 'Livro indisponível.'], JSON_UNESCAPED_UNICODE);
    exit;
}

$stmt = $conn->prepare('INSERT INTO SwapsADMs (idUsuario, idLivro, Gostou) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE Gostou = VALUES(Gostou), DataAvaliacao = CURRENT_TIMESTAMP');
$stmt->bind_param('iii', $usuarioId, $livroId, $gostou);
$stmt->execute();

$houveMatch = false;
if ($gostou === 1) {
    $verificaReciprocidade = $conn->prepare('
        SELECT 1
        FROM SwapsADMs s
        INNER JOIN LivrosADMs l ON l.idLivrosADMs = s.idLivro
        WHERE s.idUsuario = ? AND l.IdDono = ? AND s.Gostou = 1
        LIMIT 1
    ');
    $idDono = (int)$livro['IdDono'];
    $verificaReciprocidade->bind_param('ii', $idDono, $usuarioId);
    $verificaReciprocidade->execute();
    $houveMatch = (bool)$verificaReciprocidade->get_result()->fetch_row();
}

if (!isset($_SESSION['livros_swap_passados']) || !is_array($_SESSION['livros_swap_passados'])) {
    $_SESSION['livros_swap_passados'] = [];
}
if (!in_array((int)$livroId, $_SESSION['livros_swap_passados'], true)) {
    $_SESSION['livros_swap_passados'][] = (int)$livroId;
}

echo json_encode([
    'sucesso' => true,
    'match' => $houveMatch,
    'interesseEnviado' => $gostou === 1,
    'idDono' => (int)$livro['IdDono']
], JSON_UNESCAPED_UNICODE);
