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
], JSON_UNESCAPED_UNICODE);
exit;
?>
