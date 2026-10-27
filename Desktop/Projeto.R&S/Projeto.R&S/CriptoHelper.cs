using System;
using System.Diagnostics;
using System.Security.Cryptography;
using System.Text;

namespace Projeto.R_S
{
   
            internal static class CriptoHelper
            {
               
                        private static readonly byte[] Chave = Encoding.UTF8.GetBytes("ReadSwap2025!CriptoKey#AES256BCX");

              
                private static readonly byte[] IV = Encoding.UTF8.GetBytes("RS!IV16BytesXXXX");

                static CriptoHelper()
                {
                    Debug.WriteLine($"[CriptoHelper] Key length: {Chave.Length} bytes (expected 32)");
                    Debug.WriteLine($"[CriptoHelper] Key hex: {BitConverter.ToString(Chave).Replace("-", "")}");
                    Debug.WriteLine($"[CriptoHelper] IV length: {IV.Length} bytes (expected 16)");
                    Debug.WriteLine($"[CriptoHelper] IV hex: {BitConverter.ToString(IV).Replace("-", "")}");
                }

     
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

      
                public static string Descriptografar(string valor)
                {
                    if (string.IsNullOrEmpty(valor))
                        return valor;

             
                    string base64Payload = valor;
                    const string prefix = "enc:v1:";
                    if (valor.StartsWith(prefix, StringComparison.Ordinal))
                    {
                        base64Payload = valor.Substring(prefix.Length);
                        Debug.WriteLine($"[CriptoHelper] Prefixo 'enc:v1:' removido. Payload: {base64Payload.Substring(0, Math.Min(50, base64Payload.Length))}...");
                    }

         
                    byte[] cifrado;
                    try
                    {
                        cifrado = Convert.FromBase64String(base64Payload);
                    }
                    catch (FormatException)
                    {
                        Debug.WriteLine($"[CriptoHelper] Texto legado (não Base64): {valor.Substring(0, Math.Min(50, valor.Length))}...");
                        return valor;
                    }


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
                    
                        Debug.WriteLine($"[CriptoHelper] FALHA AES: {ex.Message} | Valor (primeiros 50 chars): {valor.Substring(0, Math.Min(50, valor.Length))}");
                        throw new InvalidOperationException("Falha ao descriptografar mensagem (chave/IV incorretos ou dados corrompidos).", ex);
                    }
                }
    }
}
