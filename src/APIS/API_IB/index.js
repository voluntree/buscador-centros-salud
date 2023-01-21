//Imports de librerias o metodos de otros archivos.
import express from "express";
import fs from "fs"
import cors from "cors"
import { xmlToJson } from "../../services/wrappers.js";

const PORT = process.env.PORT || 3003 //Almacena el valor del puerto de la API
const app = express();                //Inicializa la api express

app.use(cors()) //Se utilizan en la API politicas CORS

/*
  Se le indica a la API a escuchar en el puerto que contiene la variable PORT.
  Y devuelve una respuesta cuando esta lista para recibir peticiones.
*/
app.listen(PORT, () => {
    console.log("Server is listening on " + PORT)
})

/*
  Se realiza la implementación para una petición de tipo GET en la direccion 
  http://localhost:PORT/centros/ib
*/
app.get("/centros/ib", (req, res) => {
    fs.readFile("Baleares.xml", "utf-8", function (err, data) {
      console.log(data);
      var array = xmlToJson(data);

      res.header("Content-Type", "application/json");
      res.send(JSON.stringify(array, null, 4));
    });
})