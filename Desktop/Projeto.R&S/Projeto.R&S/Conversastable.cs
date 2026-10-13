using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MySql.Data.MySqlClient;
using Newtonsoft.Json;

namespace Projeto.R_S
{
    internal class Conversastable
    {
        private const string SELECT_CONVERSAS =
            @"SELECT p1.Nome AS Pessoa1, c.conteudo, p2.Nome AS Pessoa2,
                     c.Statuscvs, c.id1, c.id2
              FROM conversasADMs c
              JOIN PerfisADMs p1 ON c.id1 = p1.idPerfis
              JOIN PerfisADMs p2 ON c.id2 = p2.idPerfis";

        public List<ConversaRow> consultarconversas()
        {
            var lista = new List<ConversaRow>();
            try
            {
                if (DAO_conexao.con.State != ConnectionState.Open)
                    DAO_conexao.con.Open();

                MySqlCommand cmd = new MySqlCommand(SELECT_CONVERSAS, DAO_conexao.con);
                MySqlDataReader r = cmd.ExecuteReader();

                while (r.Read())
                    lista.Add(LerLinha(r));

                r.Close();
            }
            catch (Exception ex)
            {
                Console.WriteLine("Erro ao consultar conversas: " + ex.Message);
            }
            finally
            {
                if (DAO_conexao.con.State == ConnectionState.Open)
                    DAO_conexao.con.Close();
            }
            return lista;
        }

        public List<ConversaRow> consultarnomes(string nome)
        {
            var lista = new List<ConversaRow>();
            try
            {
                if (DAO_conexao.con.State != ConnectionState.Open)
                    DAO_conexao.con.Open();

                MySqlCommand cmd = new MySqlCommand(
                    SELECT_CONVERSAS + " WHERE p1.Nome LIKE @nome OR p2.Nome LIKE @nome",
                    DAO_conexao.con);

                cmd.Parameters.AddWithValue("@nome", "%" + nome + "%");

                MySqlDataReader r = cmd.ExecuteReader();

                while (r.Read())
                    lista.Add(LerLinha(r));

                r.Close();
            }
            catch (Exception ex)
            {
                Console.WriteLine("Erro ao consultar nomes: " + ex.Message);
            }
            finally
            {
                if (DAO_conexao.con.State == ConnectionState.Open)
                    DAO_conexao.con.Close();
            }
            return lista;
        }

        public void desativarConversa(int id1, int id2)
        {
            try
            {
                if (DAO_conexao.con.State != ConnectionState.Open)
                    DAO_conexao.con.Open();

                MySqlCommand cmd = new MySqlCommand(
                    @"UPDATE conversasADMs SET Statuscvs = 1
                      WHERE (id1 = @a AND id2 = @b)
                         OR (id1 = @b AND id2 = @a)",
                    DAO_conexao.con);

                cmd.Parameters.AddWithValue("@a", id1);
                cmd.Parameters.AddWithValue("@b", id2);

                int linhas = cmd.ExecuteNonQuery();
                Console.WriteLine("Linhas afetadas: " + linhas);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Erro ao desativar conversa: " + ex.Message);
            }
            finally
            {
                if (DAO_conexao.con.State == ConnectionState.Open)
                    DAO_conexao.con.Close();
            }
        }

        public void ReativarConversa(int id1, int id2)
        {
            try
            {
                if (DAO_conexao.con == null)
                {
                    Console.WriteLine("Conexão não inicializada.");
                    return;
                }

                if (DAO_conexao.con.State != ConnectionState.Open)
                    DAO_conexao.con.Open();

                MySqlCommand cmd = new MySqlCommand(
                    @"UPDATE conversasADMs SET Statuscvs = 0
                      WHERE (id1 = @a AND id2 = @b)
                         OR (id1 = @b AND id2 = @a)",
                    DAO_conexao.con);

                cmd.Parameters.AddWithValue("@a", id1);
                cmd.Parameters.AddWithValue("@b", id2);

                int linhas = cmd.ExecuteNonQuery();
                Console.WriteLine("Linhas afetadas: " + linhas);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Erro ao reativar conversa: " + ex.Message);
            }
            finally
            {
                if (DAO_conexao.con.State == ConnectionState.Open)
                    DAO_conexao.con.Close();
            }
        }

        /// <summary>
        /// Lê uma linha do MySqlDataReader, descriptografa o campo conteudo
        /// (JSON array de mensagens) e concatena todos os textos para exibição.
        /// </summary>
        private ConversaRow LerLinha(MySqlDataReader r)
        {
            string conteudoRaw = r.IsDBNull(1) ? "[]" : r.GetString(1);
            string conteudoExibido = DescriptografarConteudo(conteudoRaw);

            return new ConversaRow
            {
                Nome1    = r.GetString(0),
                Conteudo = conteudoExibido,
                Nome2    = r.GetString(2),
                Status   = r.GetUInt16(3) == 0 ? "Ativo" : "Inativo",
                Id1      = r.GetInt32(4),
                Id2      = r.GetInt32(5)
            };
        }

        /// <summary>
        /// Faz o parse do JSON de mensagens, descriptografa cada texto com AES
        /// e concatena tudo no formato "[HH:mm] Remetente: texto".
        /// Se o parse falhar, tenta descriptografar como string simples (fallback).
        /// </summary>
        private static string DescriptografarConteudo(string conteudoRaw)
        {
            if (string.IsNullOrWhiteSpace(conteudoRaw) || conteudoRaw == "[]")
                return "(sem mensagens)";

            try
            {
                // Tenta fazer parse como array JSON de mensagens
                var mensagens = JsonConvert.DeserializeObject<List<MensagemJson>>(conteudoRaw);

                if (mensagens == null || mensagens.Count == 0)
                    return "(sem mensagens)";

                var sb = new StringBuilder();
                foreach (var msg in mensagens)
                {
                    string textoDecifrado = CriptoHelper.Descriptografar(msg.Texto ?? "");

                    // Formata a hora se disponível
                    string hora = "";
                    if (DateTime.TryParse(msg.Data, out DateTime dt))
                        hora = $"[{dt.ToLocalTime():HH:mm}] ";

                    if (sb.Length > 0) sb.Append(" | ");
                    sb.Append($"{hora}{textoDecifrado}");
                }

                return sb.ToString();
            }
            catch
            {
                // Fallback: não é JSON — tenta descriptografar como string simples
                return CriptoHelper.Descriptografar(conteudoRaw);
            }
        }
    }

    /// <summary>Modelo auxiliar para desserializar cada mensagem do JSON.</summary>
    internal class MensagemJson
    {
        [JsonProperty("remetente")]
        public int Remetente { get; set; }

        [JsonProperty("texto")]
        public string Texto { get; set; }

        [JsonProperty("data")]
        public string Data { get; set; }
    }

    internal class ConversaRow
    {
        public string Nome1    { get; set; }
        public string Conteudo { get; set; }
        public string Nome2    { get; set; }
        public string Status   { get; set; }
        public int    Id1      { get; set; }
        public int    Id2      { get; set; }
    }
}