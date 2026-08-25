import { useState } from 'react'
import { useEffect } from 'react'
import {InicializarComuns, ToggleDarkMode} from './components/common.jsx'
import Navbar from './components/navbar.jsx'
import Footer from './components/footer.jsx'
import './css/App.css'



function App() {
  return (
    <>
    <InicializarComuns/>
     <Navbar/>

    <div id="top">
      <main>

     

        <header
          id="header-index"
          style={{
            position: "relative",
            overflow: "hidden",
            backgroundColor: "white"
          }}
        >

          <img
            src="/Imagens/header.png"
            style={{
              width: "100%",
              display: "block"
            }}
            className="imgHeader"
            alt="Read & Swap"
          />

          <div
            style={{
              position: "absolute",
              top: "20%",
              left: "10%",
              zIndex: 2
            }}
          >

            <h1>
              O melhor da troca de livros
            </h1>

            <h5>
              Nosso site proporciona uma forma fácil e divertida de trocar livros.
            </h5>

            <br />

            <a
              href="/cadastro"
              className="btn btn-outline-danger comece"
            >
              Crie sua conta gratuitamente
            </a>

            <br />
            <br />
            <br />

            <h4>
              Baixe o aplicativo:
            </h4>

            <img
              src="/Imagens/app_store.png"
              style={{ width: "15%" }}
              alt="App Store"
            />

            <img
              src="/Imagens/google_play.png"
              style={{ width: "14.5%" }}
              alt="Google Play"
            />

          </div>

        </header>



        <div className="container">

          <div
            style={{
              textAlign: "center",
              marginTop: "5%",
              marginBottom: "5%"
            }}
          >

            <h1>
              Como funciona
            </h1>


            <div
              id="comoFuncionaCarousel"
              className="carousel slide myContainerCarrossel"
              data-bs-ride="carousel"
              data-bs-interval="2500"
            >

       

              <div className="carousel-indicators">

                <button
                  type="button"
                  data-bs-target="#comoFuncionaCarousel"
                  data-bs-slide-to="0"
                  className="active"
                ></button>

                <button
                  type="button"
                  data-bs-target="#comoFuncionaCarousel"
                  data-bs-slide-to="1"
                ></button>

                <button
                  type="button"
                  data-bs-target="#comoFuncionaCarousel"
                  data-bs-slide-to="2"
                ></button>

              </div>



              <div className="carousel-inner">

                <div className="carousel-item active">

                  <div className="card text-center p-4 mx-auto como-card">

                    <img
                      src="/Imagens/livro1.jpg"
                      className="img-fluid mb-3 como-img"
                      alt="Livro"
                    />

                    <h1 className="numero">
                      1
                    </h1>

                    <h5>
                      Cadastre seus livros
                    </h5>

                    <p>
                      Adicione os livros que você já leu e quer
                      trocar com outras pessoas.
                    </p>

                  </div>

                </div>


                <div className="carousel-item">

                  <div className="card text-center p-4 mx-auto como-card">

                    <img
                      src="/Imagens/livro2.jpg"
                      className="img-fluid mb-3 como-img"
                      alt="Livro"
                    />

                    <h1 className="numero">
                      2
                    </h1>

                    <h5>
                      Encontre interessados
                    </h5>

                    <p>
                      Veja livros disponíveis na sua região e
                      demonstre interesse.
                    </p>

                  </div>

                </div>


                <div className="carousel-item">

                  <div className="card text-center p-4 mx-auto como-card">

                    <img
                      src="/Imagens/livro3.jpg"
                      className="img-fluid mb-3 como-img"
                      alt="Livro"
                    />

                    <h1 className="numero">
                      3
                    </h1>

                    <h5>
                      Combine a troca
                    </h5>

                    <p>
                      Quando houver interesse em comum, converse
                      e finalize a troca.
                    </p>

                  </div>

                </div>

              </div>



              <button
                className="carousel-control-prev"
                type="button"
                data-bs-target="#comoFuncionaCarousel"
                data-bs-slide="prev"
              >
                <span className="carousel-control-prev-icon custom-arrow"></span>
              </button>



              <button
                className="carousel-control-next"
                type="button"
                data-bs-target="#comoFuncionaCarousel"
                data-bs-slide="next"
              >
                <span className="carousel-control-next-icon custom-arrow"></span>
              </button>

            </div>

          </div>


          <div
            style={{
              textAlign: "center",
              marginTop: "5%",
              marginBottom: "5%"
            }}
          >

            <h1>
              Conectando leitores, colecionando histórias
            </h1>


            <div
              className="text-center mt-3 mb-5"
              style={{
                maxWidth: "700px",
                margin: "0 auto"
              }}
            >

              <h5>
                O Read & Swap é uma plataforma que conecta leitores
                que desejam trocar livros entre si. De forma simples
                e prática, você encontra pessoas próximas, demonstra
                interesse em livros e realiza trocas que ajudam a
                renovar sua estante sem gastar dinheiro.
              </h5>

            </div>



            <div className="container mb-5">

              <div className="row text-center g-4">

                <div className="col-md-4">

                  <div className="p-3 cards-index rounded shadow-sm h-100">

                    <i
                      className="bi bi-arrow-left-right"
                      style={{
                        fontSize: "30px",
                        color: "#ff5757"
                      }}
                    ></i>

                    <h5 className="mt-2">
                      Troque sem gastar
                    </h5>

                    <p>
                      Renove sua coleção trocando livros que você
                      já leu por novos títulos.
                    </p>

                  </div>

                </div>


                <div className="col-md-4">

                  <div className="p-3 cards-index rounded shadow-sm h-100">

                    <i
                      className="bi bi-geo-alt"
                      style={{
                        fontSize: "30px",
                        color: "#ff5757"
                      }}
                    ></i>

                    <h5 className="mt-2">
                      Perto de você
                    </h5>

                    <p>
                      Encontre leitores da sua região e facilite
                      a troca de livros.
                    </p>

                  </div>

                </div>


                <div className="col-md-4">

                  <div className="p-3 cards-index rounded shadow-sm h-100">

                    <i
                      className="bi bi-heart"
                      style={{
                        fontSize: "30px",
                        color: "#ff5757"
                      }}
                    ></i>

                    <h5 className="mt-2">
                      Encontre o que gosta
                    </h5>

                    <p>
                      Demonstre interesse em livros e combine
                      trocas com outros usuários.
                    </p>

                  </div>

                </div>

              </div>

            </div>

            <div className="text-center mb-5">

              <a
                href="/cadastro"
                className="btn btn-danger px-4 py-2"
                style={{ width: "300px" }}
              >
                Começar agora
              </a>

            </div>

          </div>

        </div>

      </main>



    </div>

  <Footer/>

</>
  )
}
export default App;


