using System;
using System.Collections.Generic;
using System.Data;
using System.Windows.Forms;
using MySql.Data.MySqlClient;

namespace Projeto.R_S
{
    public partial class Userspremium : Form
    {
        int id;

        public Userspremium()
        {
            InitializeComponent();
            CarregarPerfisPremium();
        }

        private void CarregarGrid(List<PerfilRow> lista)
        {
            guna2DataGridView1.Rows.Clear();

            foreach (PerfilRow row in lista)
            {
                int index = guna2DataGridView1.Rows.Add(
                    row.Status,
                    row.Nome,
                    row.Email,
                    row.Id
                );

                guna2DataGridView1.Rows[index].Tag = row.Id;
            }
        }

        private void CarregarPerfisPremium()
        {
            Perfil perfil = new Perfil();
            CarregarGrid(perfil.consultarPerfisprem());
        }

        private void guna2Button1_Click_1(object sender, EventArgs e)
        {
            if (DAO_conexao.con != null && DAO_conexao.con.State == ConnectionState.Open)
                DAO_conexao.con.Close();

            Info fmr = new Info();
            fmr.Show();
            this.Close();
        }

        private void guna2TextBox1_TextChanged(object sender, EventArgs e)
        {
            Perfil perfil = new Perfil();
            CarregarGrid(perfil.consultarPremium(guna2TextBox1.Text));
        }

        private void guna2TextBox2_TextChanged(object sender, EventArgs e)
        {
            Perfil perfil = new Perfil();
            CarregarGrid(perfil.consultarEmail(guna2TextBox2.Text));
        }

        private void guna2TextBox3_TextChanged(object sender, EventArgs e)
        {
            if (!string.IsNullOrEmpty(guna2TextBox3.Text))
            {
                Perfil perfil = new Perfil();
                CarregarGrid(perfil.consultarID(guna2TextBox3.Text));
            }
        }

        private void guna2CustomCheckBox1_Click(object sender, EventArgs e)
        {
            Perfil perfil = new Perfil();
            CarregarGrid(guna2CustomCheckBox1.Checked
                ? perfil.consultarativosprem()
                : perfil.consultarPerfisprem());
        }

        private void guna2CustomCheckBox2_Click(object sender, EventArgs e)
        {
            Perfil perfil = new Perfil();
            CarregarGrid(guna2CustomCheckBox2.Checked
                ? perfil.consultarinativosprem()
                : perfil.consultarPerfisprem());
        }

        private void guna2DataGridView1_CellClick(object sender, DataGridViewCellEventArgs e)
        {
            if (e.RowIndex < 0) return;

            var tag = guna2DataGridView1.Rows[e.RowIndex].Tag;
            if (tag != null)
                id = Convert.ToInt32(tag);
        }

        private void guna2Button2_Click(object sender, EventArgs e)
        {
            if (id == 0)
            {
                MessageBox.Show("Selecione um perfil primeiro.");
                return;
            }

            for (int i = guna2DataGridView1.Rows.Count - 1; i >= 0; i--)
            {
                var tag = guna2DataGridView1.Rows[i].Tag;
                if (tag != null && Convert.ToInt32(tag) == id)
                {
                    guna2DataGridView1.Rows.RemoveAt(i);
                }
            }

            Perfil perfil = new Perfil();
            perfil.desativarPremium(id);

            MessageBox.Show("Premium desativado!");
        }
    }
}