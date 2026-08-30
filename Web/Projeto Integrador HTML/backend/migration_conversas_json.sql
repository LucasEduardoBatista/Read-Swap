-- Esquema de referência da tabela consolidada.
-- Para migrar mensagens existentes, NÃO execute este arquivo isoladamente.
-- Use: php backend/migrar_conversas_json.php
CREATE TABLE conversasADMs_json (
    idConversa INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    id1 INT NOT NULL,
    id2 INT NOT NULL,
    conteudo JSON NOT NULL COMMENT 'Histórico JSON das mensagens',
    Statuscvs TINYINT NOT NULL DEFAULT 0,
    DataEnvio DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_conversa_participantes (id1, id2),
    CONSTRAINT fk_conv_json_id1 FOREIGN KEY (id1) REFERENCES PerfisADMs(idPerfis) ON DELETE CASCADE,
    CONSTRAINT fk_conv_json_id2 FOREIGN KEY (id2) REFERENCES PerfisADMs(idPerfis) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- A conversão dos textos legados deve ser feita pelo script de implantação,
-- usando json_encode para escapar corretamente acentos, aspas e quebras de linha.
