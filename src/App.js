import React from "react";
import "./App.css";



function App() {
  const [isLoading, setIsLoading] = React.useState(true)
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
  }

  return (
    <div style={{display: "flex", justifyContent: "center", flexFlow: "column", alignItems: "center"}}>
      <h1>Centros CV</h1>
      <ul>{state.map((centro) => <li>{centro["Centre / Centro"]}</li>)}</ul>
    </div>
  );
  
}

export default App;
