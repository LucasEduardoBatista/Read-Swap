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
                    guna2DataGridView1.Rows.Add(r.GetString(0), r.GetString(1), r.GetString(2), r.GetString(3), "Aberto para troca", r["Fotolivro"] == DBNull.Value ? null : (byte[])r["Fotolivro"]);
                else if (r.GetUInt16(4) == 1)
                    guna2DataGridView1.Rows.Add(r.GetString(0), r.GetString(1), r.GetString(2), r.GetString(3), "Já trocado", r["Fotolivro"] == DBNull.Value ? null : (byte[])r["Fotolivro"]);
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
                    guna2DataGridView1.Rows.Add(r.GetString(0), r.GetString(1), r.GetString(2), r.GetString(3), "Aberto para troca", r["Fotolivro"] == DBNull.Value ? null : (byte[])r["Fotolivro"]);
                else if (r.GetUInt16(4) == 1)
                    guna2DataGridView1.Rows.Add(r.GetString(0), r.GetString(1), r.GetString(2), r.GetString(3), "Já trocado", r["Fotolivro"] == DBNull.Value ? null : (byte[])r["Fotolivro"]);
            }
            DAO_conexao.con.Close();
        }

        private void guna2DataGridView1_CellMouseEnter(object sender, DataGridViewCellEventArgs e)
        {
            if (e.RowIndex < 0 || e.RowIndex >= guna2DataGridView1.Rows.Count) return;
            if (guna2DataGridView1.Columns.Count < 6) return;

            var valor = guna2DataGridView1.Rows[e.RowIndex].Cells[5].Value;

            if (valor == null || valor is DBNull) return;

            byte[] foto = valor as byte[];
            if (foto == null || foto.Length == 0) return;

            Foto ft = new Foto(foto);
            ft.StartPosition = FormStartPosition.Manual;
            ft.Location = new System.Drawing.Point(Cursor.Position.X + 10, Cursor.Position.Y + 10);
            ft.Show();
        }

        private void guna2DataGridView1_CellMouseLeave_1(object sender, DataGridViewCellEventArgs e)
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
