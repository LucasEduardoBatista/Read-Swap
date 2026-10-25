using System;
using System.Diagnostics;
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
                        private static readonly byte[] Chave = Encoding.UTF8.GetBytes("ReadSwap2025!CriptoKey#AES256BCX");

                // 16 bytes (128 bits) — deve ser igual a CRIPTO_IV no PHP
                private static readonly byte[] IV = Encoding.UTF8.GetBytes("RS!IV16BytesXXXX");

                static CriptoHelper()
                {
                    Debug.WriteLine($"[CriptoHelper] Key length: {Chave.Length} bytes (expected 32)");
                    Debug.WriteLine($"[CriptoHelper] Key hex: {BitConverter.ToString(Chave).Replace("-", "")}");
                    Debug.WriteLine($"[CriptoHelper] IV length: {IV.Length} bytes (expected 16)");
                    Debug.WriteLine($"[CriptoHelper] IV hex: {BitConverter.ToString(IV).Replace("-", "")}");
                }

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
                /// Suporta o formato do PHP: "enc:v1:<base64>" ou Base64 puro.
                /// Se o valor não for Base64 válido (após remover prefixo), assume texto puro legado e retorna como está.
                /// Se for Base64 válido mas a descriptografia falhar, lança exceção para não mascarar erros.
                /// </summary>
                public static string Descriptografar(string valor)
                {
                    if (string.IsNullOrEmpty(valor))
                        return valor;

                    // Remove prefixo "enc:v1:" se presente (formato do PHP)
                    string base64Payload = valor;
                    const string prefix = "enc:v1:";
                    if (valor.StartsWith(prefix, StringComparison.Ordinal))
                    {
                        base64Payload = valor.Substring(prefix.Length);
                        Debug.WriteLine($"[CriptoHelper] Prefixo 'enc:v1:' removido. Payload: {base64Payload.Substring(0, Math.Min(50, base64Payload.Length))}...");
                    }

                    // Tenta decodificar Base64 — se falhar, é texto puro (legado)
                    byte[] cifrado;
                    try
                    {
                        cifrado = Convert.FromBase64String(base64Payload);
                    }
                    catch (FormatException)
                    {
                        Debug.WriteLine($"[CriptoHelper] Texto legado (não Base64): {valor.Substring(0, Math.Min(50, valor.Length))}...");
                        return valor; // não é Base64 → texto puro legado
                    }

                    // É Base64 válido: tenta descriptografar com AES
                    try
                    {
                        using (var aes = Aes.Create())
                        {
                            aes.Key = Chave;
                            aes.IV = IV;
                            aes.Mode = CipherMode.CBC;
                            aes.Padding = PaddingMode.PKCS7;

                            var decryptor = aes.CreateDecryptor();
                            var decifrado = decryptor.TransformFinalBlock(cifrado, 0, cifrado.Length);
                            var resultado = Encoding.UTF8.GetString(decifrado);
                            Debug.WriteLine($"[CriptoHelper] Descriptografado OK: {resultado.Substring(0, Math.Min(50, resultado.Length))}...");
                            return resultado;
                        }
                    }
                    catch (CryptographicException ex)
                    {
                        // Base64 válido mas falha criptográfica (chave/IV errados, dados corrompidos)
                        // Lança para não retornar lixo criptografado como se fosse texto legível
                        Debug.WriteLine($"[CriptoHelper] FALHA AES: {ex.Message} | Valor (primeiros 50 chars): {valor.Substring(0, Math.Min(50, valor.Length))}");
                        throw new InvalidOperationException("Falha ao descriptografar mensagem (chave/IV incorretos ou dados corrompidos).", ex);
                    }
                }
    }
}
