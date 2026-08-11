import { useState } from "react";

function Cadastrar() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmaSenha, setConfirmaSenha] = useState("");
  const [termos, setTermos] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setEnviado(true);

    if (
      !nome ||
      !email ||
      senha.length < 6 ||
      senha.length > 50 ||
      confirmaSenha.length < 6 ||
      confirmaSenha.length > 50 ||
      senha !== confirmaSenha ||
      !termos
    ) {
      return;
    }

    
    const formData = new FormData();

    formData.append("nome", nome);
    formData.append("email", email);
    formData.append("senha", senha);
    formData.append("confirmaSenha", confirmaSenha);

    try {
      const response = await fetch(
        "http://localhost/backend/usuarios/cadastro.php",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.text();

      console.log(data);

    } catch (error) {
      console.error("Erro ao cadastrar:", error);
    }
  };

  return (
    <>

      <nav className="navbar navbar-expand-lg bg-light fixed-top" data-bs-theme="light">
        <div className="container-fluid">

          <a className="navbar-brand" href="/">
            <img
              id="logoNav"
              src="/Imagens/logo_navbar.png"
              style={{ width: "8rem" }}
              alt="Read & Swap"
            />
          </a>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div
            className="collapse navbar-collapse"
            id="navbarSupportedContent"
          >
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">

              <li className="nav-item">
                <a className="nav-link" href="/">
                  Início
                </a>
              </li>

              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                >
                  Livros
                </a>

                <ul className="dropdown-menu">
                  <li>
                    <a className="dropdown-item" href="/biblioteca">
                      Meus Livros
                    </a>
                  </li>

                  <li>
                    <a className="dropdown-item" href="/livros">
                      Cadastro de Livros
                    </a>
                  </li>
                </ul>
              </li>

              <li className="nav-item">
                <a className="nav-link" href="/swaps">
                  Swap
                </a>
              </li>

              <li className="nav-item">
                <a className="nav-link" href="/matches">
                  Matches
                </a>
              </li>

              <li className="nav-item">
                <a className="nav-link" href="/premium">
                  Premium
                </a>
              </li>

            </ul>

            <ul className="navbar-nav mb-2 mb-lg-0">

              <li className="nav-item">
                <a href="/login" className="nav-link entrar">
                  Entrar
                </a>
              </li>

              <li className="nav-item">
                <a href="/cadastro">
                  <button className="btn btn-danger cadastrar">
                    Cadastrar
                  </button>
                </a>
              </li>

              <li>
                <button
                  id="darkModeBtn"
                  className="btn"
                  type="button"
                >
                  <i className="bi bi-moon-fill"></i>
                </button>
              </li>

            </ul>
          </div>
        </div>
      </nav>


      <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 py-4 pt-5 mt-5 main_login">

        <div id="box">

          <h1 style={{ textAlign: "center" }}>
            Cadastrar
          </h1>

          <form
            id="form-cadastro"
            onSubmit={handleSubmit}
            noValidate
          >


            <div className="mb-1">

              <input
                id="nome"
                name="nome"
                type="text"
                className={`form-control ${
                  enviado && !nome ? "is-invalid" : ""
                }`}
                placeholder="Nome completo"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />

              <div className="invalid-feedback">
                Insira seu nome completo.
              </div>

            </div>


            <div className="mb-1">

              <input
                id="email"
                name="email"
                type="email"
                className={`form-control ${
                  enviado && !email ? "is-invalid" : ""
                }`}
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <div className="invalid-feedback">
                Insira um e-mail válido.
              </div>

            </div>


            <div className="input-group has-validation mb-1">

              <input
                id="senha"
                name="senha"
                type={mostrarSenha ? "text" : "password"}
                className={`form-control ${
                  enviado &&
                  (senha.length < 6 || senha.length > 50)
                    ? "is-invalid"
                    : ""
                }`}
                placeholder="Senha"
                minLength={6}
                maxLength={50}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />

              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={() => setMostrarSenha(!mostrarSenha)}
              >
                <i
                  className={
                    mostrarSenha
                      ? "bi bi-eye-slash"
                      : "bi bi-eye"
                  }
                ></i>
              </button>

              <div className="invalid-feedback">
                A senha deve ter entre 6 e 50 caracteres.
              </div>

            </div>


            <div className="input-group has-validation mb-1">

              <input
                id="confirmaSenha"
                name="confirmaSenha"
                type="password"
                className={`form-control ${
                  enviado &&
                  (confirmaSenha.length < 6 ||
                    confirmaSenha.length > 50 ||
                    senha !== confirmaSenha)
                    ? "is-invalid"
                    : ""
                }`}
                placeholder="Confirme sua senha"
                minLength={6}
                maxLength={50}
                value={confirmaSenha}
                onChange={(e) => setConfirmaSenha(e.target.value)}
                required
              />

              <div className="invalid-feedback">
                As senhas não coincidem.
              </div>

            </div>


            <div className="form-check">

              <input
                type="checkbox"
                className={`form-check-input ${
                  enviado && !termos ? "is-invalid" : ""
                }`}
                id="termos"
                checked={termos}
                onChange={(e) => setTermos(e.target.checked)}
                required
              />

              <label
                className="form-check-label"
                htmlFor="termos"
              >
                Aceito os{" "}
                <a href="#">
                  Termos de Uso
                </a>{" "}
                e a{" "}
                <a href="#">
                  Política de Privacidade
                </a>
                .
              </label>

              <div className="invalid-feedback">
                Você precisa aceitar os termos para se cadastrar.
              </div>

            </div>

            <input
              type="submit"
              value="Cadastrar"
              id="submitCadastro"
            />

            <div id="textos-entrar">
              <p align="center">
                Já tem uma conta?{" "}
                <a href="/login">
                  Entrar
                </a>
              </p>
            </div>

          </form>

        </div>

      </main>

      <footer
        className="py-5 mt-5 mt-auto"
        style={{ backgroundColor: "#ECCCAF" }}
      >

        <div className="container d-flex justify-content-between align-items-center">

          <a href="#top">
            <img
              src="/Imagens/logo.png"
              style={{ height: "10rem" }}
              alt="Read & Swap"
            />
          </a>

          <div>
            <a href="" className="footer-link">
              Guia de Usuário
            </a>
            <br />

            <a href="" className="footer-link">
              Termos de Uso
            </a>
            <br />

            <a href="" className="footer-link">
              Dicas de Segurança
            </a>
            <br />

            <a href="" className="footer-link">
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
    </>
  );
}

export default Cadastrar;