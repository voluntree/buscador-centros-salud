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
    if(elem.codigo_postal != ""){
      json[elem.nombre] = elem;
      console.log("\n\x1b[32mEXTRACCION CORRECTA\x1b[0m")
    } else {
      console.log("\n\x1b[31mEXTRACCION INCORRECTA " + elem.nombre + "\x1b[0m")
    }
  }

  return json;
}

export async function arrayAJsonEUS(array) {
  let json = {};
  for(let element of array){
    let elem = await ExtractorEUS(JSON.stringify(element));
    if(elem.codigo_postal != ""){
      json[elem.nombre] = elem;
      console.log("\n\x1b[32mEXTRACCION CORRECTA\x1b[0m")
    } else {
      console.log("\n\x1b[31mEXTRACCION INCORRECTA " + elem.nombre + "\x1b[0m")
    }
  };

  return json;
}

export async function arrayAJsonIB(array) {
  let json = {};
  for(let element of array){
    let elem = await ExtractorIB(JSON.stringify(element));
    if(elem.codigo_postal != ""){
      json[elem.nombre] = elem;
      console.log("\n\x1b[32mEXTRACCION CORRECTA\x1b[0m")
    } else {
      console.log("\n\x1b[31mEXTRACCION INCORRECTA " + elem.nombre + "\x1b[0m")
    }
  };

  return json;
}

export async function upload(hospitales){
  let claves = Object.keys(hospitales);
  for (let clave of claves){
    let hashClave = md5(clave);
    let refer = ref(db,"centros/" + hashClave)
    await set(refer,{...hospitales[clave]})
    console.log("   - " + clave + " \x1b[32mSUBIDO CON EXITO\x1b[0m")
  }
}

let inicioExtraccion = new Date()
console.log("\nINICIANDO EXTRACCIÓN DE DATOS")
console.log("\nEXTRAYENDO DATOS DE EUSKADI")
const datosEUS = await arrayAJsonEUS(dataEUS)

console.log("\nEXTRAYENDO DATOS DE LA COMUNIDAD VALENCIANA")
const datosCV = await arrayAJsonCV(dataCV)

console.log("\nEXTRAYENDO DATOS DE LAS ISLAS BALEARES")
const datosIB = await arrayAJsonIB(dataIB)

console.log("\nEXTRACCIÓN DE DATOS FINALIZADA")
// Tiempo de extraccion en minutos, segundos y milisegundos
let tiempoExtraccion = new Date() - inicioExtraccion
let minutos = Math.floor(tiempoExtraccion / 60000)
let segundos = ((tiempoExtraccion % 60000) / 1000).toFixed(0)
let milisegundos = tiempoExtraccion % 1000
console.log("TIEMPO DE EXTRACCIÓN: " + minutos + " minutos, " + segundos + " segundos y " + milisegundos + " milisegundos")

console.log("\nSUBIENDO LOS DATOS A LA BASE DE DATOS")
await upload(datosEUS)
await upload(datosCV)
await upload(datosIB)
console.log("DATOS SUBIDOS CON ÉXITO")

console.log("TIEMPO DE EXTRACCIÓN: " + minutos + " minutos, " + segundos + " segundos y " + milisegundos + " milisegundos")
exit()