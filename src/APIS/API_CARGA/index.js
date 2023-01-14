import express from "express";
import cors from "cors";
import {
  getCentros,
  getLocalidades,
  getProvincias,
} from "../../services/services.js";
import { onValue, ref } from "firebase/database";
import { db } from "../../firebase.js";
import { ExtractorEUS } from "../../services/extractores.js";
import { ExtractorCV } from "../../services/extractores.js";
import { ExtractorIB } from "../../services/extractores.js";

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());

app.listen(PORT, () => {
  console.log("Server is listening on " + PORT);
});

app.get("/carga", (req, res) => {

    const comunidad = req.query.comunidad;
    const baleares = req.query.baleares;
    const euskadi = req.query.euskadi;

    if(comunidad == true){
    }
    if (baleares == true) {

    }
    if (euskadi == true) {
    
    }

})
