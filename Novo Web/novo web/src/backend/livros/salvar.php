<?php
require_once __DIR__ . '/../includes/config.php';

exigirLogin('../../login.html');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: ../../livros.html');
    exit;
}

$nome = trim($_POST['titulo'] ?? '');
$autor = trim($_POST['autor'] ?? '');
$editora = trim($_POST['editora'] ?? '');
$ano = (int)($_POST['ano'] ?? 0);
$genero = trim($_POST['genero'] ?? '');
$estado = trim($_POST['estado'] ?? '');
$observacoes = trim($_POST['observacoes'] ?? '');
$idDono = (int)$_SESSION['usuario_id'];

if ($nome === '' || $autor === '' || $editora === '' || $ano <= 0 || $genero === '' || $estado === '') {
    responderErro('Preencha os campos obrigatórios do livro.', '../../livros.html');
}

if (!isset($_FILES['foto']) || $_FILES['foto']['error'] !== UPLOAD_ERR_OK || !is_uploaded_file($_FILES['foto']['tmp_name'])) {
    responderErro('Envie uma foto válida do livro.', '../../livros.html');
}

$fotoBin = file_get_contents($_FILES['foto']['tmp_name']);

$status = 0;
$stmt = $conn->prepare("
    INSERT INTO LivrosADMs
    (Nome, Autor, Editora, AnoPublicacao, Genero, EstadoConservacao, Observacoes, IdDono, Status, Fotolivro)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
");
$stmt->bind_param("ssssssssss", $nome, $autor, $editora, $ano, $genero, $estado, $observacoes, $idDono, $status, $fotoBin);

if (!$stmt->execute()) {
    responderErro('Não foi possível salvar o livro.', '../../livros.html');
}

echo "<!doctype html><html lang='pt-br'><head><meta charset='utf-8'><meta name='viewport' content='width=device-width, initial-scale=1'><script>alert('Livro cadastrado com sucesso.');window.location.href='../../biblioteca.html';</script></head><body></body></html>";
exit;
?>
