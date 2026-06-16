using System;
using System.Collections.Generic;
using System.Data;
using MySql.Data.MySqlClient;

namespace Projeto.R_S
{
    internal class PerfilRow
    {
        public string Status { get; set; }
        public string Nome { get; set; }
        public string Email { get; set; }
        public int Id { get; set; }
        public byte[] Foto { get; set; }
    }

    internal class Perfil
    {
        private List<PerfilRow> ExecutarConsulta(string sql, Action<MySqlCommand> addParams = null)
        {
            var lista = new List<PerfilRow>();
            try
            {
                if (DAO_conexao.con.State != ConnectionState.Open)
                    DAO_conexao.con.Open();

                MySqlCommand cmd = new MySqlCommand(sql, DAO_conexao.con);
                addParams?.Invoke(cmd);

                MySqlDataReader r = cmd.ExecuteReader();
                while (r.Read())
                {
                    lista.Add(new PerfilRow
                    {
                        Status = r.GetUInt16(0) == 0 ? "Ativo" : "Inativo",
                        Nome = r.GetString(1),
                        Email = r.GetString(2),
                        Id = r.GetInt32(3),
                        Foto = r["Foto"] == DBNull.Value ? null : (byte[])r["Foto"],
                    });
                }
                r.Close();
            }
            catch (Exception ex)
            {
                Console.WriteLine("Erro na consulta: " + ex.Message);
            }
            finally
            {
                if (DAO_conexao.con.State == ConnectionState.Open)
                    DAO_conexao.con.Close();
            }
            return lista;
        }

        private void ExecutarComando(string sql, Action<MySqlCommand> addParams = null)
        {
            try
            {
                if (DAO_conexao.con.State != ConnectionState.Open)
                    DAO_conexao.con.Open();

                MySqlCommand cmd = new MySqlCommand(sql, DAO_conexao.con);
                addParams?.Invoke(cmd);
                cmd.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                Console.WriteLine("Erro no comando: " + ex.Message);
            }
            finally
            {
                if (DAO_conexao.con.State == ConnectionState.Open)
                    DAO_conexao.con.Close();
            }
        }

        public List<PerfilRow> consultarPerfis()
        {
            return ExecutarConsulta(
                "SELECT Status, Nome, Email, idPerfis, Foto FROM PerfisADMs");
        }

        public List<PerfilRow> consultarPerfisprem()
        {
            return ExecutarConsulta(
                "SELECT Status, Nome, Email, idPerfis, Foto FROM PerfisADMs WHERE Premium = 1");
        }

        public List<PerfilRow> consultarativos()
        {
            return ExecutarConsulta(
                "SELECT Status, Nome, Email, idPerfis, Foto FROM PerfisADMs WHERE Status = 0");
        }

        public List<PerfilRow> consultarinativos()
        {
            return ExecutarConsulta(
                "SELECT Status, Nome, Email, idPerfis, Foto FROM PerfisADMs WHERE Status = 1");
        }

        public List<PerfilRow> consultarativosprem()
        {
            return ExecutarConsulta(
                "SELECT Status, Nome, Email, idPerfis, Foto FROM PerfisADMs WHERE Premium = 1 AND Status = 0");
        }

        public List<PerfilRow> consultarinativosprem()
        {
            return ExecutarConsulta(
                "SELECT Status, Nome, Email, idPerfis, Foto FROM PerfisADMs WHERE Premium = 1 AND Status = 1");
        }


        public List<PerfilRow> consultarNomes(string nome)
        {
            return ExecutarConsulta(
                "SELECT Status, Nome, Email, idPerfis, Foto FROM PerfisADMs WHERE Nome LIKE @v",
                cmd => cmd.Parameters.AddWithValue("@v", "%" + nome + "%"));
        }

        public List<PerfilRow> consultarPremium(string nome)
        {
            return ExecutarConsulta(
                "SELECT Status, Nome, Email, idPerfis, Foto FROM PerfisADMs WHERE Premium = 1 AND Nome LIKE @v",
                cmd => cmd.Parameters.AddWithValue("@v", "%" + nome + "%"));
        }

        public List<PerfilRow> consultarEmail(string email)
        {
            return ExecutarConsulta(
                "SELECT Status, Nome, Email, idPerfis, Foto FROM PerfisADMs WHERE Premium = 1 AND Email LIKE @v",
                cmd => cmd.Parameters.AddWithValue("@v", "%" + email + "%"));
        }

        public List<PerfilRow> consultarEmailp(string email)
        {
            return ExecutarConsulta(
                "SELECT Status, Nome, Email, idPerfis, Foto FROM PerfisADMs WHERE Email LIKE @v",
                cmd => cmd.Parameters.AddWithValue("@v", "%" + email + "%"));
        }

        public List<PerfilRow> consultarID(string id)
        {
            return ExecutarConsulta(
                "SELECT Status, Nome, Email, idPerfis, Foto FROM PerfisADMs WHERE idPerfis LIKE @v",
                cmd => cmd.Parameters.AddWithValue("@v", "%" + id + "%"));
        }

        public List<PerfilRow> consultarIDp(string id)
        {
            return ExecutarConsulta(
                "SELECT Status, Nome, Email, idPerfis, Foto FROM PerfisADMs WHERE idPerfis LIKE @v",
                cmd => cmd.Parameters.AddWithValue("@v", "%" + id + "%"));
        }

        

        public int contarUsuarios()
        {
            int total = 0;
            try
            {
                if (DAO_conexao.con.State != ConnectionState.Open)
                    DAO_conexao.con.Open();

                MySqlCommand cmd = new MySqlCommand(
                    "SELECT COUNT(*) FROM PerfisADMs", DAO_conexao.con);

                total = Convert.ToInt32(cmd.ExecuteScalar());
            }
            catch (Exception ex)
            {
                Console.WriteLine("Erro ao contar usuários: " + ex.Message);
            }
            finally
            {
                if (DAO_conexao.con.State == ConnectionState.Open)
                    DAO_conexao.con.Close();
            }
            return total;
        }

        public void desativarPerfil(int id)
        {
            ExecutarComando(
                "UPDATE PerfisADMs SET Status = 1 WHERE idPerfis = @id",
                cmd => cmd.Parameters.AddWithValue("@id", id));
        }

        public void reativarPerfil(int id)
        {
            ExecutarComando(
                "UPDATE PerfisADMs SET Status = 0 WHERE idPerfis = @id",
                cmd => cmd.Parameters.AddWithValue("@id", id));
        }

        public void desativarPremium(int id)
        {
            ExecutarComando(
                "UPDATE PerfisADMs SET Premium = 0 WHERE idPerfis = @id",
                cmd => cmd.Parameters.AddWithValue("@id", id));
        }
    }
}