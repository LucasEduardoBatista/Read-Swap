<?php
require_once __DIR__ . '/includes/config.php';
header('Content-Type: text/plain; charset=utf-8');
echo "Conectado com sucesso!\n";
echo 'Servidor MySQL: ' . $conn->server_info;
