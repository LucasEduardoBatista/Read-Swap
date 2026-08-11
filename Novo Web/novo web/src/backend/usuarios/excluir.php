<?php
require_once __DIR__ . '/../includes/config.php';

exigirLogin('../../login.html');

$id = (int)$_SESSION['usuario_id'];

$stmt = $conn->prepare("UPDATE PerfisADMs SET Status = 1 WHERE idPerfis = ?");
$stmt->bind_param("i", $id);
$stmt->execute();

responderLogout('../../index.html');
?>
