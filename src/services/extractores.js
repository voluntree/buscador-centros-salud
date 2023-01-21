//Imports de librerias o metodos de otros archivos.
import md5 from "md5";
import { getCoordenadas, getDireccion, getTelefono } from "./scraper.js";
import { getCodigoLocalidad } from "./services.js";

//Crea un objeto con el esquema global
function crearObjetoEsquemaGlobal(){
    var datosEG = {nombre: "",
                   tipo: "",
                   direccion: "",
                   codigo_postal: 0,
                   longitud: 0,
                   latitud: 0,
                   telefono: 0,
                   descripcion: "",
                   en_localidad: "",
                   }
    return datosEG;
}

//Convierte el tipo de origen de la Comunidad Valencia al esquema global
function definirTipoCV(tipoOrigen){
    let tipo;
    switch (tipoOrigen){
        case "HOSPITALES DE MEDIA Y LARGA ESTANCIA":
        case "HOSPITALES DE SALUD MENTAL Y TRATAMIENTO DE TOXICOMANÍAS":
        case "HOSPITALES ESPECIALIZADOS":
        case "HOSPITALES GENERALES":
            tipo = "Hospital";
            break;
        case "CENTRO/SERVICIO DE URGENCIAS Y EMERGENCIAS":
        case "CENTRO DE CIRUGIA MAYOR AMBULATORIA":
        case "CENTROS DE ESPECIALIDADES":
        case "CENTROS DE SALUD":
        case "CENTROS DE SALUD MENTAL":
        case "CENTROS POLIVALENTES":
        case "CONSULTORIOS DE ATENCIÓN PRIMARIA":
            tipo = "Centro de Salud";
            break;
        case "BANCOS DE TEJIDOS":
        case "CENTROS DE DIAGNÓSTICO":
        case "CENTROS DE DIÁLISIS":
        case "CENTROS DE INTERRUPCIÓN VOLUNTARIA DEL EMBARAZO":
        case "CENTROS DE RECONOCIMIENTO":
        case "CENTROS DE REPRODUCCIÓN HUMANA ASISTIDA":
        case "CENTRO DE TRANSFUSIÓN":
        case "CENTROS ESPECIALIZADOS":
        case "CENTROS MÓVILES DE ASISTENCIA SANITARIA":
        case "CENTROS SANITARIOS INTEGRADOS":
        case "CENTROS TEMPORALES CON INTERNAMIENTO":
        case "CENTROS TEMPORALES DE VACUNACIÓN COVID":
        case "CLÍNICAS DENTALES":
        case "CONSULTAS DE OTROS PROFESIONALES SANITARIOS":
        case "CONSULTAS MÉDICAS":
        case "ESTABLECIMIENTOS DE AUDIOPRÓTESIS":
        case "OFICINAS DE FARMACIA":
        case "ÓPTICAS":
        case "ORTOPEDIAS":
        case "OTROS CENTROS CON INTERNAMIENTO":
        case "OTROS CENTROS ESPECIALIZADOS":
        case "OTROS PROVEEDORES DE ATENCIÓN":
        case "SANITARIA SIN INTERNAMIENTO":
        case "SERVICIOS SANITARIOS INTEGRADOS EN UNA ORGANIZACIÓN NO SANITARIA":
        case "UCI MÓVILES (CLASE C) A SUPRIMIR":
            tipo = "Otros";
            break;
        default: tipo = ""
            break;
    }

  return tipo;
}

//Convierte el tipo de origen de Euskadi al esquema global
function definirTipoEuskadi(tipoOrigen){
    let tipo;
    switch (tipoOrigen){
        case "Hospital": tipo = "Hospital" 
            break
        case "Centro de Salud": 
        case "Centro de Salud Mental":
        case "Ambulatorio":
        case "Consultorio":
            tipo = "Centro de Salud"
            break;
        default: tipo = "Otros"
    }

  return tipo;
}

//Convierte el tipo de origen de Illes Balears al esquema global
function definirTipoIB(tipoOrigen){
    let tipo;
    switch (tipoOrigen){
        case "CENTRE SANITARI": 
        case "UNITAT BÀSICA": 
            tipo = "Centro de salud"
            break;
        case "CENTRE SANITARI PREVIST": 
            tipo = "Otros"
            break;
        default: tipo = ""
            break;
    }

  return tipo;
}

