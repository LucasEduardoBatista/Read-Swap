<?php
require_once __DIR__ . '/../includes/config.php';

exigirLogin('../../login.html');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: ../../editarPerfil.html');
    exit;
}

$id = (int)$_SESSION['usuario_id'];
$nome = trim($_POST['nome'] ?? '');
$cidade = trim($_POST['cidade'] ?? '');
$generosSelecionados = $_POST['generos'] ?? [];
$generosJson = json_encode(array_values(array_filter((array)$generosSelecionados)));

if ($nome === '' || $cidade === '') {
    responderErro('Preencha nome e cidade.', '../../editarPerfil.html');
}

$usuarioAtual = usuarioAtual($conn);
if (!$usuarioAtual) {
    responderErro('Usuário não encontrado.', '../../login.html');
}

$fotobin = null;
if (isset($_FILES['fotoPerfil']) && $_FILES['fotoPerfil']['error'] === UPLOAD_ERR_OK && is_uploaded_file($_FILES['fotoPerfil']['tmp_name'])) {
    $fotobin = file_get_contents($_FILES['fotoPerfil']['tmp_name']);
}

if ($fotobin !== null) {
    $stmt = $conn->prepare("UPDATE PerfisADMs SET Nome = ?, Cidade = ?, Generos = ?, Foto = ? WHERE idPerfis = ?");
    $stmt->bind_param("ssssi", $nome, $cidade, $generosJson, $fotobin, $id);
} else {
    $stmt = $conn->prepare("UPDATE PerfisADMs SET Nome = ?, Cidade = ?, Generos = ? WHERE idPerfis = ?");
    $stmt->bind_param("sssi", $nome, $cidade, $generosJson, $id);
}

if (!$stmt->execute()) {
    responderErro('Não foi possível atualizar o perfil.', '../../editarPerfil.html');
}

$_SESSION['usuario_nome'] = $nome;

echo "<!doctype html><html lang='pt-br'><head><meta charset='utf-8'><meta name='viewport' content='width=device-width, initial-scale=1'><script>alert('Perfil atualizado com sucesso.');window.location.href='../../perfil.html';</script></head><body></body></html>";
exit;
?>
