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
    public partial class FrmLivros : Form
    {
        public FrmLivros()
        {
            InitializeComponent();
            
            Livros livros = new Livros();
            MySqlDataReader r = livros.consultarLivros();
            while (r.Read())
            {
                if (r.GetUInt16(4) == 0)
                   guna2DataGridView1.Rows.Add(r.GetString(0), r.GetString(1), r.GetString(2), r.GetString(3), "Aberto para troca");
                else if (r.GetUInt16(4) == 1)
                    guna2DataGridView1.Rows.Add(r.GetString(0), r.GetString(1), r.GetString(2), r.GetString(3), "Já trocado");
            }
            DAO_conexao.con.Close();
        }

       
        private void guna2Button1_Click(object sender, EventArgs e)
        {
            if (DAO_conexao.con != null && DAO_conexao.con.State == ConnectionState.Open)
            {
                DAO_conexao.con.Close();
            }
            Info fmr = new Info();
            fmr.Show();
            this.Close();
        }

        private void guna2TextBox1_TextChanged(object sender, EventArgs e)
        {


            guna2DataGridView1.Rows.Clear();
            Livros livros = new Livros();
            MySqlDataReader r = livros.consultarNomes(guna2TextBox1.Text);
            while (r.Read())
            {


                if (r.GetUInt16(4) == 0)
                    guna2DataGridView1.Rows.Add(r.GetString(0), r.GetString(1), r.GetString(2), r.GetString(3), "Aberto para troca");
                else if (r.GetUInt16(4) == 1)
                    guna2DataGridView1.Rows.Add(r.GetString(0), r.GetString(1), r.GetString(2), r.GetString(3), "Já trocado");
            }
            DAO_conexao.con.Close();
        }
    }
}
