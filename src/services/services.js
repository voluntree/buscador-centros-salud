//Imports de librerias o metodos de otros archivos.
import { ExtractorCV, ExtractorEUS, ExtractorIB } from "./extractores.js";
import { ref, set, get, onValue } from "firebase/database";
import { db } from "../firebase.js";
import md5 from "md5";

/*
Extrae la informacion de un centro del tipo Comunidad Valenciana y lo sube a la 
base de datos.
Devuelve un mensaje con el resultado de la extraccion
*/
export async function ExtraerCentroCV(centro) {
  return new Promise(async (resolve, reject) => {
    let mensaje;
    let centroExtraido = await ExtractorCV(JSON.stringify(centro));
    if (centroExtraido.codigo_postal != "") {
      await upload(centroExtraido);
      mensaje = `SUBIDO CORRECTAMENTE: ${centroExtraido.nombre} \n`;
    } else {
      mensaje = `ERROR: ${centroExtraido.nombre} \n`;
    }

    resolve(mensaje)
  })
}

/*
Extrae la informacion de un centro del tipo Euskadi y lo sube a la 
base de datos.
Devuelve un mensaje con el resultado de la extraccion
*/
export async function ExtraerCentroEUS(centro) {
  return new Promise(async (resolve, reject) => {
    let mensaje;
    let centroExtraido = await ExtractorEUS(JSON.stringify(centro));
    if (centroExtraido.codigo_postal != "") {
      await upload(centroExtraido);
      mensaje = `SUBIDO CORRECTAMENTE: ${centroExtraido.nombre} \n`;
    } else {
      mensaje = `ERROR: ${centroExtraido.nombre} \n`;
    }

    resolve(mensaje)
  })
}

/*
Extrae la informacion de un centro del tipo Illes Balears y lo sube a la 
base de datos.
Devuelve un mensaje con el resultado de la extraccion
*/
export async function ExtraerCentroIB(centro) {
  return new Promise(async (resolve, reject) => {
    let mensaje;
    let centroExtraido = await ExtractorIB(JSON.stringify(centro));
    if (centroExtraido.codigo_postal != "") {
      await upload(centroExtraido);
      mensaje = `SUBIDO CORRECTAMENTE: ${centroExtraido.nombre} \n`;
    } else {
      mensaje = `ERROR: ${centroExtraido.nombre} \n`;
    }

    resolve(mensaje)
  })
}

//Sube un centro a la base de datos
export async function upload(centro) {
  let hashClave = md5(centro.nombre); //Crea el hash del nombre del centro para que sea unico
  let refer = ref(db, "centros/" + hashClave); //Obtiene la referencia del centro
  await set(refer, { ...centro }); //Sube el centro a la base de datos en la referencia anterior.
  console.log("   - " + centro.nombre + " \x1b[32mSUBIDO CON EXITO\x1b[0m");
}

//Obtiene el codigo de una localidad y sube la localidad a la base de datos si no existe
export async function getCodigoLocalidad(
  codigo,
  nombre,
  cod_prov,
  nombre_prov
) {
  //Devuelve el codigo de la localidad
  return await get(ref(db, "localidades/" + codigo + "/")).then((snapshot) => {
    if (snapshot.exists()) {
      //Si existe
      return snapshot.val().codigo; //Devuelve el codigo obtenido
    } else {
      //Si no existe
      let refer = ref(db, "localidades/" + codigo); //Obtiene la referencia
      getCodigoProvincia(cod_prov, nombre_prov); //Obtiene el codigo de la provincia

      //Crea el objeto localidad
      let localidad = {
        codigo: codigo,
        nombre: nombre,
        en_provincia: cod_prov,
      };

      set(refer, { ...localidad }); //Sube el objeto localidad a la base de datos
      return codigo; //Devuelve el codigo de la localidad
    }
  });
}

//Obtiene el codigo de la provincia y sube la provincia a la base de datos si no existe
export async function getCodigoProvincia(codigo, nombre) {
  await get(ref(db, "provincias/" + codigo + "/")).then((snapshot) => {
    if (snapshot.exists()) {
      //Si la provincia existe
      return snapshot.val().codigo; //Devuelve el codigo de la provincia
    } else {
      let refer = ref(db, "provincias/" + codigo); //Obtiene la referencia

      //Crea el objeto provincia
      let provincia = { codigo: codigo, nombre: nombre };

      set(refer, { ...provincia }); //Sube el objeto provincia a la base datos

      return codigo; //Devuelve el codigo de la provincia
    }
  });
}
