//Imports de librerias o metodos de otros archivos.
import express, { json } from "express";
import cors from "cors";
import {
  ExtraerCentroCV,
  ExtraerCentroEUS,
  ExtraerCentroIB,
} from "../../services/services.js";
import fetch from "node-fetch";

const PORT = process.env.PORT || 3005; //Almacena el valor del puerto de la API
const app = express();                 //Inicializa la api express

app.use(cors()); //Se utilizan en la API politicas CORS

/*
  Se le indica a la API a escuchar en el puerto que contiene la variable PORT.
  Y devuelve una respuesta cuando esta lista para recibir peticiones.
*/
app.listen(PORT, () => {
  console.log("Server is listening on " + PORT);
});

/*
  Se realiza la implementación para una petición de tipo GET en la direccion 
  http://localhost:PORT/carga?comunidad={value}&baleares={value}&euskadi={value}
*/
app.get("/carga", async (req, res) => {
  //Se obtiene el valor del parametro comunidad recibido a traves de la query
  const comunidad = req.query.comunidad;

  //Se obtiene el valor del parametro baleares recibido a traves de la query
  const baleares = req.query.baleares;

  //Se obtiene el valor del parametro euskadi recibido a traves de la query
  const euskadi = req.query.euskadi;

  //Se declara en el header el tipo del contenido. texto plano en este caso.
  res.setHeader("Content-Type", "text/plain; charset=utf-8");

  if (euskadi == "true") { //Si euskadi es igual a true
    var peticion = await fetch("http://localhost:3002/centros/eus"); //Peticion a la API de EUS para obtener los centros
    var centros = await peticion.json(); //Se pasan los centros a JSON
    for (let i = 0; i < centros.length; i++) { //Se recorren todos los centros
      var mensaje = await ExtraerCentroEUS(centros[i]); //Se extrae el centro y se recibe el resultado
      res.write(mensaje); //Envia el resultado obtenido
    }
  }

  if (comunidad == "true") { //Si comunidad es igual a true
    var peticion = await fetch(`http://localhost:3001/centros/cv`); //Peticion a la API de CV para obtener los centros
    var centros = await peticion.json(); //Se pasan los centros a JSON
    for (let i = 0; i < centros.length; i++) { //Se recorren todos los centros
      var mensaje = await ExtraerCentroCV(centros[i]); //Se extrae el centro y se recibe el resultado
      res.write(mensaje); //Envia el resultado obtenido
    }
  }

  if (baleares == "true") { //Si comunidad es igual a true
    var peticion = await fetch("http://localhost:3003/centros/ib"); //Peticion a la API de CV para obtener los centros
    var centros = await peticion.json(); //Se pasan los centros a JSON
    for (let i = 0; i < centros.length; i++) { //Se recorren todos los centros
      var mensaje = await ExtraerCentroIB(centros[i]); //Se extrae el centro y se recibe el resultado
      res.write(mensaje); //Envia el resultado obtenido
    }
  }

  res.end(); //Se finaliza la peticion
});
