<?php
require_once __DIR__ . '/../includes/config.php';

header('Content-Type: application/json; charset=utf-8');

if (!isset($_SESSION['usuario_id'])) {
    http_response_code(401);
    echo json_encode(['erro' => 'não autenticado'], JSON_UNESCAPED_UNICODE);
    exit;
}

$idDono = (int)$_SESSION['usuario_id'];

$stmt = $conn->prepare("
    SELECT idLivrosADMs, Nome, Autor, Editora, AnoPublicacao, Genero, EstadoConservacao, Observacoes, Fotolivro
    FROM LivrosADMs
    WHERE IdDono = ? AND Status = 0
    ORDER BY idLivrosADMs DESC
");
$stmt->bind_param("i", $idDono);
$stmt->execute();
$resultado = $stmt->get_result();

$livros = [];
while ($row = $resultado->fetch_assoc()) {
    $livros[] = [
        'idLivrosADMs' => (int)$row['idLivrosADMs'],
        'Nome' => $row['Nome'] ?? '',
        'Autor' => $row['Autor'] ?? '',
        'Editora' => $row['Editora'] ?? '',
        'Ano' => $row['Ano'] ?? '',
        'Genero' => $row['Genero'] ?? '',
        'Estado' => $row['Estado'] ?? '',
        'Observacoes' => $row['Observacoes'] ?? '',
        'foto' => !empty($row['Fotolivro']) ? blobParaDataUri($row['Fotolivro'], 'image/png') : './Imagens/sem_livros.png'
    ];
}

echo json_encode($livros, JSON_UNESCAPED_UNICODE);
exit;
?>
