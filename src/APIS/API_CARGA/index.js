//Imports de librerias o metodos de otros archivos.
import express, { json } from "express";
import cors from "cors";
import {
  ExtraerCentroCV,
  ExtraerCentroEUS,
  ExtraerCentroIB,
} from "../../services/services.js";
import fetch from "node-fetch";
import { ref, set } from "firebase/database";
import { db } from "../../firebase.js";

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

/**
 * @swagger
 * /carga?comunidad={comunidad}&baleares={baleares}&euskadi={esukadi}:
 *   get:
 *     summary: Devuelve texto plano con el resultado de la carga.
 *     description: Devuelve texto plano con el resultado de la carga.
 *     parameters:
 *     - in: query
 *       name: comunidad
 *       schema:
 *         type: string
 *       description: true o false si se quiere o no cargar los centros de la Comunidad Valenciana.
 *     - in: query
 *       name: baleares
 *       schema:
 *         type: string
 *       description: true o false si se quiere o no cargar los centros de las Islas Baleares.
 *     - in: query
 *       name: euskadi
 *       schema:
 *         type: string
 *       description: true o false si se quiere o no cargar los centros de la Euskadi.
 *     responses:
 *       200:
 *         description: Devuelve texto plano con el resultado de la carga.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: SUBIDO CORRECTAMENTE Hospital de Sagunto
*/
app.get("/carga", async (req, res) => {
  console.log("PETICION RECIBIDA")
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

  console.log("PETICION FINALIZADA")
});

/*
  Se realiza la implementación para una petición de tipo DELETE en la direccion 
  http://localhost:PORT/carga?comunidad={value}&baleares={value}&euskadi={value}
*/

/**
 * @swagger
 * /deleteall:
 *   delete:
 *     summary: Elimina todos los datos de la base de datos.
 *     description: Elimina todos los datos de la base de datos
 *     responses:
 *       200:
 *         description: No devuelve nada.
*/
app.delete("/deleteall", async (req,res)=>{ 
  try {
    let refer = ref(db, "/");
    await set(refer, {});
  } catch (error) {
    console.log("Error borrando");
  } finally{ console.log("Borrado terminado");}
});

import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API CARGA',
    version: '1.0.0',
    description:
      'Es una aplicacion API REST hecha con Express. ',
  },
  servers: [
    {
      url: 'http://localhost:3005/',
      description: 'API CARGA',
    },
  ],
};

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ['index.js'],
};

const swaggerSpec = swaggerJSDoc(options);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));