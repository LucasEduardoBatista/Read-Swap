<?php
require_once __DIR__ . '/../includes/config.php';
header('Content-Type: application/json; charset=utf-8');

if (!isset($_SESSION['usuario_id'])) {
    http_response_code(401);
    echo json_encode(['erro' => 'Você precisa estar logado.'], JSON_UNESCAPED_UNICODE);
    exit;
}

$usuarioId = (int)$_SESSION['usuario_id'];
$livrosPassados = array_values(array_unique(array_map(
    'intval',
    is_array($_SESSION['livros_swap_passados'] ?? null) ? $_SESSION['livros_swap_passados'] : []
)));
$stmt = $conn->prepare("
    SELECT l.idLivrosADMs, l.Nome, l.Autor, l.Editora, l.AnoPublicacao,
           l.Genero, l.EstadoConservacao, l.Observacoes, l.Fotolivro,
           p.idPerfis AS idDono, p.Nome AS nomeDono, p.Cidade, p.Foto AS fotoDono
    FROM LivrosADMs l
    INNER JOIN PerfisADMs p ON p.idPerfis = l.IdDono
    WHERE l.IdDono <> ? AND l.Status = 0 AND p.Status = 0
    ORDER BY l.idLivrosADMs DESC
");
$stmt->bind_param('i', $usuarioId);
$stmt->execute();
$resultado = $stmt->get_result();
$livros = [];

while ($row = $resultado->fetch_assoc()) {
    $livroId = (int)$row['idLivrosADMs'];
    if (in_array($livroId, $livrosPassados, true)) {
        continue;
    }
    $livros[] = [
        'id' => $livroId,
        'titulo' => $row['Nome'] ?? '',
        'autor' => $row['Autor'] ?? '',
        'editora' => $row['Editora'] ?? '',
        'ano' => $row['AnoPublicacao'] ?? '',
        'generos' => array_values(array_filter(array_map('trim', explode(',', $row['Genero'] ?? '')))),
        'estado' => $row['EstadoConservacao'] ?? '',
        'observacoes' => $row['Observacoes'] ?? '',
        'img' => !empty($row['Fotolivro']) ? blobParaDataUri($row['Fotolivro']) : './Imagens/sem_livros.png',
        'idDono' => (int)$row['idDono'],
        'dono' => $row['nomeDono'] ?? '',
        'cidade' => $row['Cidade'] ?? '',
        'fotoDono' => !empty($row['fotoDono']) ? blobParaDataUri($row['fotoDono']) : './Imagens/default-profile.jpg'
    ];
}

echo json_encode($livros, JSON_UNESCAPED_UNICODE);
