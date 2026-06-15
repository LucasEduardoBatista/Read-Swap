<?php
require_once __DIR__ . '/../includes/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: ../../cadastro.html');
    exit;
}

$nome = trim($_POST['nome'] ?? '');
$email = trim($_POST['email'] ?? '');
$senha = $_POST['senha'] ?? '';
$confirmaSenha = $_POST['confirmaSenha'] ?? '';

if ($nome === '' || $email === '' || $senha === '' || $confirmaSenha === '') {
    responderErro('Preencha todos os campos obrigatórios.', '../../cadastro.html');
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    responderErro('Digite um e-mail válido.', '../../cadastro.html');
}

if ($senha !== $confirmaSenha) {
    responderErro('As senhas não coincidem.', '../../cadastro.html');
}

$stmt = $conn->prepare("
    SELECT idPerfis
    FROM PerfisADMs
    WHERE Email = ?
    LIMIT 1
");

$stmt->bind_param("s", $email);
$stmt->execute();

$resultado = $stmt->get_result();

if ($resultado->num_rows > 0) {
    responderErro('Este e-mail já está cadastrado. Faça login.', '../../login.html');
}

$senhaHash = password_hash($senha, PASSWORD_DEFAULT);

$status = 0;   // ativa
$premium = 0;  // não premium

$stmt = $conn->prepare("
    INSERT INTO PerfisADMs
    (Nome, Email, Status, Senha, Premium)
    VALUES (?, ?, ?, ?, ?)
");

$stmt->bind_param(
    "ssisi",
    $nome,
    $email,
    $status,
    $senhaHash,
    $premium
);

if (!$stmt->execute()) {
    responderErro(
        'Não foi possível salvar o cadastro: ' . $stmt->error,
        '../../cadastro.html'
    );
}

$novoUsuario = [
    'idPerfis' => $stmt->insert_id,
    'Nome' => $nome,
    'Email' => $email
];

responderSucessoLogin(
    $novoUsuario,
    '../../index.html'
);
?>