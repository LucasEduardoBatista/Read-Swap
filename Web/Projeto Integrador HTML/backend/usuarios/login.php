<?php
require_once __DIR__ . '/../includes/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: ../../login.html');
    exit;
}

$email = trim($_POST['login'] ?? $_POST['email'] ?? '');
$senha = $_POST['senha'] ?? '';

if ($email === '' || $senha === '') {
    responderErro('Preencha e-mail e senha.', '../../login.html');
}

$stmt = $conn->prepare("SELECT * FROM PerfisADMs WHERE Email = ? LIMIT 1");
$stmt->bind_param("s", $email);
$stmt->execute();
$resultado = $stmt->get_result();
$usuario = $resultado->fetch_assoc();

if (!$usuario) {
    responderErro('E-mail ou senha incorretos.', '../../login.html');
}

if ((int)($usuario['Status'] ?? 1) !== 0) {
    responderErro('Sua conta está inativa.', '../../login.html');
}

if (!password_verify($senha, $usuario['Senha'] ?? '')) {
    responderErro('E-mail ou senha incorretos.', '../../login.html');
}

responderSucessoLogin($usuario, '../../index.html');
?>
