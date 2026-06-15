<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$conn = new mysqli(
    "143.106.241.4",
    "cl204224",
    "cl*27102008",
    "cl204224"
);

if ($conn->connect_error) {
    die("Erro na conexão: " . $conn->connect_error);
}

$conn->set_charset("utf8mb4");

function responderErro(string $mensagem, string $destino): void {
    $mensagemJs = json_encode($mensagem, JSON_UNESCAPED_UNICODE);
    $destinoJs = json_encode($destino, JSON_UNESCAPED_UNICODE);

    echo "<!doctype html><html lang='pt-br'><head><meta charset='utf-8'><meta name='viewport' content='width=device-width, initial-scale=1'><script>alert($mensagemJs);window.location.href=$destinoJs;</script></head><body></body></html>";
    exit;
}

function responderSucessoLogin(array $usuario, string $destino = '../../index.html'): void {
    $_SESSION['usuario_id'] = (int)$usuario['idPerfis'];
    $_SESSION['usuario_nome'] = $usuario['Nome'];
    $_SESSION['usuario_email'] = $usuario['Email'];

    $nomeJs = json_encode($usuario['Nome'], JSON_UNESCAPED_UNICODE);
    $emailJs = json_encode($usuario['Email'], JSON_UNESCAPED_UNICODE);
    $destinoJs = json_encode($destino, JSON_UNESCAPED_UNICODE);

    echo "<!doctype html><html lang='pt-br'><head><meta charset='utf-8'><meta name='viewport' content='width=device-width, initial-scale=1'><script>
        sessionStorage.setItem('logado', 'true');
        sessionStorage.setItem('usuarioNome', $nomeJs);
        sessionStorage.setItem('usuarioEmail', $emailJs);
        window.location.href = $destinoJs;
    </script></head><body></body></html>";
    exit;
}

function responderLogout(string $destino = '../../index.html'): void {
    session_unset();
    session_destroy();

    $destinoJs = json_encode($destino, JSON_UNESCAPED_UNICODE);

    echo "<!doctype html><html lang='pt-br'><head><meta charset='utf-8'><meta name='viewport' content='width=device-width, initial-scale=1'><script>
        sessionStorage.removeItem('logado');
        sessionStorage.removeItem('usuarioNome');
        sessionStorage.removeItem('usuarioEmail');
        window.location.href = $destinoJs;
    </script></head><body></body></html>";
    exit;
}

function exigirLogin(string $destino = '../../login.html'): void {
    if (!isset($_SESSION['usuario_id'])) {
        responderErro('Você precisa estar logado.', $destino);
    }
}

function usuarioAtual(mysqli $conn): ?array {
    if (!isset($_SESSION['usuario_id'])) {
        return null;
    }

    $id = (int)$_SESSION['usuario_id'];
    $stmt = $conn->prepare("SELECT * FROM PerfisADMs WHERE idPerfis = ? LIMIT 1");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $resultado = $stmt->get_result();
    $usuario = $resultado->fetch_assoc();

    return $usuario ?: null;
}

function blobParaDataUri(?string $blob, string $mime = 'image/png'): string {
    if ($blob === null || $blob === '') {
        return '';
    }
    return 'data:' . $mime . ';base64,' . base64_encode($blob);
}
?>
