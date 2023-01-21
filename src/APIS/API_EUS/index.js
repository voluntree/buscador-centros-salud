//Imports de librerias o metodos de otros archivos.
import express from "express";
import cors from "cors"
import eusData from './EUS.json' assert { type: "json" }; //Obtiene los datos del archivo EUS.json en formato JSON

const PORT = process.env.PORT || 3002 //Almacena el valor del puerto de la API
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
  http://localhost:PORT/centros/eus
*/
app.get("/centros/eus", (req, res) => {

    //Se declara en el header el tipo del contenido. JSON en este caso.
    res.header("Content-Type", "application/json")

    //Se envia el resultado de la peticion en formato JSON. Se envian los datos del archivo JSON.
    res.send(JSON.stringify(eusData, null, 4))
})