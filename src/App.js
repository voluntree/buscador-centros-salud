import React from "react";
import "./App.css";
import BuscadorComboBox from "./components/BuscadorComboBox.js";
import BuscadorTextInput from "./components/BuscadorTextInput.js";



function App() {
  /*const [isLoading, setIsLoading] = React.useState(true)
  const [state, setState] = React.useState(null)

  React.useEffect(() => {
    fetch("http://192.168.1.75:3002/centros/cv")
    .then((res) => res.json())
    .then((jsonObject) => {
      setState(jsonObject)
      setIsLoading(false)
    })
  }, [])

  if (isLoading){
    return (
      <div>
        <h1>Cargando...</h1>
      </div>
    );
  }*/

  return (
    <div className="AppContainer">
      <h1>Buscador de Centros de Salud</h1>
      <div className="BuscadorContainer">
        <div className="InputContainer">
          <BuscadorTextInput label = {"Localidad"} placeholder = "Nombre de la localidad..."/>
          <BuscadorTextInput label = {"Provincia"} placeholder = "Nombre de la provincia..."/>
          <BuscadorTextInput label = {"Código Postal"} placeholder = "Introduce el código postal..."/>
          <BuscadorComboBox label = {"Tipo"}/>
        </div>
        <div className="ButtonContainer">
          <button>Buscar</button>
          <button>Cancelar</button>
        </div>
      </div>
    </div>
  );
  
}

export default App;
