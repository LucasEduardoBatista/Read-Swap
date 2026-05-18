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
    public partial class Conversas : Form
    {
        int id1, id2;

        public Conversas()
        {
            InitializeComponent();
            CarregarGrid();
        }

        private void CarregarGrid()
        {
            guna2DataGridView1.Rows.Clear();

            Conversastable perfil = new Conversastable();
            List<ConversaRow> lista = perfil.consultarconversas();

            foreach (ConversaRow row in lista)
            {
                int index = guna2DataGridView1.Rows.Add(
                    row.Nome1,
                    row.Conteudo,
                    row.Nome2,
                    row.Status
                ); 

                guna2DataGridView1.Rows[index].Tag = new int[] { row.Id1, row.Id2 };
            }
        }

        private void guna2TextBox1_TextChanged(object sender, EventArgs e)
        {
            guna2DataGridView1.Rows.Clear();

            Conversastable perfil = new Conversastable();
            List<ConversaRow> lista = perfil.consultarnomes(guna2TextBox1.Text);

            foreach (ConversaRow row in lista)
            {
                int index = guna2DataGridView1.Rows.Add(
                    row.Nome1,
                    row.Conteudo,
                    row.Nome2,
                    row.Status
                );

                guna2DataGridView1.Rows[index].Tag = new int[] { row.Id1, row.Id2 };
            }
        }

        private void guna2Button2_Click(object sender, EventArgs e)
        {
            if (id1 == 0 && id2 == 0)
            {
                MessageBox.Show("Selecione uma conversa primeiro.");
                return;
            }

            Conversastable perfil = new Conversastable();
            perfil.desativarConversa(id1, id2);

            AtualizarStatusGrid("Inativo");

            MessageBox.Show("Conversa desativada!");
        }

        private void guna2Button3_Click(object sender, EventArgs e)
        {
            if (id1 == 0 && id2 == 0)
            {
                MessageBox.Show("Selecione uma conversa primeiro.");
                return;
            }

            Conversastable perfil = new Conversastable();
            perfil.ReativarConversa(id1, id2);

            AtualizarStatusGrid("Ativo");

            MessageBox.Show("Conversa reativada!");
        }

        private void AtualizarStatusGrid(string status)
        {
            foreach (DataGridViewRow row in guna2DataGridView1.Rows)
            {
                if (row.IsNewRow) continue;

                var tag = row.Tag as int[];

                if (tag != null && tag.Length == 2 &&
                    tag[0] == id1 && tag[1] == id2)
                {
                    row.Cells[3].Value = status;
                }
            }
        }

        private void guna2DataGridView1_CellClick(object sender, DataGridViewCellEventArgs e)
        {
            if (e.RowIndex < 0) return;

            var tag = guna2DataGridView1.Rows[e.RowIndex].Tag as int[];

            if (tag != null && tag.Length == 2)
            {
                id1 = tag[0];
                id2 = tag[1];
            }
        }

        private void guna2Button1_Click(object sender, EventArgs e)
        {
            if (DAO_conexao.con != null && DAO_conexao.con.State == ConnectionState.Open)
                DAO_conexao.con.Close();

            Info info = new Info();
            info.Show();
            this.Close();
        }

        private void guna2TextBox1_TextChanged_1(object sender, EventArgs e)
        {
            guna2DataGridView1.Rows.Clear();

            Conversastable perfil = new Conversastable();
            List<ConversaRow> lista = perfil.consultarnomes(guna2TextBox1.Text);

            foreach (ConversaRow row in lista)
            {
                guna2DataGridView1.Rows.Add(
                    row.Nome1,
                    row.Conteudo,
                    row.Nome2,
                    row.Status,
                    row.Id1,
                    row.Id2
                );
            }
        }

       
    }
}