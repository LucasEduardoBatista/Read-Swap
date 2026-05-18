using Guna.UI2.WinForms;
using LiveCharts;
using LiveCharts.WinForms;
using LiveCharts.Wpf;
using MySql.Data.MySqlClient;
using Svg;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace Projeto.R_S
{

    public partial class Info : Form
    {


        public Info()
        {
            InitializeComponent();
            if (DAO_conexao.con == null)
            {
                DAO_conexao.getConexao("143.106.241.4", "cl204224", "cl204224", "cl*27102008");
            }
            CarregarGraficoPizza();

        }

        private void guna2TileButton1_Click(object sender, EventArgs e)
        {
            if (DAO_conexao.con != null && DAO_conexao.con.State == ConnectionState.Open)
            {
                DAO_conexao.con.Close();
            }
            FrmPerfil frm = new FrmPerfil();
            frm.Show();
            this.Close();
        }

        private void guna2TileButton2_Click(object sender, EventArgs e)
        {
            if (DAO_conexao.con != null && DAO_conexao.con.State == ConnectionState.Open)
            {
                DAO_conexao.con.Close();
            }
            FrmLivros frm = new FrmLivros();
            frm.Show();
            this.Close();
        }

        private void guna2TileButton3_Click(object sender, EventArgs e)
        {
            if (DAO_conexao.con != null && DAO_conexao.con.State == ConnectionState.Open)
            {
                DAO_conexao.con.Close();
            }
            Userspremium frm = new Userspremium();
            frm.Show();
            this.Close();
        }

        private void guna2TileButton4_Click(object sender, EventArgs e)
        {
            if (DAO_conexao.con != null && DAO_conexao.con.State == ConnectionState.Open)
            {
                DAO_conexao.con.Close();
            }
            Conversas frm = new Conversas();
            frm.Show();
            this.Close();
        }

        private void guna2TileButton5_Click(object sender, EventArgs e)
        {
            if (DAO_conexao.con != null && DAO_conexao.con.State == ConnectionState.Open)
            {
                DAO_conexao.con.Close();
            }
            Login frm=new Login();
            frm.Show();
            this.Close();
        }

        private void pieChart1_ChildChanged(object sender, System.Windows.Forms.Integration.ChildChangedEventArgs e)
        {

        }

        private void CarregarGraficoPizza()
        {
            int trocados = 0;
            int naoTrocados = 0;

            Livros livros = new Livros();
            MySqlDataReader r = livros.consultarLivrosGrafico();

            if (r == null)
            {
                MessageBox.Show("Erro ao carregar dados do gráfico.");
                return;
            }

            try
            {
                if (r.Read())
                {
                    trocados = r["Trocados"] != DBNull.Value ? Convert.ToInt32(r["Trocados"]) : 0;
                    naoTrocados = r["NaoTrocados"] != DBNull.Value ? Convert.ToInt32(r["NaoTrocados"]) : 0;
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message);
            }
            finally
            {
               
                r.Close();

                if (DAO_conexao.con.State == ConnectionState.Open)
                    DAO_conexao.con.Close();
            }

    
            pieChart1.Series.Clear();

            pieChart1.Series = new LiveCharts.SeriesCollection
    {
        new LiveCharts.Wpf.PieSeries
        {
            Title = "Livros trocados",
            Values = new LiveCharts.ChartValues<int> { trocados },
            DataLabels = true
        },
        new LiveCharts.Wpf.PieSeries
        {
            Title = "Livros não trocados",
            Values = new LiveCharts.ChartValues<int> { naoTrocados },
            DataLabels = true
        }
    };

            pieChart1.LegendLocation = LiveCharts.LegendLocation.Bottom;
            pieChart1.InnerRadius = 40;
        }

        private void Info_Load(object sender, EventArgs e)
        {
            Perfil perfil= new Perfil();
            int i=perfil.contarUsuarios();
            
                label1.Text = Convert.ToString(i); ;
            
        }
    }
    }

