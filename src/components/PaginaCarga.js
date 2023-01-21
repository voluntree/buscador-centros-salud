import React, { useState } from "react";
import "./PaginaCarga.css";

const PaginaCarga = () => {
  const [baleares, setbaleares] = useState(false);
  const [euskadi, seteuskadi] = useState(false);
  const [comunidad, setcomunidad] = useState(false);
  const [todos, settodos] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [mensajes, setMensajes] = useState([])

  const handleCargar = async () => {
    if (todos === false) {
      let respuesta = await fetch(`http://127.0.0.1:3005/carga?baleares=${baleares}&euskadi=${euskadi}&comunidad=${comunidad}`);
      setLoading(true)
      const reader = respuesta.body.pipeThrough(new TextDecoderStream()).getReader()
      let mensajes = ""
      while(true){
        const {value, done} = await reader.read()
        if(done) break
        mensajes += value
        setMensajes(mensajes)
      }
      setLoading(false)
    } else {
      let respuesta = await fetch(`http://127.0.0.1:3005/carga?baleares=true
        &euskadi=true&comunidad=true`)
        setLoading(true)
        const reader = respuesta.body.pipeThrough(new TextDecoderStream()).getReader()
        let mensajes = ""
        while(true){
          const {value, done} = await reader.read()
          if(done) break
          mensajes += value
          setMensajes(mensajes)
        }
        setLoading(false)
    }
  };

  const handleBorrar = async () => {
    let res = await fetch(`http://127.0.0.1:3005/deleteAll`, { method: 'DELETE' })
    console.log(res.status);
  };

  return (
    <div className="container">
      <h1>Carga del almacén de datos</h1>
      <div className="checkbox-container">
        <h2>Selección de fuente:</h2>
        <div>
          <div className="text-checkbox">
            <input
              className="checkbox"
              type="checkbox"
              id="topping"
              name="topping"
              value="Seleccionar Todos"
              checked={todos}
              onChange={() => {
                settodos(!todos);
                setbaleares(false);
                setcomunidad(false);
                seteuskadi(false);
              }}
            />
            <h3>Seleccionar Todos</h3>
          </div>
        </div>
        <div>
          <div className="text-checkbox">
            <input
              className="checkbox"
              type="checkbox"
              id="topping"
              name="topping"
              value="Islas Baleares"
              onChange={() => {
                setbaleares(!baleares);
              }}
              checked={baleares}
              disabled={todos}
            />
            <h3>Islas Baleares</h3>
          </div>
        </div>
        <div>
          <div className="text-checkbox">
            <input
              className="checkbox"
              type="checkbox"
              id="topping"
              name="topping"
              value="Euskadi"
              onChange={() => {
                seteuskadi(!euskadi);
              }}
              checked={euskadi}
              disabled={todos}
            />
            <h3>Euskadi</h3>
          </div>
        </div>
        <div>
          <div className="text-checkbox">
            <input
              className="checkbox"
              type="checkbox"
              id="topping"
              name="topping"
              value="Comunidad Valenciana"
              onChange={() => {
                setcomunidad(!comunidad);
              }}
              checked={comunidad}
              disabled={todos}
            />
            <h3>Comunidad Valenciana</h3>
          </div>
        </div>
      </div>
      <div className="buttons-container">
        <button className="boton-cargar" onClick={() => handleCargar()}>
          Cargar
        </button>
        <button className="boton-borrar" onClick={() => handleBorrar()}>
          Borrar
        </button>
      </div>
      <div className="text-field-container">
        <div className="container-carga">
          <h3>Resultados de la carga:</h3>
          {isLoading ?
          (<div className="container-spinner">
            <div className="spinner"></div>
            <label>Subiendo</label>
          </div>):<></>}
          
        </div>
        
        <textarea
          className="text-field"
          name="datos-cargados"
          rows="30"
          cols="100"
          value={mensajes}
          readOnly = {true}
        />
      </div> 
    </div>
  );
};

export default PaginaCarga;
