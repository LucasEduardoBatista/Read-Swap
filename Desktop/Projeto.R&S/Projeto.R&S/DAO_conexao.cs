using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MySql.Data.MySqlClient;

namespace Projeto.R_S
{
       internal class DAO_conexao
    {
        public static MySqlConnection con;

        public static bool getConexao(String local, String banco, String user, String senha)
        {
            bool retorno = false;
            try
            {
                con = new MySqlConnection("server=" + local + ";User ID=" + user + ";" + "database=" + banco + "; password=" + senha );
                retorno = true;
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);

            }
            return retorno;
        }

        public static Boolean login(String usuario, String senha)
        {
            bool retorno = false;
            try
            {
                con.Open();
                MySqlCommand login = new MySqlCommand("Select * from ReadSwapADMs where Usuario = '" + usuario + "' and Senha = '" + senha + "'", con);
                MySqlDataReader resultado = login.ExecuteReader();
                if (resultado.Read())
                {
                    retorno = true;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
            finally
            {
                con.Close();
            }
            return retorno;
        }
    }
}
