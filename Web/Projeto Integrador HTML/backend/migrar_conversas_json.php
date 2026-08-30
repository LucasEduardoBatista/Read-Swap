<?php
if (PHP_SAPI !== 'cli') {
    http_response_code(404);
    exit;
}

require_once __DIR__ . '/includes/config.php';

if ($conn->query("SHOW TABLES LIKE 'conversasADMs_backup_json'")->num_rows > 0) {
    fwrite(STDERR, "A tabela de backup já existe; migração cancelada.\n");
    exit(1);
}

$resultado = $conn->query('SELECT idConversa, id1, id2, conteudo, Statuscvs, DataEnvio FROM conversasADMs ORDER BY DataEnvio, idConversa');
$conversas = [];
$totalMensagens = 0;
foreach ($resultado as $row) {
    $id1 = min((int)$row['id1'], (int)$row['id2']);
    $id2 = max((int)$row['id1'], (int)$row['id2']);
    $chave = $id1 . ':' . $id2;
    $conversas[$chave] ??= ['id1' => $id1, 'id2' => $id2, 'mensagens' => [], 'status' => 0, 'data' => $row['DataEnvio']];
    $conteudoJson = json_decode($row['conteudo'], true);
    $legadas = is_array($conteudoJson) && isset($conteudoJson[0]['remetente'])
        ? $conteudoJson
        : [['remetente' => (int)$row['id1'], 'texto' => $row['conteudo'], 'data' => $row['DataEnvio']]];
    foreach ($legadas as $mensagem) {
        $conversas[$chave]['mensagens'][] = $mensagem;
        $totalMensagens++;
    }
    $conversas[$chave]['status'] = max($conversas[$chave]['status'], (int)$row['Statuscvs']);
    $conversas[$chave]['data'] = max($conversas[$chave]['data'], $row['DataEnvio']);
}

$conn->query("CREATE TABLE conversasADMs_json_nova (
    idConversa INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    id1 INT NOT NULL,
    id2 INT NOT NULL,
    conteudo JSON NOT NULL COMMENT 'Histórico JSON das mensagens',
    Statuscvs TINYINT NOT NULL DEFAULT 0,
    DataEnvio DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_conversa_participantes (id1, id2),
    CONSTRAINT fk_conv_json_nova_id1 FOREIGN KEY (id1) REFERENCES PerfisADMs(idPerfis) ON DELETE CASCADE,
    CONSTRAINT fk_conv_json_nova_id2 FOREIGN KEY (id2) REFERENCES PerfisADMs(idPerfis) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

$stmt = $conn->prepare('INSERT INTO conversasADMs_json_nova (id1, id2, conteudo, Statuscvs, DataEnvio) VALUES (?, ?, ?, ?, ?)');
foreach ($conversas as $conversa) {
    foreach ($conversa['mensagens'] as $indice => &$mensagem) {
        $mensagem['id'] = $indice + 1;
        $mensagem['remetente'] = (int)$mensagem['remetente'];
        $mensagem['texto'] = (string)$mensagem['texto'];
        $mensagem['data'] = (string)$mensagem['data'];
    }
    unset($mensagem);
    $json = json_encode($conversa['mensagens'], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR);
    $id1 = $conversa['id1'];
    $id2 = $conversa['id2'];
    $status = $conversa['status'];
    $data = $conversa['data'];
    $stmt->bind_param('iisis', $id1, $id2, $json, $status, $data);
    $stmt->execute();
}

$checagem = $conn->query('SELECT COUNT(*) total FROM conversasADMs_json_nova')->fetch_assoc();
if ((int)$checagem['total'] !== count($conversas)) {
    $conn->query('DROP TABLE conversasADMs_json_nova');
    throw new RuntimeException('A validação da nova tabela falhou.');
}

$conn->query('RENAME TABLE conversasADMs TO conversasADMs_backup_json, conversasADMs_json_nova TO conversasADMs');
echo count($conversas) . " conversas e {$totalMensagens} mensagens migradas.\n";
echo "Backup preservado em conversasADMs_backup_json.\n";
