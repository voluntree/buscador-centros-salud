import { ExtractorCV, ExtractorEUS, ExtractorIB } from "./extractores.js";
import { getDatabase, ref, set } from "firebase/database";
import { db } from "../firebase.js";
import md5 from "md5"
import dataCV from "../fuentes/primera_entrega/CV.json" assert { type: "json" };
import dataIB from "../fuentes/primera_entrega/IB.json" assert {type: "json"};
import dataEUS from "../fuentes/primera_entrega/EUS.json" assert {type: "json"};
import { exit } from "process";



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
  for(let element of array){
    let elem = await ExtractorEUS(JSON.stringify(element));
    json[elem.nombre] = elem;
  };

  return json;
}

export async function arrayAJsonIB(array) {
  let json = {};
  for(let element of array){
    let elem = await ExtractorIB(JSON.stringify(element));
    json[elem.nombre] = elem;
  };

  return json;
}

export async function upload(hospitales){
  let claves = Object.keys(hospitales);
  for (let clave of claves){
    let hashClave = md5(clave);
    let refer = ref(db,"centros/" + hashClave)
    await set(refer,{...hospitales[clave]})
  }
}

const datosEUS = await arrayAJsonEUS(dataEUS)
const datosCV = await arrayAJsonCV(dataCV)
const datosIB = await arrayAJsonIB(dataIB)

await upload(datosEUS)
await upload(datosCV)
await upload(datosIB)
console.log("Datos subidos con exito")
exit()