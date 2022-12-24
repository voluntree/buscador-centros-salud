import express from "express";
import cors from "cors"
import { getCentros, getLocalidades, getProvincias } from "../../services/services.js";

const PORT = process.env.PORT || 3004
const app = express();
var centros = Object.values(await getCentros())
var localidades = Object.values(await getLocalidades())
var provincias = Object.values(await getProvincias())

app.use(cors())

app.listen(PORT, () => {
    console.log("Server is listening on " + PORT)
    
})

app.get("/busqueda", (req, res) => {
    const localidad = req.query.localidad
    const provincia = req.query.provincia
    const cod_postal = req.query.cod_postal
    const tipo = req.query.tipo
    
    let centrosFiltrados = []
    
    if(localidad != ""){
        centrosFiltrados = centros.filter(centro => { 
           var nLocalidad = localidades.find(val => val.codigo === centro.en_localidad).nombre.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, "");
           return nLocalidad.includes(localidad.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, ""))
        })
    }
    
    if(provincia != ""){
        centrosFiltrados = [... new Set([...centrosFiltrados, ...centros.filter(centro => { 
            var cLocalidad = localidades.find(val => val.codigo === centro.en_localidad).en_provincia
            var nProvincia = provincias.find(val => val.codigo === cLocalidad).nombre.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, "");
            return nProvincia.includes(provincia.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, ""))
        })])]
    }
    
    if(cod_postal != ""){
        centrosFiltrados = [... new Set([...centrosFiltrados, ...centros.filter(centro => centro.codigo_postal.startsWith(parseInt(cod_postal)))])]
    }

    if(tipo != "" && tipo != "todos"){
        if(centrosFiltrados.length === 0 && localidad == "" && provincia == "" && cod_postal == ""){
            centrosFiltrados = centros
        }
        centrosFiltrados = centrosFiltrados.filter(centro => centro.tipo.toLowerCase() == tipo.toLowerCase())
    }

    if(centrosFiltrados.length === 0 && localidad == "" && provincia == "" && cod_postal == "" && (tipo == "todos" || tipo == "")){
        centrosFiltrados = centros
    }
    centrosFiltrados = centrosFiltrados.map(centro => obtenerLocalidadProvincia(centro, localidades, provincias)) 
    
    res.header("Content-Type", "application/json")
    res.send(JSON.stringify(centrosFiltrados, null, 4))
})

function obtenerLocalidadProvincia(centro, localidades, provincias){
    let centroCompleto = {codigo_postal: centro.codigo_postal,
                          descripcion: centro.descripcion,
                          direccion: centro.direccion,
                          localidad: "",
                          latitud: centro.latitud,
                          longitud: centro.longitud,
                          nombre: centro.nombre,
                          telefono: centro.telefono,
                          tipo: centro.tipo}
    let localidad = localidades.find(val => val.codigo === centro.en_localidad)
    let provincia = provincias.find(val => val.codigo === localidad.en_provincia)

    var localidadObjeto = {nombre: localidad.nombre,
                           provincia: provincia}
    centroCompleto.localidad = localidadObjeto

    return centroCompleto                           
}