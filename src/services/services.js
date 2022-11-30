import { ExtractorCV, ExtractorEUS, ExtractorIB } from "./wrappers";
import { getDatabase, ref, set } from "firebase/database";
import { db } from "../firebase";
const md5 = require("md5")

export function arrayAJsonCV(array) {
  let json = {};
  array.forEach((element) => {
    let elem = ExtractorCV(JSON.stringify(element));
    json[elem.nombre] = elem;
  });

  return json;
}

export function arrayAJsonEUS(array) {
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

const data = require("../fuentes/GV.json");
console.log(data);
const array = arrayAJsonCV(data)
upload(array)