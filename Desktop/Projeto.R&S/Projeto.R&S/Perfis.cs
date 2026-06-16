using System;
using System.Collections.Generic;
using System.Data;
using System.Windows.Forms;
using MySql.Data.MySqlClient;

namespace Projeto.R_S
{
    public partial class FrmPerfil : Form
    {
        int id;

        public FrmPerfil()
        {
            InitializeComponent();
            CarregarPerfis();
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
                    row.Id,
                    row.Foto
                );

                guna2DataGridView1.Rows[index].Tag = row.Id;
            }
        }

        private void CarregarPerfis()
        {
            Perfil perfil = new Perfil();
            CarregarGrid(perfil.consultarPerfis());
        }

        private void guna2TextBox1_TextChanged(object sender, EventArgs e)
        {
            Perfil perfil = new Perfil();
            CarregarGrid(perfil.consultarNomes(guna2TextBox1.Text));
        }

        private void guna2TextBox2_TextChanged(object sender, EventArgs e)
        {
            Perfil perfil = new Perfil();
            CarregarGrid(perfil.consultarEmail(guna2TextBox2.Text));
        }

        private void guna2TextBox3_TextChanged(object sender, EventArgs e)
        {
                Perfil perfil = new Perfil();
                CarregarGrid(perfil.consultarID(guna2TextBox3.Text));
            
        }

        private void guna2CustomCheckBox1_Click(object sender, EventArgs e)
        {
            Perfil perfil = new Perfil();
            CarregarGrid(guna2CustomCheckBox1.Checked
                ? perfil.consultarativos()
                : perfil.consultarPerfis());
        }

        private void guna2CustomCheckBox2_Click(object sender, EventArgs e)
        {
            Perfil perfil = new Perfil();
            CarregarGrid(guna2CustomCheckBox2.Checked
                ? perfil.consultarinativos()
                : perfil.consultarPerfis());
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

            foreach (DataGridViewRow row in guna2DataGridView1.Rows)
            {
                if (row.IsNewRow) continue;

                var tag = row.Tag;
                if (tag != null && Convert.ToInt32(tag) == id)
                    row.Cells[0].Value = "Inativo";
            }

            Perfil perfil = new Perfil();
            perfil.desativarPerfil(id);

            MessageBox.Show("Perfil desativado!");
        }

        private void guna2Button3_Click(object sender, EventArgs e)
        {
            if (id == 0)
            {
                MessageBox.Show("Selecione um perfil primeiro.");
                return;
            }

            foreach (DataGridViewRow row in guna2DataGridView1.Rows)
            {
                if (row.IsNewRow) continue;

                var tag = row.Tag;
                if (tag != null && Convert.ToInt32(tag) == id)
                    row.Cells[0].Value = "Ativo";
            }

            Perfil perfil = new Perfil();
            perfil.reativarPerfil(id);

            MessageBox.Show("Perfil reativado!");
        }

        private void guna2Button1_Click_1(object sender, EventArgs e)
        {
            if (DAO_conexao.con != null && DAO_conexao.con.State == ConnectionState.Open)
                DAO_conexao.con.Close();

            Info fmr = new Info();
            fmr.Show();
            this.Close();
        }

        private void guna2Button1_Click(object sender, EventArgs e)
        {
            if (DAO_conexao.con != null && DAO_conexao.con.State == ConnectionState.Open)
                DAO_conexao.con.Close();

            Info fmr = new Info();
            fmr.Show();
            this.Close();
        }

        private void guna2DataGridView1_CellMouseEnter(object sender, DataGridViewCellEventArgs e)
        {
            if (e.RowIndex < 0 || e.RowIndex >= guna2DataGridView1.Rows.Count) return;
            if (guna2DataGridView1.Columns.Count < 5) return;

            var valor = guna2DataGridView1.Rows[e.RowIndex].Cells[4].Value;

            if (valor == null || valor is DBNull) return;

            byte[] foto = valor as byte[];
            if (foto == null || foto.Length == 0) return;

            Foto ft = new Foto(foto);
            ft.StartPosition = FormStartPosition.Manual;
            ft.Location = new System.Drawing.Point(Cursor.Position.X + 10, Cursor.Position.Y + 10);
            ft.Show();
        }

        
            private void guna2DataGridView1_CellMouseLeave(object sender, DataGridViewCellEventArgs e)
            {
            foreach (Form f in Application.OpenForms)
            {
                if (f is Foto)
                {
                    f.Close();
                    break;
                }
            }
        }

        private void guna2DataGridView1_CellMouseMove(object sender, DataGridViewCellMouseEventArgs e)
        {
            foreach (Form f in Application.OpenForms)
            {
                if (f is Foto)
                {
                    f.Location = new System.Drawing.Point(Cursor.Position.X + 10, Cursor.Position.Y + 10);
                }
            }
        }
    }
  }
