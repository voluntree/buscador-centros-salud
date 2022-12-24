import React, { useState } from "react";
import "./App.css";
import BuscadorComboBox from "./components/BuscadorComboBox.js";
import BuscadorTextInput from "./components/BuscadorTextInput.js";



function App() {
  const [localidad, setLocalidad] = useState([])
  const [provincia, setProvincia] = useState([])
  const [cod_postal, setCodPostal] = useState([])
  const [tipo, setTipo] = useState([])
  const [centros, setCentros] = useState([])

  React.useEffect(() => {
    fetch(`http://192.168.1.75:3004/busqueda?localidad=${localidad}&provincia=${provincia}&cod_postal=${cod_postal}&tipo=${tipo}`)
    .then((res) => res.json())
    .then((jsonObject) => {
      setCentros(jsonObject)
    })
  }, [])

  function getCentros () {
    fetch(`http://192.168.1.75:3004/busqueda?localidad=${localidad}&provincia=${provincia}&cod_postal=${cod_postal}&tipo=${tipo}`)
    .then((res) => res.json())
    .then((jsonObject) => {
      setCentros(jsonObject)
    })
  }
  
  return (
    <div className="AppContainer">
      <h1>Buscador de Centros de Salud</h1>
      <div className="BuscadorContainer">
        <div className="InputContainer">
          <BuscadorTextInput label = {"Localidad"} placeholder = "Nombre de la localidad..." onChange = {setLocalidad} value = {localidad}/>
          <BuscadorTextInput label = {"Provincia"} placeholder = "Nombre de la provincia..." onChange = {setProvincia} value = {provincia}/>
          <BuscadorTextInput label = {"Código Postal"} placeholder = "Introduce el código postal..." onChange = {setCodPostal} value = {cod_postal}/>
          <BuscadorComboBox label = {"Tipo"} onChange = {setTipo} value = {tipo}/>
        </div>
        <div className="ButtonContainer">
          <button onClick={getCentros()}>Buscar</button>
          <button>Cancelar</button>
        </div>
      </div>
      <div className="responsive-table">
      <table >
          <tr>
            <th >Nombre</th>
            <th >Dirección</th>
            <th >Localidad</th>
            <th >Provincia</th>
            <th >Tipo</th>
            <th >Teléfono</th>
            <th >Descripción</th>
            <th >Latitud</th>
            <th >Longitud</th>
          </tr>
        {centros.map(centro => {
          return (
              <tr className="table-row">
                <td >{centro.nombre}</td>
                <td >{centro.direccion}</td>
                <td >{centro.localidad.nombre}</td>
                <td >{centro.localidad.provincia.nombre}</td>
                <td >{centro.tipo}</td>
                <td >{centro.telefono}</td>
                <td >{centro.descripcion}</td>
                <td >{centro.latitud}</td>
                <td >{centro.longitud}</td>
              </tr>
          )
        })}
      </table>
      </div>
    </div>
  );
  
}

export default App;
