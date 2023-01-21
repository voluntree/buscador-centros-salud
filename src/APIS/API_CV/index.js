//Imports de librerias o metodos de otros archivos.
import express from "express";
import fs from "fs"
import cors from "cors"
import { csvToJson } from "../../services/wrappers.js";


const PORT = process.env.PORT || 3001 //Almacena el valor del puerto de la API
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
  http://localhost:PORT/centros/cv
*/
app.get("/centros/cv", (req, res) => {
    //Lee el archivo CV.csv
    fs.readFile("CV.csv", "utf-8", function (err, data) {
        
        //Ejecuta el metodo csvToJson y obtiene los datos del csv en formato JSON
        const array = csvToJson(data)
        
        //Se declara en el header el tipo del contenido. JSON en este caso.
        res.header("Content-Type", "application/json")

        /*
        Se envia el resultado de la peticion en formato JSON. 
        Se envian los datos de la variable array.
        */
        res.send(JSON.stringify(array, null, 4))
    })
})