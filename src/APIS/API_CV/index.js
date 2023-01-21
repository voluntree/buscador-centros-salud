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
/**
 * @swagger
 * /centros/cv:
 *   get:
 *     summary: Devuelve una lista de centros en formato JSON.
 *     description: Devuelve una lista de centros en formato JSON. Extraidos de la fuente de datos en XML de las Islas Baleares
 *     responses:
 *       200:
 *         description: Una lista de centros usando el esquema de la Comunidad Valenciana.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   Any / Año:
 *                     type: string
 *                     description: El año de los datos del centro.
 *                     example: 2021
 *                   Codi_província / Código_provincia:
 *                     type: string
 *                     description: El codigo de la provincia del centro.
 *                     example: 3
 *                   Província / Provincia:
 *                     type: string
 *                     description: El nombre de la provincia del centro.
 *                     example: Alicante
 *                   Codi_municipi / Código_municipio:
 *                     type: string
 *                     description: El codigo del municipio del centro.
 *                     example: 630
 *                   Municipi / Municipio:
 *                     type: string
 *                     description: El municipio del centro.
 *                     example: Denia
 *                   Registre / Registro:
 *                     type: string
 *                     description: El numero de registro del centro.
 *                     example: 435
 *                   Centre / Centro:
 *                     type: string
 *                     description: El nombre del centro.
 *                     example: HOSPITAL SAN CARLOS DE DENIA GRUPO HLA
 *                   Codi_tipus_centre / Código_tipo_centro:
 *                     type: string
 *                     description: El codigo del tipo de centro.
 *                     example: C.1.1
 *                   Tipus_centre / Tipo_centro:
 *                     type: string
 *                     description: El tipo de centro.
 *                     example: Hospitales generales
 *                   Codi_dependència_funcional / Código_dependéncia_funcional:
 *                     type: string
 *                     description: El codigo de dependencia funcional del centro.
 *                     example: 20
 *                   Dependència_funcional / Dependencia_funcional:
 *                     type: string
 *                     description: La dependencia funcional del centro.
 *                     example: Privados
 *                   Codi_règim / Código_régimen:
 *                     type: string
 *                     description: El codigo de regimen del centro.
 *                     example: PRI
 *                   Règim /Régimen:
 *                     type: string
 *                     description: El regimen del centro.
 *                     example: Privado
 *                   Adreça / Dirección:
 *                     type: string
 *                     description: La direccion del centro.
 *                     example: PTDA MADRIGUERES SUD 8
*/
app.get("/centros/cv", (req, res) => {
    console.log("PETICION RECIBIDA")
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
    console.log("PETICION FINALIZADA")
})

import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API COMUNIDAD VALENCIANA',
    version: '1.0.0',
    description:
      'Es una aplicacion API REST hecha con Express. '+ 
      'Devuelve una lista de centros en formato JSON extraidos de la fuente de datos CSV.',
  },
  servers: [
    {
      url: 'http://localhost:3001/',
      description: 'API COMUNIDAD VALENCIANA',
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