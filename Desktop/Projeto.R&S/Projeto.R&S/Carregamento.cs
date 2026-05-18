using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;


namespace Projeto.R_S
{
    public partial class Carregamento : Form
    {
        Login login = new Login();
        public Carregamento()
        {
            InitializeComponent();
            
        }

        private void timer1_Tick(object sender, EventArgs e)
        {
            timer1.Enabled = false;
            fechabre();
        }

        private void fechabre()
        {
            this.Hide();
            login.Show();

        }

        private void Carregamento_Load(object sender, EventArgs e)
        {

        }
    }
}
