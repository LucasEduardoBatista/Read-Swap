<?php
require_once __DIR__ . '/../includes/config.php';

exigirLogin('../../login.html');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: ../../livros.html');
    exit;
}
exigirCsrf();

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

$generosPermitidos = ['Romance', 'Fantasia', 'Ficção Científica', 'Terror', 'Suspense/Thriller', 'Mistério', 'Aventura', 'Drama', 'Biografia', 'Autoajuda', 'Didático', 'Clássicos', 'Poesia', 'Crônicas', 'Contos', 'HQ/Quadrinhos', 'Infantojuvenil', 'História', 'Não ficção', 'Outros'];
$estadosPermitidos = ['Novo', 'Usado - Ótimo estado', 'Usado - Bom estado', 'Usado - Regular', 'Com marcas de uso'];
if (tamanhoTexto($nome) < 3 || tamanhoTexto($nome) > 80
    || tamanhoTexto($autor) < 3 || tamanhoTexto($autor) > 30
    || tamanhoTexto($editora) < 3 || tamanhoTexto($editora) > 30
    || $ano < 1500 || $ano > (int)date('Y')
    || !in_array($genero, $generosPermitidos, true)
    || !in_array($estado, $estadosPermitidos, true)
    || tamanhoTexto($observacoes) > 1000) {
    responderErro('Os dados do livro são inválidos.', '../../livros.html');
}

try {
    $fotoBin = lerImagemUpload($_FILES['foto'] ?? []);
} catch (RuntimeException $erro) {
    responderErro($erro->getMessage(), '../../livros.html');
}

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
