<?php
require_once __DIR__ . '/../includes/config.php';

exigirLogin('../../login.html');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: ../../editarPerfil.html');
    exit;
}
exigirCsrf();

$id = (int)$_SESSION['usuario_id'];
$nome = trim($_POST['nome'] ?? '');
$cidade = trim($_POST['cidade'] ?? '');
$generosPermitidos = ['Fantasia', 'Romance', 'Aventura', 'Drama', 'Contos', 'Terror', 'Mistério', 'Suspense/Thriller', 'Ficção Científica', 'Biografia', 'HQ/Quadrinhos', 'Clássicos'];
$generosRecebidos = is_array($_POST['generos'] ?? null) ? $_POST['generos'] : [];
$generosSelecionados = array_values(array_unique(array_filter(
    $generosRecebidos,
    static fn($genero) => is_string($genero) && in_array($genero, $generosPermitidos, true)
)));
$generosJson = json_encode($generosSelecionados, JSON_UNESCAPED_UNICODE);

if (tamanhoTexto($nome) < 2 || tamanhoTexto($nome) > 50 || tamanhoTexto($cidade) < 2 || tamanhoTexto($cidade) > 60) {
    responderErro('Informe um nome e uma cidade válidos.', '../../editarPerfil.html');
}

$usuarioAtual = usuarioAtual($conn);
if (!$usuarioAtual) {
    responderErro('Usuário não encontrado.', '../../login.html');
}

$fotobin = null;
if (isset($_FILES['fotoPerfil']) && ($_FILES['fotoPerfil']['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_NO_FILE) {
    try {
        $fotobin = lerImagemUpload($_FILES['fotoPerfil']);
    } catch (RuntimeException $erro) {
        responderErro($erro->getMessage(), '../../editarPerfil.html');
    }
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
