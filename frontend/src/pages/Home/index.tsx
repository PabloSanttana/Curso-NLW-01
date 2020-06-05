import React,{useState} from 'react'
import {FiLogIn,FiSearch} from 'react-icons/fi'
import {Link} from 'react-router-dom'


import logo from '../../assets/logo.svg'
import './styles.css'

const Home = () =>{
    const [search, setSearch] = useState(false)
    return(
      <>
      <div id="page-home">
          <div className="content">
              <header>
                <img src={logo} alt="Ecoleta"/>
                <Link to='/create-point'>
                 <FiLogIn/>
                   Cadastre um ponto de coleta
                </Link>
              </header>

              <main>
                  <h1>Seu marketplace de coleta de resíduos.</h1>
                  <p>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</p>

                  <a onClick={() => setSearch(!search)}>
                    <span>
                       <FiSearch/>
                    </span>
                    <strong>Pequisar pontis de coleta</strong>
                  </a>
              </main>

          </div>
      </div>
    {search &&
    <div>
        <div onClick={() => setSearch(!search)} id="modalHome"></div>
        <div id="modalHome__content">
            <h1>Pontos de coleta</h1>
          <input type="text" placeholder="Digite a cidade" />
          <input type="text" placeholder="Digite o estado"/>
          <Link to='/'>Buscar</Link>
        </div>
    </div>
    
    
    }  
      </>
    )
}

export default Home