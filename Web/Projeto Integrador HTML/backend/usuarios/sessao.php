<?php
require_once __DIR__ . '/../includes/config.php';

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');

$usuario = usuarioAtual($conn);
if (!$usuario || (int)($usuario['Status'] ?? 1) !== 0) {
    session_unset();
    http_response_code(401);
    echo json_encode(['autenticado' => false], JSON_UNESCAPED_UNICODE);
    exit;
}

echo json_encode([
    'autenticado' => true,
    'usuario' => [
        'id' => (int)$usuario['idPerfis'],
        'nome' => $usuario['Nome'] ?? '',
        'email' => $usuario['Email'] ?? ''
    ]
], JSON_UNESCAPED_UNICODE);
