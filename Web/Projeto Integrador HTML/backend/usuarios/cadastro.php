<?php
require_once __DIR__ . '/../includes/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: ../../cadastro.html');
    exit;
}

$nome = trim($_POST['nome'] ?? '');
$email = normalizarEmail($_POST['email'] ?? '');
$confirmaEmail = normalizarEmail($_POST['confirmaEmail'] ?? '');
$senha = $_POST['senha'] ?? '';
$confirmaSenha = $_POST['confirmaSenha'] ?? '';

if ($nome === '' || $email === '' || $confirmaEmail === '' || $senha === '' || $confirmaSenha === '') {
    responderErro('Preencha todos os campos obrigatórios.', '../../cadastro.html');
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 255) {
    responderErro('Digite um e-mail válido.', '../../cadastro.html');
}
exigirCsrf();
if (!hash_equals($email, $confirmaEmail)) {
    responderErro('Os endereços de e-mail não coincidem.', '../../cadastro.html');
}
if (tamanhoTexto($nome) < 3 || tamanhoTexto($nome) > 255) {
    responderErro('Digite um nome válido.', '../../cadastro.html');
}
if (strlen($senha) < 8 || strlen($senha) > 72) {
    responderErro('A senha deve ter entre 8 e 72 caracteres.', '../../cadastro.html');
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

try {
    $stmt->execute();
} catch (mysqli_sql_exception $e) {
    error_log('ReadSwap: falha ao cadastrar usuário: ' . $stmt->error);
    responderErro('Não foi possível concluir o cadastro.', '../../cadastro.html');
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
