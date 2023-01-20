import express, { json } from "express";
import cors from "cors";
import {
  ExtraerCentroCV,
  ExtraerCentroEUS,
  ExtraerCentroIB,
} from "../../services/services.js";
import fetch from "node-fetch";

const PORT = process.env.PORT || 3005;
const app = express();

app.use(cors());

app.listen(PORT, () => {
  console.log("Server is listening on " + PORT);
});

app.get("/carga", async (req, res) => {
  const comunidad = req.query.comunidad;
  const baleares = req.query.baleares;
  const euskadi = req.query.euskadi;

  res.setHeader("Content-Type", "text/plain; charset=utf-8");

  if (euskadi == "true") {
    var peticion = await fetch("http://localhost:3002/centros/eus");
    var centros = await peticion.json();
    for (let i = 0; i < centros.length; i++) {
      var mensaje = await ExtraerCentroEUS(centros[i]);
      res.write(mensaje);
    }
  }

  if (comunidad == "true") {
    var peticion = await fetch(`http://localhost:3001/centros/cv`);
    var centros = await peticion.json();
    for (let i = 0; i < centros.length; i++) {
      var mensaje = await ExtraerCentroCV(centros[i]);
      res.write(mensaje);
    }
  }

  if (baleares == "true") {
    var peticion = await fetch("http://localhost:3003/centros/ib");
    var centros = await peticion.json();
    for (let i = 0; i < centros.length; i++) {
      var mensaje = await ExtraerCentroIB(centros[i]);
      res.write(mensaje);
    }
  }

  res.end();
});
