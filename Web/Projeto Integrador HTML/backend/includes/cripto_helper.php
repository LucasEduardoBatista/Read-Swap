<?php
/**
 * cripto_helper.php
 * Utilitário de criptografia AES-256-CBC compartilhado entre os backends
 * Web (conversas.php) e Mobile (router.php).
 *
 * A chave e o IV DEVEM ser idênticos ao CriptoHelper.cs do projeto Desktop
 * para que o painel admin consiga ler as mensagens salvas pelo Web/Mobile.
 */

define('CRIPTO_CHAVE', 'ReadSwap2025!CriptoKey#AES256BCX'); // 32 bytes
define('CRIPTO_IV',    'RS!IV16BytesXXXX');                 // 16 bytes

/**
 * Criptografa um texto com AES-256-CBC e retorna em Base64.
 */
function criptografar(string $texto): string
{
    $cifrado = openssl_encrypt(
        $texto,
        'AES-256-CBC',
        CRIPTO_CHAVE,
        OPENSSL_RAW_DATA,
        CRIPTO_IV
    );
    return base64_encode($cifrado);
}

/**
 * Descriptografa uma string Base64 cifrada com AES-256-CBC.
 * Se a descriptografia falhar (ex.: texto legado em texto puro),
 * retorna o valor original — compatibilidade retroativa.
 */
function descriptografar(string $valor): string
{
    // Detecta se parece ser Base64 válido antes de tentar descriptografar
    $decoded = base64_decode($valor, true);
    if ($decoded === false) {
        return $valor; // não é Base64 — texto puro legado
    }

    $decifrado = openssl_decrypt(
        $decoded,
        'AES-256-CBC',
        CRIPTO_CHAVE,
        OPENSSL_RAW_DATA,
        CRIPTO_IV
    );

    return $decifrado !== false ? $decifrado : $valor;
}
