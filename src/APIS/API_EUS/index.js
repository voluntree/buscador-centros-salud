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

/**
 * @swagger
 * /centros/eus:
 *   get:
 *     summary: Devuelve una lista de centros en formato JSON.
 *     description: Devuelve una lista de centros en formato JSON. Extraidos de la fuente de datos de Euskadi.
 *     responses:
 *       200:
 *         description: Una lista de centros usando el esquema de Euskadi.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   Nombre:
 *                     type: string
 *                     description: El nombre del centro.
 *                     example: Centro de Salud de Amorebieta-Etxano
 *                   Codigodelcentro:
 *                     type: string
 *                     description: El codigo del centro.
 *                     example: centsal_amorebieta
 *                   Tipodecentro:
 *                     type: string
 *                     description: El tipo de centro.
 *                     example: Centro de Salud
 *                   HorarioatencionCiudadana:
 *                     type: string
 *                     description: El horario de atención ciudadana del centro.
 *                     example: de lunes a viernes de 08:00 a 20:00
 *                   Horarioespecial:
 *                     type: string
 *                     description: El horario especial del centro.
 *                     example: para urgencias leves fuera del horario del Centro de Salud...
 *                   Hospitaldereferencia:
 *                     type: string
 *                     description: El hospital de referencia del centro.
 *                     example: Hospital de Galdakao-Usansolo
 *                   LATWGS84:
 *                     type: string
 *                     description: La latitud en la que se encuentra el centro.
 *                     example: 39.36661866
 *                   LONWGS84:
 *                     type: string
 *                     description: La longitud en la que se encuentra el centro.
 *                     example: 2.93294588
 *                   Direccion:
 *                     type: string
 *                     description: La direccion del centro.
 *                     example: San Miguel 17
 *                   Comarca:
 *                     type: string
 *                     description: La comarca del centro.
 *                     example: Interior
 *                   Municipio:
 *                     type: string
 *                     description: El municipio del centro.
 *                     example: Amorebieta-Etxano
 *                   Codigopostal:
 *                     type: string
 *                     description: El codigo postal del centro.
 *                     example: 48340
 *                   Provincia:
 *                     type: string
 *                     description: La provincia del centro.
 *                     example: Bizkaia
 *                   Telefono:
 *                     type: string
 *                     description: El telefono del centro.
 *                     example: 946007200
 *                   Fax:
 *                     type: string
 *                     description: El fax del centro.
 *                     example: 946007206
 *                   Correoelectronico:
 *                     type: string
 *                     description: El correo electronico del centro.
 *                     example: SECRETARIA.UAP.AMOREBIETA@osakidetza.eus
 * 
*/
app.get("/centros/eus", (req, res) => {

    console.log("PETICION RECIBIDA")
    //Se declara en el header el tipo del contenido. JSON en este caso.
    res.header("Content-Type", "application/json")

    //Se envia el resultado de la peticion en formato JSON. Se envian los datos del archivo JSON.
    res.send(JSON.stringify(eusData, null, 4))
    console.log("PETICION FINALIZADA")
})

import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API EUSKADI',
    version: '1.0.0',
    description:
      'Es una aplicacion API REST hecha con Express. '+ 
      'Devuelve una lista de centros en formato JSON extraidos de la fuente de datos de Euskadi.',
  },
  servers: [
    {
      url: 'http://localhost:3002/',
      description: 'API EUSKADI',
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