function Footer(){

    return(<footer
        className="py-5 mt-5 mt-auto"
        style={{ backgroundColor: "#ECCCAF" }}
      >

        <div className="container d-flex justify-content-between align-items-center">

          <a href="#top">

            <img
              src="/imagens/logo.png"
              style={{ height: "10rem" }}
              alt="Read & Swap"
            />

          </a>


          <div className="justify-content-center">

            <a href="#" className="footer-link">
              Guia de Usuário
            </a>

            <br />

            <a href="#" className="footer-link">
              Termos de Uso
            </a>

            <br />

            <a href="#" className="footer-link">
              Dicas de Segurança
            </a>

            <br />

            <a href="#" className="footer-link">
              Política de Privacidade
            </a>

          </div>


          <div>

            &copy; 2025 - Diogo da Costa Pires
            <br />

            Eduardo Hipocreme de Sá
            <br />

            Lucas Eduardo Batista
            <br />

            Willian Ribeiro
            <br />
            <br />

            Colégio Técnico de Limeira - Unicamp.

          </div>

        </div>

      </footer>
      )
}export default Footer;