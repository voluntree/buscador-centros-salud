import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import PaginaPrincipal from "./components/PaginaPrincipal.js";
import PaginaCarga from "./components/PaginaCarga.js";
import "./App.css";


function App() {
  return (
    <div className="AppContainer">
      <Routes>
        <Route path="/" element ={<PaginaPrincipal/>} />
        <Route path="/carga" element={<PaginaCarga/>} />
      </Routes>
    </div>
  );
  
}

export default App;

