<?php
require_once __DIR__ . '/../includes/config.php';

exigirLogin('../../login.html');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit;
}
exigirCsrf();

$id = (int)$_SESSION['usuario_id'];

$stmt = $conn->prepare("UPDATE PerfisADMs SET Status = 1 WHERE idPerfis = ?");
$stmt->bind_param("i", $id);
$stmt->execute();

responderLogout('../../index.html');
?>
