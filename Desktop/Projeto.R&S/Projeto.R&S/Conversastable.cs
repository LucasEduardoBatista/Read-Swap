using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MySql.Data.MySqlClient;

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

        private ConversaRow LerLinha(MySqlDataReader r)
        {
            return new ConversaRow
            {
                Nome1 = r.GetString(0),
                Conteudo = r.GetString(1),
                Nome2 = r.GetString(2),
                Status = r.GetUInt16(3) == 0 ? "Ativo" : "Inativo",
                Id1 = r.GetInt32(4),
                Id2 = r.GetInt32(5)
            };
        }
    }

    internal class ConversaRow
    {
        public string Nome1 { get; set; }
        public string Conteudo { get; set; }
        public string Nome2 { get; set; }
        public string Status { get; set; }
        public int Id1 { get; set; }
        public int Id2 { get; set; }
    }
}