<?php

$conn = new mysqli(
    "143.106.241.4",
    "cl204224",
    "cl*27102008",
    "cl204224"
);

if ($conn->connect_error) {
    die("Erro: " . $conn->connect_error);
}

echo "Conectado com sucesso!";