import md5 from "md5";
import { getCoordenadas, getDireccion, getTelefono } from "./scraper.js";
import { getCodigoLocalidad } from "./services.js";

function crearObjetoEsquemaGlobal() {
  var datosEG = {
    nombre: "",
    tipo: "",
    direccion: "",
    codigo_postal: 0,
    longitud: 0,
    latitud: 0,
    telefono: 0,
    descripcion: "",
    en_localidad: "",
  };
  return datosEG;
}

function definirTipoCV(tipoOrigen) {
  let tipo;
  switch (tipoOrigen) {
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
    default:
      tipo = "";
      break;
  }

  return tipo;
}

function definirTipoEuskadi(tipoOrigen) {
  let tipo;
  switch (tipoOrigen) {
    case "Hospital":
      tipo = "Hospital";
      break;
    case "Centro de Salud":
    case "Centro de Salud Mental":
    case "Ambulatorio":
    case "Consultorio":
      tipo = "Centro de Salud";
      break;
    default:
      tipo = "Otros";
  }

  return tipo;
}

function definirTipoIB(tipoOrigen) {
  let tipo;
  switch (tipoOrigen) {
    case "CENTRE SANITARI":
    case "UNITAT BÀSICA":
      tipo = "Centro de salud";
      break;
    case "CENTRE SANITARI PREVIST":
      tipo = "Otros";
      break;
    default:
      tipo = "";
      break;
  }

  return tipo;
}

export async function ExtractorCV(datosCV) {
  var datosEG = crearObjetoEsquemaGlobal();
  datosCV = JSON.parse(datosCV);
  console.log("\nExtrayendo datos de " + datosCV["Centre / Centro"]);

  datosEG.nombre = datosCV["Centre / Centro"];
  console.log("   - Centro: " + datosEG.nombre + "\x1b[32m COMPLETADO\x1b[0m");

  datosEG.tipo = definirTipoCV(datosCV["Tipus_centre / Tipo_centro"]);
  console.log("   - Tipo: " + datosEG.tipo + "\x1b[32m COMPLETADO\x1b[0m");

  datosEG.direccion = datosCV["Adreça / Dirección"];
  console.log(
    "   - Direccion: " + datosEG.direccion + "\x1b[32m COMPLETADO\x1b[0m"
  );

  var data = await getCoordenadas(
    datosCV["Adreça / Dirección"].replace("S/N", ""),
    datosCV["Província / Provincia"],
    datosCV["Municipi / Municipio"]
  );

  datosEG.codigo_postal = data.codigo_postal;
  if (datosEG.codigo_postal != "") {
    console.log(
      "   - Código postal: " +
        datosEG.codigo_postal +
        "\x1b[32m COMPLETADO\x1b[0m"
    );
  } else {
    console.log(
      "   - Código postal: " + datosEG.codigo_postal + "\x1b[31m ERROR\x1b[0m"
    );
  }

  datosEG.longitud = parseFloat(data.longitud);
  console.log(
    "   - Longitud: " + datosEG.longitud + "\x1b[32m COMPLETADO\x1b[0m"
  );

  datosEG.latitud = parseFloat(data.latitud);
  console.log(
    "   - Latitud: " + datosEG.latitud + "\x1b[32m COMPLETADO\x1b[0m"
  );

  datosEG.telefono = await getTelefono(datosCV["Centre / Centro"]);
  if (datosEG.telefono != "") {
    console.log(
      "   - Telefono: " + datosEG.telefono + "\x1b[32m COMPLETADO\x1b[0m"
    );
  } else {
    console.log(
      "   - Telefono: " + datosEG.telefono + "\x1b[31m NO DISPONIBLE\x1b[0m"
    );
  }

  datosEG.descripcion = datosCV["Tipus_centre / Tipo_centro"];
  console.log(
    "   - Descripción: " + datosEG.descripcion + "\x1b[32m COMPLETADO\x1b[0m"
  );

  var cod_localidad = await getCodigoLocalidad(
    md5(datosCV["Municipi / Municipio"] + datosCV["Província / Provincia"]),
    datosCV["Municipi / Municipio"],
    datosCV["Codi_província / Código_provincia"],
    datosCV["Província / Provincia"]
  );
  datosEG.en_localidad = cod_localidad;
  console.log(
    "   - En localidad: " + datosEG.en_localidad + "\x1b[32m COMPLETADO\x1b[0m"
  );

  return datosEG;
}

