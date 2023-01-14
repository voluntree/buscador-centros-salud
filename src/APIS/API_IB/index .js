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
  http://localhost:PORT/busqueda
*/
app.get("/centros/ib", (req, res) => {
    //Lee el archivo IB.xml
    fs.readFile("IB.xml", "utf-8", function (err, data) {

        //Ejecuta el metodo xmlToJson y obtiene los datos del xml en formato JSON
        var array = xmlToJson(data)
        
        //Se declara en el header el tipo del contenido. JSON en este caso.
        res.header("Content-Type", "application/json")

        /*
        Se envia el resultado de la peticion en formato JSON. 
        Se envian los datos de la variable array.
        */
        res.send(JSON.stringify(array, null, 4))
    })
})