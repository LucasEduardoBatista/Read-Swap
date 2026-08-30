<?php
if (session_status() === PHP_SESSION_NONE) {
    ini_set('session.use_strict_mode', '1');
    ini_set('session.use_only_cookies', '1');
    session_set_cookie_params([
        'httponly' => true,
        'secure' => !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
        'samesite' => 'Lax'
    ]);
    session_start();
}

$configLocal = __DIR__ . '/config.local.php';
$db = is_file($configLocal) ? require $configLocal : [
    'host' => getenv('READSWAP_DB_HOST') ?: '',
    'user' => getenv('READSWAP_DB_USER') ?: '',
    'password' => getenv('READSWAP_DB_PASSWORD') ?: '',
    'database' => getenv('READSWAP_DB_NAME') ?: '',
    'port' => (int)(getenv('READSWAP_DB_PORT') ?: 3306)
];

try {
    mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
    $conn = mysqli_init();
    $conn->options(MYSQLI_OPT_CONNECT_TIMEOUT, 5);
    $conn->real_connect($db['host'], $db['user'], $db['password'], $db['database'], $db['port'] ?? 3306);
    $conn->set_charset('utf8mb4');
} catch (mysqli_sql_exception $e) {
    error_log('ReadSwap: falha na conexão MySQL: ' . $e->getMessage());
    http_response_code(503);
    die("<!doctype html><html lang='pt-br'><head><meta charset='utf-8'><title>Serviço indisponível</title></head><body><p>Não foi possível conectar ao banco de dados. Tente novamente em alguns instantes.</p></body></html>");
}

function responderErro(string $mensagem, string $destino): void {
    $mensagemJs = json_encode($mensagem, JSON_UNESCAPED_UNICODE);
    $destinoJs = json_encode($destino, JSON_UNESCAPED_UNICODE);

    echo "<!doctype html><html lang='pt-br'><head><meta charset='utf-8'><meta name='viewport' content='width=device-width, initial-scale=1'><script>alert($mensagemJs);window.location.href=$destinoJs;</script></head><body></body></html>";
    exit;
}

function responderSucessoLogin(array $usuario, string $destino = '../../index.html'): void {
    session_regenerate_id(true);
    unset($_SESSION['livros_swap_passados']);
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

function normalizarEmail(string $email): string {
    $email = trim($email);
    return function_exists('mb_strtolower') ? mb_strtolower($email, 'UTF-8') : strtolower($email);
}

function tamanhoTexto(string $texto): int {
    if (function_exists('mb_strlen')) {
        return mb_strlen($texto, 'UTF-8');
    }
    $resultado = preg_match_all('/./us', $texto, $caracteres);
    return $resultado === false ? strlen($texto) : $resultado;
}
?>