export async function ExtractorEUS(datosEuskadi) {
  let datosEG = crearObjetoEsquemaGlobal();
  datosEuskadi = JSON.parse(datosEuskadi);
  console.log("\nExtrayendo datos de " + datosEuskadi.Nombre);

  datosEG.nombre = datosEuskadi.Nombre;
  console.log("   - Centro: " + datosEG.nombre + "\x1b[32m COMPLETADO\x1b[0m");

  datosEG.tipo = definirTipoEuskadi(datosEuskadi.Tipodecentro);
  console.log("   - Tipo: " + datosEG.tipo + "\x1b[32m COMPLETADO\x1b[0m");

  datosEG.direccion = datosEuskadi.Direccion;
  console.log(
    "   - Direccion: " + datosEG.direccion + "\x1b[32m COMPLETADO\x1b[0m"
  );

  datosEG.codigo_postal = datosEuskadi.Codigopostal;
  console.log(
    "   - Código postal: " +
      datosEG.codigo_postal +
      "\x1b[32m COMPLETADO\x1b[0m"
  );

  datosEG.longitud = parseFloat(datosEuskadi.LONWGS84);
  console.log(
    "   - Longitud: " + datosEG.longitud + "\x1b[32m COMPLETADO\x1b[0m"
  );

  datosEG.latitud = parseFloat(datosEuskadi.LATWGS84);
  console.log(
    "   - Latitud: " + datosEG.latitud + "\x1b[32m COMPLETADO\x1b[0m"
  );

  datosEG.telefono = datosEuskadi.Telefono;
  console.log(
    "   - Telefono: " + datosEG.telefono + "\x1b[32m COMPLETADO\x1b[0m"
  );

  datosEG.descripcion = datosEuskadi.HorarioatencionCiudadana;
  ++datosEuskadi.Horarioespecial;
  ++datosEuskadi.Hospitaldereferencia;
  console.log(
    "   - Descripción: " + datosEG.descripcion + "\x1b[32m COMPLETADO\x1b[0m"
  );

  var cod_localidad = await getCodigoLocalidad(
    md5(datosEuskadi.Municipio + datosEuskadi.Provincia),
    datosEuskadi.Municipio,
    datosEuskadi.Codigopostal.substring(0, 2),
    datosEuskadi.Provincia
  );
  datosEG.en_localidad = cod_localidad;
  console.log(
    "   - En localidad: " + datosEG.en_localidad + "\x1b[32m COMPLETADO\x1b[0m"
  );

  return datosEG;
}

export async function ExtractorIB(datosIB) {
  let datosEG = crearObjetoEsquemaGlobal();
  datosIB = JSON.parse(datosIB);
  console.log("\nExtrayendo datos de " + datosIB.nom);

  datosEG.nombre = datosIB.nom;
  console.log("   - Centro: " + datosEG.nombre + "\x1b[32m COMPLETADO\x1b[0m");

  datosEG.tipo = definirTipoIB(datosIB.funcio);
  console.log("   - Tipo: " + datosEG.tipo + "\x1b[32m COMPLETADO\x1b[0m");

  datosEG.direccion = datosIB.adreca;
  console.log(
    "   - Direccion: " + datosEG.direccion + "\x1b[32m COMPLETADO\x1b[0m"
  );

  var data = await getDireccion(datosIB.lat, datosIB.long);

  datosEG.codigo_postal = data;
  if (datosEG.codigo_postal != "") {
    console.log(
      "   - Código postal: " +
        datosEG.codigo_postal +
        "\x1b[32m COMPLETADO\x1b[0m"
    );
  } else {
    console.log(
      "   - Código postal: " + datosEG.codigo_postal + "\x1b[31m ERROR\x1b[0m"
    );
  }

  datosEG.longitud = datosIB.long;
  console.log(
    "   - Longitud: " + datosEG.longitud + "\x1b[32m COMPLETADO\x1b[0m"
  );

  datosEG.latitud = datosIB.lat;
  console.log(
    "   - Latitud: " + datosEG.latitud + "\x1b[32m COMPLETADO\x1b[0m"
  );

  datosEG.telefono = await getTelefono(datosIB.nom);
  if (datosEG.telefono != "") {
    console.log(
      "   - Telefono: " + datosEG.telefono + "\x1b[32m COMPLETADO\x1b[0m"
    );
  } else {
    console.log(
      "   - Telefono: " + datosEG.telefono + "\x1b[31m NO DISPONIBLE\x1b[0m"
    );
  }

  datosEG.descripcion = "";
  console.log(
    "   - Descripción: " + datosEG.descripcion + "\x1b[32m COMPLETADO\x1b[0m"
  );

  var cod_localidad = await getCodigoLocalidad(
    md5(datosIB.municipi + "Illes Balears"),
    datosIB.municipi,
    "07",
    "Illes Balears"
  );
  datosEG.en_localidad = cod_localidad;
  console.log(
    "   - En localidad: " + datosEG.en_localidad + "\x1b[32m COMPLETADO\x1b[0m"
  );

  return datosEG;
}

export function extraer(baleares, euskadi, comunidad) {
  if (baleares == true) {
    ExtractorIB();
  }
  if (euskadi == true) {
    ExtractorEUS();
  }
  if (comunidad == true) {
    ExtractorCV();
  }
}
