//Imports de librerias o metodos de otros archivos.
import express from "express";
import fs from "fs"
import cors from "cors"
import { xmlToJson } from "../../services/wrappers.js";
import { Console } from "console";

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

/**
 * @swagger
 * /centros/ib:
 *   get:
 *     summary: Devuelve una lista de centros en formato JSON.
 *     description: Devuelve una lista de centros en formato JSON. Extraidos de la fuente de datos en XML de las Islas Baleares
 *     responses:
 *       200:
 *         description: Una lista de centros usando el esquema de las Islas Baleares.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   the_geom:
 *                     type: string
 *                     description: El punto geografico del centro.
 *                     example: POINT (2.0 39.36)
 *                   objectid:
 *                     type: integer
 *                     description: El id del objeto.
 *                     example: 61
 *                   inpireid:
 *                     type: string
 *                     description: El id de inspire.
 *                     example: ES.GOIB.SUP_ActivityComplex.00895
 *                   nom:
 *                     type: string
 *                     description: El nombre del centro.
 *                     example: UB Sa Ràpita
 *                   funcio:
 *                     type: string
 *                     description: La funcion del centro.
 *                     example: UNITAT BÀSICA
 *                   latitud:
 *                     type: float
 *                     description: La latitud en la que se encuentra el centro.
 *                     example: 39.36661866
 *                   longitud:
 *                     type: float
 *                     description: La longitud en la que se encuentra el centro.
 *                     example: 2.93294588
 *                   adreca:
 *                     type: string
 *                     description: La direccion del centro.
 *                     example: Carrer de Tintorera, 9
 *                   municipi:
 *                     type: string
 *                     description: El municipio del centro.
 *                     example: Hospital
 * 
*/
app.get("/centros/ib", (req, res) => {
    console.log("PETICION RECIBIDA")

    fs.readFile("Baleares.xml", "utf-8", function (err, data) {
      
      var array = xmlToJson(data);

      res.header("Content-Type", "application/json");
      res.send(JSON.stringify(array, null, 4));
    });

    console.log("PETICION FINALIZADA")
})

import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API BALEARES',
    version: '1.0.0',
    description:
      'Es una aplicacion API REST hecha con Express. '+ 
      'Devuelve una lista de centros en formato JSON extraidos de la fuente de datos XML.',
  },
  servers: [
    {
      url: 'http://localhost:3003/',
      description: 'API BALEARES',
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