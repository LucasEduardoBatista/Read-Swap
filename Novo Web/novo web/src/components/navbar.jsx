import { ToggleDarkMode } from "./common";

function Navbar(){

    return( 
    <>
    <nav
        className="navbar navbar-expand-lg bg-light fixed-top"
        data-bs-theme="light"
      >
        <div className="container-fluid">

          <a className="navbar-brand" href="#">
            <img
              id="logoNav"
              src="./Imagens/logo_navbar.png"
              style={{ width: "8rem" }}
              alt="Read & Swap"
            />
          </a>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div
            className="collapse navbar-collapse"
            id="navbarSupportedContent"
          >

            <ul className="navbar-nav me-auto mb-2 mb-lg-0">

              <li className="nav-item dropdown">

                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Livros
                </a>

                <ul className="dropdown-menu">

                  <li>
                    <a
                      className="dropdown-item"
                      href="../pages/biblioteca.jsx"
                    >
                      Meus Livros
                    </a>
                  </li>

                  <li>
                    <a
                      className="dropdown-item"
                      href="../pages/livros.jsx"
                    >
                      Cadastro de Livros
                    </a>
                  </li>

                </ul>

              </li>

              <li className="nav-item">
                <a
                  className="nav-link"
                  href="../pages/swaps.jsx"
                >
                  Swap
                </a>
              </li>

              <li className="nav-item">
                <a
                  className="nav-link"
                  href="../pages/Conversas.jsx"
                >
                  Matches
                </a>
              </li>

              <li className="nav-item">
                <a
                  className="nav-link"
                  href="../pages/Premium.jsx"
                >
                  Premium
                </a>
              </li>

            </ul>


            <ul className="navbar-nav mb-2 mb-lg-0">

              <li className="nav-item">
                <a
                  href="/login"
                  className="nav-link entrar"
                >
                  Entrar
                </a>
              </li>

              <li className="nav-item">
                <a href="../pages/Cadastrar.jsx">
                  <button className="btn btn-danger cadastrar">
                    Cadastrar
                  </button>
                </a>
              </li>

              <li style={{ display: "none" }}>
                <a
                  href="../pages/Perfilacoes.jsx"
                  className="nav-link perfil"
                >
                  <i className="bi bi-person-circle"></i>
                </a>
              </li>

              <li>
                <button
                  id="darkModeBtn"
                  className="btn"
                  type="button"
                  onClick={ToggleDarkMode}
                >
                  <i className="bi bi-moon-fill"></i>
                </button>
              </li>

            </ul>

          </div>
        </div>
      </nav>
      </>
      )
}export default Navbar;