import React from 'react'
import "./Navbar.css";
function Navbar() {
  return (
    <div className='NavContainer'>
        <a  className='nav-text' href='/'>Home</a>
        <a className='nav-text' href='/carga'>Cargar centros</a>
    </div>
  )
}

export default Navbar