import { ExtractorCV, ExtractorEUS, ExtractorIB } from "./extractores.js";
import { getDatabase, ref, set } from "firebase/database";
import { db } from "../firebase.js";
import md5 from "md5"
import data from "../fuentes/primera_entrega/CV.json" assert { type: "json" };

export async function arrayAJsonCV(array) {
  let json = {};

  for (let element of array){
    let elem = await ExtractorCV(JSON.stringify(element));
    json[elem.nombre] = elem;
  }

  return json;
}

export async function arrayAJsonEUS(array) {
  let json = {};
  array.forEach((element) => {
    let elem = ExtractorEUS(JSON.stringify(element));
    json[elem.nombre] = elem;
  });

  return json;
}

export function arrayAJsonIB(array) {
  let json = {};
  array.forEach((element) => {
    let elem = ExtractorIB(JSON.stringify(element));
    json[elem.nombre] = elem;
  });

  return json;
}

export async function upload(hospitales){
  let claves = Object.keys(hospitales);
  for (let i = 0; i < claves.length; i++){
    let clave = claves[i];
    let hashClave = md5(clave);
    let refer = ref(db,"centros/" + hashClave)
    set(refer,{...hospitales[clave]})
  }
}


console.log(data);
const datosCV = await arrayAJsonCV(data)
upload(datosCV)