import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home.jsx'
import {InicializarComuns, ToggleDarkMode} from './components/common.jsx'
import './css/navbar.css'


function App() {

  

  return (
    <>

    <InicializarComuns/>
    <nav className="navbar navbar-expand-lg bg-light fixed-top "data-bs-theme="light">
            <div className="container-fluid">
    
              <Link to='/' className="navbar-brand">
                <img
                  id="logoNav"
                  src="./imagens/logo_navbar.png"
                  style={{ width: "8rem" }}
                  alt="Read & Swap"
                />
              </Link>
    
              <div
                className="collapse navbar-collapse"
                id="navbarSupportedContent"
              >
    
                <div className='navbar-nav me-auto mb-2 mb-lg-0'>

                  <li className='nav-item'>
                        <Link /*to='/Livroteca'*/
                          className="nav-link"
                        >
                          Minha biblioteca
                        </Link>
                  </li>
                  <li className="nav-item">
                    <Link /*to='/Swaps'*/
                      className="nav-link"
                    >
                      Swap
                    </Link>
                  </li>
    
                  <li className="nav-item">
                    <Link /*to='/Conversas'*/
                      className="nav-link"
                    >
                      Matches
                    </Link>
                  </li>
    
                  <li className="nav-item">
                    <Link /*to='/Premium'*/
                      className="nav-link"
                    >
                      Premium
                    </Link>
                  </li>
    
                
                </div>
    
    
                <ul className="navbar-nav mb-2 mb-lg-0">
    
                  <li className="nav-item">
                    <Link /*to='/Login'*/

                      className="nav-link entrar"
                    >
                      Entrar
                    </Link>
                  </li>
    
                  <li className="nav-item">
                    <Link /*to='/Cadastrar'*/>
                      <button className="btn btn-danger cadastrar">
                        Cadastrar
                      </button>
                    </Link>
                  </li>
    
                  <li style={{ display: "none" }}>
                    <Link /*  to='/Perfilacoes'*/
                      className="nav-link perfil"
                    >
                      <i className="bi bi-person-circle"></i>
                    </Link>
                  </li>
    
                  <li>
                  <input type="checkbox" id="darkmode-toggle" onChange={ToggleDarkMode}/>
<label for="darkmode-toggle">
   <svg version="1.1" class="sun" src='imagens/moon-svgrepo-com.svg' width="40px" height="12px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 3V4M12 20V21M4 12H3M6.31412 6.31412L5.5 5.5M17.6859 6.31412L18.5 5.5M6.31412 17.69L5.5 18.5001M17.6859 17.69L18.5 18.5001M21 12H20M16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
   <svg version="1.1" class="moon" src='imagens/sun-svgrepo-com.svg' width="40px" height="12px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.32031 11.6835C3.32031 16.6541 7.34975 20.6835 12.3203 20.6835C16.1075 20.6835 19.3483 18.3443 20.6768 15.032C19.6402 15.4486 18.5059 15.6834 17.3203 15.6834C12.3497 15.6834 8.32031 11.654 8.32031 6.68342C8.32031 5.50338 8.55165 4.36259 8.96453 3.32996C5.65605 4.66028 3.32031 7.89912 3.32031 11.6835Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
</label>
                  </li>
    
                </ul>
              
              
            </div>
            </div>
          </nav>
      <hr />
          
      <Routes>
        <Route path="/" element={<Home />}/>
       {/* <Route path="/Cadastrar" element={<Cadastrar />}/>
        <Route path="/Login" element={<Logar />}/>
        <Route path="/Perfilacoes" element={<Perfilacoes />}/>
        <Route path="/Conversas" element={<Conversas />}/>
        <Route path="/Livroteca" element={<Livroteca />}/>
        <Route path="/Swaps" element={<Swaps />}/>
        <Route path="/Premium" element={<Premium />}/>*/}
      </Routes>
</>
  )
}
export default App;


