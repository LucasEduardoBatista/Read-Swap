<?php
require_once __DIR__ . '/../includes/config.php';

exigirLogin('../../login.html');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit;
}
exigirCsrf();

$id = (int)($_POST['id'] ?? 0);
$usuarioId = (int)$_SESSION['usuario_id'];
 

if ($id <= 0) {
    responderErro('Livro inválido.', '../../biblioteca.html');
}

$stmt = $conn->prepare("UPDATE LivrosADMs SET Status = 1 - Status WHERE idLivrosADMs = ? AND IdDono = ?");
$stmt->bind_param("ii", $id, $usuarioId);
$stmt->execute();
echo "<!doctype html><html lang='pt-br'><head><meta charset='utf-8'><meta name='viewport' content='width=device-width, initial-scale=1'><script>alert('Processo concluido');window.location.href='../../biblioteca.html';</script></head><body></body></html>";
exit;
?>
