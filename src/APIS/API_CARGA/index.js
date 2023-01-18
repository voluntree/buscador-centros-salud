import express, { json } from "express";
import cors from "cors";
import { ExtractorCV } from "../../services/extractores.js";
import { arrayAJsonCV, arrayAJsonEUS, arrayAJsonIB } from "../../services/services.js";
import fetch from "node-fetch";

const PORT = process.env.PORT || 3005;
const app = express();

app.use(cors());

var mensaje = "";

app.listen(PORT, () => {
  console.log("Server is listening on " + PORT);
});

app.get("/carga", (req, res) => {
  const comunidad = req.query.comunidad;
  const baleares = req.query.baleares;
  const euskadi = req.query.euskadi;

  if (euskadi == "true") {
    fetch("http://localhost:3002/centros/eus").then((res) => {
      res.json().then((jsonObject) => {
        let arrayEuskadi = jsonObject;
        arrayAJsonEUS(arrayEuskadi).then((msg) => mensaje += msg);
      });
    });
  }

  if (comunidad == "true") {
    fetch(`http://localhost:3001/centros/cv`).then((res) => {
      res.json().then((jsonObject) => {
        let arrayComunidad = jsonObject;
        arrayAJsonCV(arrayComunidad).then((msg) => mensaje += msg);
      });
    });
  }

  if (baleares == "true") {
    fetch("http://localhost:3003/centros/ib").then((res) => {
      res.json().then((jsonObject) => {
        let arrayBaleares = jsonObject;
        arrayAJsonIB(arrayBaleares).then((msg) => mensaje += msg);
      });
    });
  }
  res.send(mensaje);
});
