<?php
require_once __DIR__ . '/../includes/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: ../../login.html');
    exit;
}

$email = normalizarEmail($_POST['login'] ?? $_POST['email'] ?? '');
$senha = $_POST['senha'] ?? '';
$retornoSolicitado = strtolower(basename($_POST['retorno'] ?? 'index.html'));
$destinosPermitidos = [
    'index.html' => 'index.html',
    'biblioteca.html' => 'biblioteca.html',
    'livros.html' => 'livros.html',
    'swaps.html' => 'swaps.html',
    'matches.html' => 'matches.html',
    'perfil.html' => 'perfil.html',
    'editarperfil.html' => 'editarPerfil.html',
    'configuracoes.html' => 'configuracoes.html',
    'premium.html' => 'premium.html'
];
$destino = isset($destinosPermitidos[$retornoSolicitado])
    ? '../../' . $destinosPermitidos[$retornoSolicitado]
    : '../../index.html';

if ($email === '' || $senha === '') {
    responderErro('Preencha e-mail e senha.', '../../login.html');
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 255) {
    responderErro('Digite um e-mail válido.', '../../login.html');
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

$senhaArmazenada = $usuario['Senha'] ?? '';
$senhaCorreta = password_verify($senha, $senhaArmazenada);

// Converte com segurança contas antigas que ainda guardavam senha em texto puro.
if (!$senhaCorreta && password_get_info($senhaArmazenada)['algo'] === null && hash_equals($senhaArmazenada, $senha)) {
    $senhaCorreta = true;
    $novoHash = password_hash($senha, PASSWORD_DEFAULT);
    $atualiza = $conn->prepare('UPDATE PerfisADMs SET Senha = ? WHERE idPerfis = ?');
    $atualiza->bind_param('si', $novoHash, $usuario['idPerfis']);
    $atualiza->execute();
}

if (!$senhaCorreta) {
    responderErro('E-mail ou senha incorretos.', '../../login.html');
}

responderSucessoLogin($usuario, $destino);
?>
