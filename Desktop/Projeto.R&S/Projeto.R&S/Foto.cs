using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace Projeto.R_S
{
    public partial class Foto : Form
    {
        byte[] ft;

        public Foto(byte[] foto)
        {
            InitializeComponent();
            ft = foto;
        }

        private void Foto_Load(object sender, EventArgs e)
        {
            try
            {
                MemoryStream ms = new MemoryStream(ft);
                Image img = Image.FromStream(ms);
                guna2PictureBox1.Image = img;
                guna2PictureBox1.SizeMode = PictureBoxSizeMode.Zoom;
            }
            catch (Exception ex)
            {
                MessageBox.Show("Erro: " + ex.Message + "\nTamanho: " + ft?.Length);
            }
        }
    }
}

