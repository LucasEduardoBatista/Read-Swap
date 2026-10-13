using System;
using System.Security.Cryptography;
using System.Text;

namespace Projeto.R_S
{
    /// <summary>
    /// Utilitário de criptografia AES-256-CBC para o painel Admin.
    /// A chave e o IV são IDÊNTICOS aos definidos em cripto_helper.php,
    /// garantindo que mensagens salvas pelo Web/Mobile sejam legíveis aqui.
    /// </summary>
    internal static class CriptoHelper
    {
        // 32 bytes (256 bits) — deve ser igual a CRIPTO_CHAVE no PHP
        private static readonly byte[] Chave = Encoding.UTF8.GetBytes("ReadSwap2025!CriptoKey#AES256BC");

        // 16 bytes (128 bits) — deve ser igual a CRIPTO_IV no PHP
        private static readonly byte[] IV = Encoding.UTF8.GetBytes("RS!IV16BytesXXXX");

        /// <summary>
        /// Criptografa um texto com AES-256-CBC e retorna em Base64.
        /// </summary>
        public static string Criptografar(string texto)
        {
            using (var aes = Aes.Create())
            {
                aes.Key = Chave;
                aes.IV = IV;
                aes.Mode = CipherMode.CBC;
                aes.Padding = PaddingMode.PKCS7;

                var encryptor = aes.CreateEncryptor();
                var bytes = Encoding.UTF8.GetBytes(texto);
                var cifrado = encryptor.TransformFinalBlock(bytes, 0, bytes.Length);
                return Convert.ToBase64String(cifrado);
            }
        }

        /// <summary>
        /// Descriptografa uma string Base64 cifrada com AES-256-CBC.
        /// Se a descriptografia falhar (registro legado em texto puro),
        /// retorna o valor original — compatibilidade retroativa.
        /// </summary>
        public static string Descriptografar(string valor)
        {
            if (string.IsNullOrEmpty(valor))
                return valor;

            try
            {
                var cifrado = Convert.FromBase64String(valor);

                using (var aes = Aes.Create())
                {
                    aes.Key = Chave;
                    aes.IV = IV;
                    aes.Mode = CipherMode.CBC;
                    aes.Padding = PaddingMode.PKCS7;

                    var decryptor = aes.CreateDecryptor();
                    var decifrado = decryptor.TransformFinalBlock(cifrado, 0, cifrado.Length);
                    return Encoding.UTF8.GetString(decifrado);
                }
            }
            catch
            {
                // Não é Base64 válido ou não foi cifrado com esta chave → texto puro legado
                return valor;
            }
        }
    }
}
