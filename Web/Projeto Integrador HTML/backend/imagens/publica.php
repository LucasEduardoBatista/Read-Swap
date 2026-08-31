<?php
require_once __DIR__ . '/../includes/config.php';

$tipo = $_GET['tipo'] ?? '';
$id = filter_var($_GET['id'] ?? null, FILTER_VALIDATE_INT);
if (!$id || !in_array($tipo, ['perfil', 'livro'], true)) {
    http_response_code(404);
    exit;
}

if ($tipo === 'perfil') {
    $stmt = $conn->prepare('SELECT Foto AS imagem FROM PerfisADMs WHERE idPerfis = ? AND Status = 0 LIMIT 1');
} else {
    $stmt = $conn->prepare('SELECT Fotolivro AS imagem FROM LivrosADMs WHERE idLivrosADMs = ? AND Status = 0 LIMIT 1');
}
$stmt->bind_param('i', $id);
$stmt->execute();
$linha = $stmt->get_result()->fetch_assoc();
$imagem = $linha['imagem'] ?? '';
if ($imagem === '') {
    http_response_code(404);
    exit;
}

function detectarMimeImagem(string $conteudo): ?string {
    if (str_starts_with($conteudo, "\xFF\xD8\xFF")) {
        return 'image/jpeg';
    }
    if (str_starts_with($conteudo, "\x89PNG\x0D\x0A\x1A\x0A")) {
        return 'image/png';
    }
    if (str_starts_with($conteudo, 'GIF87a') || str_starts_with($conteudo, 'GIF89a')) {
        return 'image/gif';
    }
    if (substr($conteudo, 0, 4) === 'RIFF' && substr($conteudo, 8, 4) === 'WEBP') {
        return 'image/webp';
    }
    return null;
}

$mime = detectarMimeImagem($imagem);
if ($mime === null) {
    http_response_code(415);
    exit;
}

header('Content-Type: ' . $mime);
header('Content-Length: ' . strlen($imagem));
header('Cache-Control: public, max-age=3600');
echo $imagem;
