<?php
declare(strict_types=1);

if (PHP_SAPI !== 'cli') {
    http_response_code(404);
    exit;
}

require_once __DIR__ . '/includes/config.php';

$marcador = '[SEED_MANGAS_READSWAP]';
$catalogoPath = __DIR__ . '/../Imagens/mangas-teste/catalogo.json';
$catalogoJson = file_get_contents($catalogoPath);
if ($catalogoJson === false) {
    fwrite(STDERR, "Catálogo de mangás não encontrado.\n");
    exit(1);
}
$catalogoJson = preg_replace('/^\xEF\xBB\xBF/', '', $catalogoJson) ?? $catalogoJson;
$catalogo = json_decode($catalogoJson, true);
if (!is_array($catalogo) || count($catalogo) < 24) {
    fwrite(STDERR, "O catálogo precisa conter pelo menos 24 mangás.\n");
    exit(1);
}

$usuarios = $conn->query('SELECT idPerfis, Nome FROM PerfisADMs WHERE Status = 0 ORDER BY idPerfis')->fetch_all(MYSQLI_ASSOC);
if (count($usuarios) * 3 > count($catalogo)) {
    fwrite(STDERR, "Não há mangás suficientes para distribuir três títulos por conta.\n");
    exit(1);
}

$verifica = $conn->prepare('SELECT 1 FROM LivrosADMs WHERE IdDono = ? AND Observacoes LIKE ? LIMIT 1');
$insere = $conn->prepare('
    INSERT INTO LivrosADMs
        (Nome, Autor, Editora, AnoPublicacao, Genero, EstadoConservacao, Observacoes, IdDono, Status, Fotolivro)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?)
');

$buscaMarcador = '%' . $marcador . '%';
$inseridos = 0;
$ignorados = 0;
$indiceCatalogo = 0;

$conn->begin_transaction();
try {
    foreach ($usuarios as $usuario) {
        $idDono = (int)$usuario['idPerfis'];
        $verifica->bind_param('is', $idDono, $buscaMarcador);
        $verifica->execute();
        if ($verifica->get_result()->fetch_row()) {
            $ignorados += 3;
            $indiceCatalogo += 3;
            continue;
        }

        for ($posicao = 0; $posicao < 3; $posicao++, $indiceCatalogo++) {
            $manga = $catalogo[$indiceCatalogo];
            $numeroCapa = str_pad((string)($indiceCatalogo + 1), 2, '0', STR_PAD_LEFT);
            $capaPath = __DIR__ . '/../Imagens/mangas-teste/' . $numeroCapa . '.jpg';
            $foto = file_get_contents($capaPath);
            if ($foto === false) {
                throw new RuntimeException('Não foi possível ler a capa ' . $numeroCapa . '.jpg');
            }

            $tituloCompleto = trim((string)($manga['title']['romaji'] ?? 'Mangá de teste'));
            $nome = function_exists('mb_substr') ? mb_substr($tituloCompleto, 0, 45, 'UTF-8') : substr($tituloCompleto, 0, 45);
            $autor = 'Autores diversos';
            $editora = 'Edição internacional';
            $ano = max(1900, (int)($manga['startDate']['year'] ?? 2020));
            $generosLista = array_values(array_filter(array_map('strval', $manga['genres'] ?? [])));
            $genero = $generosLista ? implode(', ', array_slice($generosLista, 0, 3)) : 'Mangá';
            $estado = ['Como novo', 'Muito bom', 'Bom'][$indiceCatalogo % 3];
            $observacoes = $marcador . ' Volume de teste com capa obtida da AniList.';

            $insere->bind_param('sssisssis', $nome, $autor, $editora, $ano, $genero, $estado, $observacoes, $idDono, $foto);
            $insere->execute();
            $inseridos++;
        }
    }
    $conn->commit();
} catch (Throwable $erro) {
    $conn->rollback();
    fwrite(STDERR, 'Falha ao criar mangás de teste: ' . $erro->getMessage() . PHP_EOL);
    exit(1);
}

echo "Mangás inseridos: {$inseridos}" . PHP_EOL;
echo "Mangás já existentes: {$ignorados}" . PHP_EOL;
