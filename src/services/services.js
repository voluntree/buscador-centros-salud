//Imports de librerias o metodos de otros archivos.
import { ExtractorCV, ExtractorEUS, ExtractorIB } from "./extractores.js";
import { ref, set, get, onValue} from "firebase/database";
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

//Sube un centro a la base de datos
export async function upload(centro){
    let hashClave = md5(centro.nombre); //Crea el hash del nombre del centro para que sea unico
    let refer = ref(db,"centros/" + hashClave) //Obtiene la referencia del centro
    await set(refer,{...centro}) //Sube el centro a la base de datos en la referencia anterior.
    console.log("   - " + centro.nombre + " \x1b[32mSUBIDO CON EXITO\x1b[0m")
}

//Obtiene el codigo de una localidad y sube la localidad a la base de datos si no existe
export async function getCodigoLocalidad(codigo, nombre, cod_prov, nombre_prov){
  
  //Devuelve el codigo de la localidad
  return await get(ref(db, "localidades/" + codigo + "/")).then((snapshot) => {
    if(snapshot.exists()){ //Si existe
      return snapshot.val().codigo; //Devuelve el codigo obtenido
    }else{ //Si no existe
      let refer = ref(db, "localidades/" + codigo) //Obtiene la referencia
      getCodigoProvincia(cod_prov, nombre_prov) //Obtiene el codigo de la provincia

      //Crea el objeto localidad
      let localidad = {codigo: codigo,
                       nombre: nombre,
                       en_provincia: cod_prov}
      
      set(refer, {...localidad}) //Sube el objeto localidad a la base de datos
      return codigo //Devuelve el codigo de la localidad
    }
  });
  
}

//Obtiene el codigo de la provincia y sube la provincia a la base de datos si no existe
export async function getCodigoProvincia(codigo, nombre){
  await get(ref(db, "provincias/" + codigo + "/")).then((snapshot) => {
    if(snapshot.exists()){ //Si la provincia existe
      return snapshot.val().codigo; //Devuelve el codigo de la provincia
    }else{
      let refer = ref(db, "provincias/" + codigo) //Obtiene la referencia

      //Crea el objeto provincia
      let provincia = {codigo: codigo,
                       nombre: nombre}

      set(refer, {...provincia}) //Sube el objeto provincia a la base datos

      return codigo; //Devuelve el codigo de la provincia
    }
  });
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