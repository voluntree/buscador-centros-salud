import md5 from "md5";
import { getCoordenadas, getDireccion, getTelefono } from "./scraper.js";

function crearObjetoEsquemaGlobal(){
    var datosEG = {nombre: "",
                   tipo: "",
                   direccion: "",
                   codigo_postal: 0,
                   longitud: 0,
                   latitud: 0,
                   telefono: 0,
                   descripcion: "",
                   localidad_nombre: "",
                   localidad_codigo: "",
                   provincia_nombre: "",
                   provincia_codigo: ""
                   }
    return datosEG;
}

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
        default: tipo = ""
    }

    return tipo;
}

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

export async function ExtractorCV(datosCV) {
    var datosEG = crearObjetoEsquemaGlobal();
    datosCV = JSON.parse(datosCV);

    datosEG.nombre = datosCV["Centre / Centro"]
    datosEG.tipo = definirTipoCV(datosCV["Tipus_centre / Tipo_centro"]);
    datosEG.direccion = datosCV["Adreça / Dirección"]
    if(datosCV["Codi_província / Código_provincia"].length == 1){
        datosEG.codigo_postal = "0" + datosCV["Codi_província / Código_provincia"] + datosCV["Codi_municipi / Código_municipio"]
    }else{
        datosEG.codigo_postal = datosCV["Codi_província / Código_provincia"]  + datosCV["Codi_municipi / Código_municipio"]
    }
    var data = await getCoordenadas(datosEG.codigo_postal,datosCV["Província / Provincia"] , datosCV["Municipi / Municipio"]);
    datosEG.longitud = data.longitud
    datosEG.latitud = data.latitud

    datosEG.telefono = await getTelefono(datosCV["Centre / Centro"])

    datosEG.descripcion = datosCV["Tipus_centre / Tipo_centro"]
    datosEG.localidad_nombre = datosCV["Municipi / Municipio"]
    datosEG.localidad_codigo = datosCV["Codi_municipi / Código_municipio"]
    datosEG.provincia_nombre = datosCV["Província / Provincia"]
    datosEG.provincia_codigo = datosCV["Codi_província / Código_provincia"]

    return datosEG;
}

export async function ExtractorEUS(datosEuskadi) {
    let datosEG = crearObjetoEsquemaGlobal();
    datosEuskadi = JSON.parse(datosEuskadi);

    datosEG.nombre = datosEuskadi.Nombre
    datosEG.tipo = definirTipoEuskadi(datosEuskadi.Tipodecentro)
    datosEG.direccion = datosEuskadi.Direccion
    datosEG.codigo_postal = datosEuskadi.Codigopostal
    datosEG.longitud = datosEuskadi.LATWGS84
    datosEG.latitud = datosEuskadi.LONWGS84
    datosEG.telefono = datosEuskadi.Telefono 
    datosEG.descripcion = datosEuskadi.HorarioatencionCiudadana 
                        ++ datosEuskadi.Horarioespecial
                        ++ datosEuskadi.Hospitaldereferencia
    datosEG.localidad_nombre = datosEuskadi.Municipio
    datosEG.localidad_codigo = md5(datosEuskadi.Municipio+datosEuskadi.Provincia)
    datosEG.provincia_nombre = datosEuskadi.Provincia
    datosEG.provincia_codigo = datosEuskadi.Codigopostal.substring(0,2)

    return datosEG;
}

export async function ExtractorIB(datosIB) {
    let datosEG = crearObjetoEsquemaGlobal();
    datosIB = JSON.parse(datosIB);

    datosEG.nombre = datosIB.nom
    datosEG.tipo = definirTipoIB(datosIB.funcio)
    datosEG.direccion = datosIB.adreca
    var data = await getDireccion(datosIB.lat, datosIB.long);
    datosEG.codigo_postal = data
    datosEG.longitud = datosIB.long
    datosEG.latitud = datosIB.lat
    datosEG.telefono = await getTelefono(datosIB.nom)
    datosEG.descripcion = ""
    datosEG.localidad_nombre = datosIB.municipi
    datosEG.localidad_codigo = md5(datosIB.municipi+"Illes Balears")
    datosEG.provincia_nombre = "Illes Balears"
    datosEG.provincia_codigo = "07"

    return datosEG;
}