using Acornima.Ast;
using MySql.Data.MySqlClient;
using Mysqlx.Crud;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Projeto.R_S
{
    internal class Livros
    {


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
        public MySqlDataReader consultarLivros()
        {
            MySqlDataReader lista = null;

            try
            {
                DAO_conexao.con.Open();

                MySqlCommand consulta = new MySqlCommand(
                    "SELECT l.Autor, l.Nome, l.Genero, p.Nome, l.Status, l.Fotolivro, l.idLivrosADMs " +
                    "FROM cl204224.LivrosADMs l " +
                    "JOIN cl204224.PerfisADMs p ON l.IdDono = p.idPerfis",
                    DAO_conexao.con);

                lista = consulta.ExecuteReader();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }

            return lista;
        }

        public MySqlDataReader consultarNomes(String nome)
        {
            MySqlDataReader lista = null;
            try
            {
                DAO_conexao.con.Open();
                MySqlCommand consulta = new MySqlCommand("SELECT l.Autor, l.Nome, l.Genero, p.Nome, l.Status, l.Fotolivro, l.idLivrosADMs FROM cl204224.LivrosADMs l JOIN cl204224.PerfisADMs p ON l.IdDono = p.idPerfis " +
"WHERE (l.Nome LIKE '%" + nome + "%' OR NOT EXISTS (SELECT 1 FROM cl204224.LivrosADMs WHERE Nome LIKE '%" + nome + "%'))", DAO_conexao.con);
                lista = consulta.ExecuteReader();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }

            return lista;
        }

        public MySqlDataReader consultarLivrosGrafico()
        {
            MySqlDataReader lista = null;
            try
            {
                DAO_conexao.con.Open();
                MySqlCommand consulta = new MySqlCommand("SELECT " +
                    "SUM(CASE WHEN Status = 1 THEN 1 ELSE 0 END) AS Trocados, " +
                    "SUM(CASE WHEN Status = 0 THEN 1 ELSE 0 END) AS NaoTrocados " +
                    "FROM cl204224.LivrosADMs",
                    DAO_conexao.con);
                lista = consulta.ExecuteReader();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }

            return lista;
        }

        public void Deletarlivro(int id)
        {
            ExecutarComando(
           "DELETE FROM LivrosADMs WHERE idLivrosADMs = @id",
           cmd => cmd.Parameters.AddWithValue("@id", id));
        }

    }
}