//Extractor Comunidad Valenciana
export async function ExtractorCV(datosCV) {
    var datosEG = crearObjetoEsquemaGlobal(); //Obtiene un objeto del esquema global
    datosCV = JSON.parse(datosCV); //Convierte los datos JSON a un objeto javascript

    datosEG.nombre = datosCV["Centre / Centro"] //Obtiene el centro
    datosEG.tipo = definirTipoCV(datosCV["Tipus_centre / Tipo_centro"]) //Obtiene el tipo de centro
    datosEG.direccion = datosCV["Adreça / Dirección"] //Obtiene la direccion
    //Obtiene las coordenadas y el codigo postal con el scraper
    var data = await getCoordenadas(datosCV["Adreça / Dirección"].replace("S/N","") 
                                   ,datosCV["Província / Provincia"]
                                   ,datosCV["Municipi / Municipio"])
    datosEG.codigo_postal = data.codigo_postal //Obtiene el codigo postal
    datosEG.longitud = parseFloat(data.longitud) //Obtiene la longitud
    datosEG.latitud = parseFloat(data.latitud) //Obtiene la latitud
    datosEG.telefono = await getTelefono(datosCV["Centre / Centro"]) //Obtiene el telefono con el scraper
    datosEG.descripcion = datosCV["Tipus_centre / Tipo_centro"] //Obtiene la descripcion
    //Obtiene el codigo de la localidad
    var cod_localidad = await getCodigoLocalidad(md5(datosCV["Municipi / Municipio"]
                        +datosCV["Província / Provincia"]), 
                        datosCV["Municipi / Municipio"], 
                        datosCV["Codi_província / Código_provincia"], 
                        datosCV["Província / Provincia"]);
    datosEG.en_localidad = cod_localidad; //Almacena la localidad

    return datosEG; //Devuelve el objeto del esquema global
}

//Extractor Euskadi
export async function ExtractorEUS(datosEuskadi) {
  let datosEG = crearObjetoEsquemaGlobal(); //Obtiene un objeto del esquema global
  datosEuskadi = JSON.parse(datosEuskadi); //Convierte los datos JSON a un objeto javascript
  
  datosEG.nombre = datosEuskadi.Nombre; //Obtiene el nombre
  datosEG.tipo = definirTipoEuskadi(datosEuskadi.Tipodecentro); //Obtiene el tipo de centro
  datosEG.direccion = datosEuskadi.Direccion; //Obtiene la direccion
  datosEG.codigo_postal = datosEuskadi.Codigopostal; //Obtiene el codigo postal
  datosEG.longitud = parseFloat(datosEuskadi.LONWGS84); //Obtiene la longitud
  datosEG.latitud = parseFloat(datosEuskadi.LATWGS84); //Obtiene la latitud
  datosEG.telefono = datosEuskadi.Telefono; //Obtiene el telefono
  datosEG.descripcion = datosEuskadi.HorarioatencionCiudadana; //Obtiene datos adicionales
  ++datosEuskadi.Horarioespecial;
  ++datosEuskadi.Hospitaldereferencia;
  //Obtiene el codigo de la localidad
  var cod_localidad = await getCodigoLocalidad(
    md5(datosEuskadi.Municipio + datosEuskadi.Provincia),
    datosEuskadi.Municipio,
    datosEuskadi.Codigopostal.substring(0, 2),
    datosEuskadi.Provincia
  );
  datosEG.en_localidad = cod_localidad; //Establece el codigo de la localidad
 
  return datosEG; //Devuelve el objeto del esquema global
}

//Extractor Illes Balears
export async function ExtractorIB(datosIB) {
  let datosEG = crearObjetoEsquemaGlobal(); //Obtiene un objeto del esquema global
  datosIB = JSON.parse(datosIB); //Convierte los datos JSON a un objeto javascript
  
  datosEG.nombre = datosIB.nom; //Obtiene el nombre
  datosEG.tipo = definirTipoIB(datosIB.funcio); //Obtiene el tipo de centro
  datosEG.direccion = datosIB.adreca; //Obtiene la direccion
  datosEG.codigo_postal = await getDireccion(datosIB.lat, datosIB.long); //Obtiene el codigo postal
  datosEG.longitud = datosIB.long; //Obtiene la longitud
  datosEG.latitud = datosIB.lat; //Obtiene la latitud
  datosEG.telefono = await getTelefono(datosIB.nom); //Obtiene el telefono
  datosEG.descripcion = ""; //Obtiene la descripcion
  //Obtiene la localidad
  var cod_localidad = await getCodigoLocalidad(
    md5(datosIB.municipi + "Illes Balears"),
    datosIB.municipi,
    "07",
    "Illes Balears"
  );
  datosEG.en_localidad = cod_localidad; //Establece el codigo de la localidad

  return datosEG; //Devuelve el objeto del esquema global
}
