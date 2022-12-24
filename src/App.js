import React, { useEffect, useState } from "react";
import "./App.css";
import BuscadorComboBox from "./components/BuscadorComboBox.js";
import BuscadorTextInput from "./components/BuscadorTextInput.js";
import md5 from "md5"


function App() {
  const [localidad, setLocalidad] = useState("")
  const [provincia, setProvincia] = useState("")
  const [cod_postal, setCodPostal] = useState("")
  const [tipo, setTipo] = useState("todos")
  const [centros, setCentros] = useState([])
  const [reset, setReset] = useState(false)
  
  useEffect(() => {
    getCentros()
  }, [reset])

  function getCentros () {
    fetch(`http://192.168.1.75:3004/busqueda?localidad=${localidad}&provincia=${provincia}&cod_postal=${cod_postal}&tipo=${tipo}`)
    .then((res) => res.json())
    .then((jsonObject) => {
      setCentros(jsonObject)
    })
  }

  function limpiarCampos(){
    setLocalidad("")
    setProvincia("")
    setCodPostal("")
    setTipo("todos")
    setReset(!reset)
  }

  const listaCentros = () => {
    if(centros.length === 0){
      return <div style={{display: "flex", justifyContent: "center"}}><label>No se han encontrado centros</label></div>
    }else{
      return (<table >
        <thead>
          <tr key = {0}>
            <th >Nombre</th>
            <th className="t-max">Dirección</th>
            <th className="t-max">Cod. Postal</th>
            <th className="t-max">Localidad</th>
            <th className="t-max">Provincia</th>
            <th className="t-max">Tipo</th>
            <th className="t-max">Teléfono</th>
            <th >Descripción</th>
            <th className="t-max">Latitud</th>
            <th className="t-max">Longitud</th>
          </tr>
        </thead>
        <tbody>
        {centros.map(centro => {
          return (
              <tr key={md5(centro.nombre)} className="table-row">
                <td >{centro.nombre}</td>
                <td className="t-max">{centro.direccion}</td>
                <td className ="t-max">{centro.codigo_postal}</td>
                <td className="t-max">{centro.localidad.nombre}</td>
                <td className="t-max">{centro.localidad.provincia.nombre}</td>
                <td className="t-max">{centro.tipo}</td>
                <td className="t-max">{centro.telefono}</td>
                <td >{centro.descripcion}</td>
                <td className="t-max">{centro.latitud}</td>
                <td className="t-max">{centro.longitud}</td>
              </tr>
          )
        })}
        </tbody>
      </table>)
    }
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
          <button onClick={getCentros}>Buscar</button>
          <button onClick={limpiarCampos}>Cancelar</button>
        </div>
      </div>
      <div className="responsive-table">
      {listaCentros()}
      </div>
    </div>
  );
  
}

export default App;

