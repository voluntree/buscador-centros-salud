import { ExtractorCV, ExtractorEUS, ExtractorIB } from "./extractores.js";
import { getDatabase, ref, set, get, child, onValue} from "firebase/database";
import { db } from "../firebase.js";
import md5 from "md5"



export async function arrayAJsonCV(array) {
    let mensaje;
    for (let element of array) {
      let elem = await ExtractorCV(JSON.stringify(element));
      if (elem.codigo_postal != "") {
        mensaje += `SUBIDO CORRECTAMENTE: ${elem.nombre} \n`;
        await upload(elem);
      } else {
        mensaje += `ERROR: ${elem.nombre} \n`;
      }
    }
    return mensaje
}

export async function arrayAJsonEUS(array) {
  
    let mensaje;
    for(let element of array){
    let elem = await ExtractorEUS(JSON.stringify(element));
    if(elem.codigo_postal != ""){
      mensaje += `SUBIDO CORRECTAMENTE: ${elem.nombre} \n`;
      await upload(elem)
    } else {
      mensaje += `ERROR: ${elem.nombre} \n`;
    }
  };
 return mensaje;
}

export async function arrayAJsonIB(array) {
  
    let mensaje;
    for (let element of array) {
      let elem = await ExtractorIB(JSON.stringify(element));
      if (elem.codigo_postal != "") {
        mensaje += `SUBIDO CORRECTAMENTE: ${elem.nombre} \n`;
        await upload(elem);
      } else {
        mensaje += `ERROR: ${elem.nombre} \n`;
      }
    }
  return mensaje
}

export async function upload(objeto){
    let hashClave = md5(objeto.nombre);
    let refer = ref(db,"centros/" + hashClave)
    await set(refer,{...objeto})
    console.log("   - " + objeto.nombre + " \x1b[32mSUBIDO CON EXITO\x1b[0m")
}

export async function getCodigoLocalidad(codigo, nombre, cod_prov, nombre_prov){
  
  return await get(ref(db, "localidades/" + codigo + "/")).then((snapshot) => {
    if(snapshot.exists()){
      return snapshot.val().codigo;
    }else{
      let refer = ref(db, "localidades/" + codigo)
      getCodigoProvincia(cod_prov, nombre_prov)

      let localidad = {codigo: codigo,
                       nombre: nombre,
                       en_provincia: cod_prov}
      
      set(refer, {...localidad})
      return codigo
    }
  });
  
}

export async function getCodigoProvincia(codigo, nombre){
  await get(ref(db, "provincias/" + codigo + "/")).then((snapshot) => {
    if(snapshot.exists()){
      return snapshot.val().codigo;
    }else{
      let refer = ref(db, "provincias/" + codigo)
      let provincia = {codigo: codigo,
                       nombre: nombre}
      set(refer, {...provincia})

      return codigo;
    }
  });
}

export async function getCentros(){
  return new Promise(function (resolve, reject) {
    const refCentros = ref(db, "centros/")
  
    onValue(refCentros, (snapshot) => {
      resolve(snapshot.val());
    })
  })
}

export async function getLocalidades(){
  return new Promise(function (resolve, reject) {
    const refCentros = ref(db, "localidades/")
  
    onValue(refCentros, (snapshot) => {
      resolve(snapshot.val());
    })
  })
}

export async function getProvincias(){
  return new Promise(function (resolve, reject) {
    const refCentros = ref(db, "provincias/")
  
    onValue(refCentros, (snapshot) => {
      resolve(snapshot.val());
    })
  })
}

/*let inicioExtraccion = new Date()
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
exit()*/