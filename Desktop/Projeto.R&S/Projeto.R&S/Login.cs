using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using MySql.Data.MySqlClient;

namespace Projeto.R_S
{
    public partial class Login : Form
    {
        

        Info info = new Info();
        public Login()
        {
            InitializeComponent();
            if (DAO_conexao.getConexao("143.106.241.4", "cl204224", "cl204224", "cl*27102008"))
                Console.WriteLine("Conectado");
            else
                Console.WriteLine("Erro de conexão");
        }


        private void guna2Button2_Click(object sender, EventArgs e)
        {
            bool logado = DAO_conexao.login(guna2TextBox1.Text, guna2TextBox2.Text);
            if (logado)
            {
                fechabre();
            }
            else
            {
                MessageBox.Show("Usuário/Senha invalido(s)", "ATENÇÃO", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }



        }


        private void fechabre()
        {
            Info info = new Info();
            info.Show();
            this.Close();
        }

        private void guna2Button1_Click(object sender, EventArgs e)
        {
            this.Close();
        }
    }
}

