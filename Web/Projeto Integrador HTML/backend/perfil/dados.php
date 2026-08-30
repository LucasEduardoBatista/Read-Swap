<?php
require_once __DIR__ . '/../includes/config.php';

header('Content-Type: application/json; charset=utf-8');

if (!isset($_SESSION['usuario_id'])) {
    http_response_code(401);
    echo json_encode(['erro' => 'não autenticado'], JSON_UNESCAPED_UNICODE);
    exit;
}

$usuario = usuarioAtual($conn);

if (!$usuario) {
    http_response_code(404);
    echo json_encode(['erro' => 'usuário não encontrado'], JSON_UNESCAPED_UNICODE);
    exit;
}

$usuarioId = (int)$usuario['idPerfis'];
$stmt = $conn->prepare('SELECT COUNT(*) AS total, COALESCE(SUM(Status = 1), 0) AS trocados FROM LivrosADMs WHERE IdDono = ?');
$stmt->bind_param('i', $usuarioId);
$stmt->execute();
$resumoLivros = $stmt->get_result()->fetch_assoc() ?: ['total' => 0, 'trocados' => 0];

$stmt = $conn->prepare('SELECT COUNT(*) AS total FROM SwapsADMs WHERE idUsuario = ? AND Gostou = 1');
$stmt->bind_param('i', $usuarioId);
$stmt->execute();
$resumoMatches = $stmt->get_result()->fetch_assoc() ?: ['total' => 0];

$foto = !empty($usuario['Foto']) ? blobParaDataUri($usuario['Foto'], 'image/png') : './Imagens/default-profile.jpg';
$generos = [];
if (!empty($usuario['Generos'])) {
    $dec = json_decode($usuario['Generos'], true);
    if (is_array($dec)) {
        $generos = array_values($dec);
    }
}

echo json_encode([
    'idPerfis' => (int)$usuario['idPerfis'],
    'nome' => $usuario['Nome'] ?? '',
    'email' => $usuario['Email'] ?? '',
    'cidade' => $usuario['Cidade'] ?? '',
    'premium' => (int)($usuario['Premium'] ?? 0),
    'status' => (int)($usuario['Status'] ?? 0),
    'generos' => $generos,
    'foto' => $foto,
    'totalLivros' => (int)$resumoLivros['total'],
    'totalTrocas' => (int)$resumoLivros['trocados'],
    'totalMatches' => (int)$resumoMatches['total'],
], JSON_UNESCAPED_UNICODE);
exit;
?>
