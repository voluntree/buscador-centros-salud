//Imports de librerias o metodos de otros archivos.
import express from "express";
import cors from "cors"
import { onValue, ref } from "firebase/database";
import { db } from "../../firebase.js";


const PORT = process.env.PORT || 3004          //Almacena el valor del puerto de la API
const app = express();                         //Inicializa la api express
const refCentros = ref(db, "centros/")         //Obtiene la referencia de los CENTROS de la bd 
const refLocalidades = ref(db, "localidades/") //Obtiene la referencia de las LOCALIDADES de la bd
const refProvincias = ref(db, "provincias/")   //Obtiene la referencia de las PROVINCIAS de la bd
    

/*
  Obtiene los centros con el metodo onValue que escucha los cambios en la bd y actualiza la 
  información cuando se realiza algún cambio
*/
var centros = onValue(refCentros, (snapshot) => centros = Object.values(snapshot.val()))

/*
  Obtiene las localidades con el metodo onValue que escucha los cambios en la bd y actualiza la 
  información cuando se realiza algún cambio
*/
var localidades = onValue(refLocalidades, (snapshot) => localidades = Object.values(snapshot.val()))

/*
  Obtiene las provincias con el metodo onValue que escucha los cambios en la bd y actualiza la 
  información cuando se realiza algún cambio
*/
var provincias = onValue(refProvincias, (snapshot) => provincias = Object.values(snapshot.val()))

app.use(cors()) //Se utilizan en la API politicas CORS 

/*
  Se le indica a la API a escuchar en el puerto que contiene la variable PORT.
  Y devuelve una respuesta cuando esta lista para recibir peticiones.
*/
app.listen(PORT, () => {
    console.log("Server is listening on " + PORT)
})

/*
  Se realiza la implementación para una petición de tipo GET en la direccion http://localhost:PORT/busqueda
*/
app.get("/busqueda", (req, res) => {
    //Se obtiene el valor del parametro localidad recibido a traves de la query
    const localidad = req.query.localidad 

    //Se obtiene el valor del parametro provincia recibido a traves de la query
    const provincia = req.query.provincia

    //Se obtiene el valor del parametro cod_postal recibido a traves de la query
    const cod_postal = req.query.cod_postal

    //Se obtiene el valor del parametro tipo recibido a traves de la query
    const tipo = req.query.tipo
    
    //Crea una variable con un array vacío para almacenar los centros que cumplan los requisitos.
    let centrosFiltrados = []
    
    //Si el campo de localidad no esta vacío
    if(localidad != ""){
        //Se filtran los centros y se almacenan en la variable centrosFiltrados
        centrosFiltrados = centros.filter(centro => { //Para cada centro
           /*
           Se obtiene el nombre de la localidad buscandolo en localidades comparando el codigo de la 
           localidad. Y se normaliza el nombre para que este en minusculas y sin acentos.
           */
           var nLocalidad = localidades.find(val => val.codigo === centro.en_localidad).nombre.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, "");
           
           /* 
           Comprueba si el nombre de la localidad es igual al recibido en la peticion.
           Si devuelve verdadero lo añade a la lista. Sino pasa al siguiente centro.
           */
           return nLocalidad.includes(localidad.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, ""))
        })
    }
    
    //Si el campo provincia no esta vacío
    if(provincia != ""){
        /*
        Se filtran los centros y se combina el resultado con los obtenidos al filtrar por localidad y 
        se almacena en centrosFiltrados.
        */
       centrosFiltrados = [... new Set([...centrosFiltrados, ...centros.filter(centro => { //Para cada centro
            
        //Se obtiene la localidad del centro para obtener el codigo de la provincia.
        var cProvincia = localidades.find(val => val.codigo === centro.en_localidad).en_provincia

        /*
        Se obtiene el nombre de la provincia comparando el codigo de la provincia con el de la 
        localidad.
        */
        var nProvincia = provincias.find(val => val.codigo === cProvincia).nombre.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, "");
        
        /*
        Comprueba si el nombre de la provincia es igual al recibido en la peticion.
        Si devuelve verdadero lo añade a la lista. Sino pasa al siguiente centro.
        */
        return nProvincia.includes(provincia.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, ""))
        
        })])]
    }
    
    //Si el campo cod_postal no esta vacío
    if(cod_postal != ""){
        /*
        Se filtran los centros y se combina el resultado con los obtenidos al filtrar por localidad y 
        provincia y se almacena en centrosFiltrados.
        */
        centrosFiltrados = [... new Set([...centrosFiltrados, ...centros.filter(centro => 
            //Compara si el codigo postal empieza por el valor pasado o si es igual.
            centro.codigo_postal.startsWith(parseInt(cod_postal)))])]
    }

    //Si el tipo no esta vacío y el tipo no es todos
    if(tipo != "" && tipo != "todos"){
        /*
        Si centrosFiltrado esta vacío y los campos localidad, provincia y cod_postal 
        también, almacena los centros en centrosFiltrados.
        Esto se hace para que en el caso en el que solo se filtre por tipo la lista de centrosFiltrados no
        este vacía y devuelva los resultados correctos.
        */
        if(centrosFiltrados.length === 0 && localidad == "" && provincia == "" && cod_postal == ""){
            centrosFiltrados = centros
        }

        /*
        Se filtran los centrosFiltrados por tipo y se almacenan en centrosFiltrados. Para cada centro
        se compara si el tipo es igual al de la peticion.
        */
        centrosFiltrados = centrosFiltrados.filter(centro => centro.tipo.toLowerCase() == tipo.toLowerCase())
    }

    //En el caso en el que la peticion no tenga valores y se devuelven todos los centros.
    if(centrosFiltrados.length === 0 && localidad == "" && provincia == "" && cod_postal == "" && (tipo == "todos" || tipo == "")){
        centrosFiltrados = centros
    }

    //Para cada centroFiltrado se añaden al objeto la localidad y la provincia.
    centrosFiltrados = centrosFiltrados.map(centro => obtenerLocalidadProvincia(centro, localidades, provincias)) 
    
    //Se declara en el header el tipo del contenido. JSON en este caso.
    res.header("Content-Type", "application/json")

    //Se envia el resultado de la peticion en formato JSON
    res.send(JSON.stringify(centrosFiltrados, null, 4))
})

//Funcion que se llama para completar el objeto de un centro
function obtenerLocalidadProvincia(centro, localidades, provincias){
    //Se crea el objeto base con los valores del centro y un campo nuevo llamado localidad.
    let centroCompleto = {codigo_postal: centro.codigo_postal,
                          descripcion: centro.descripcion,
                          direccion: centro.direccion,
                          localidad: "",
                          latitud: centro.latitud,
                          longitud: centro.longitud,
                          nombre: centro.nombre,
                          telefono: centro.telefono,
                          tipo: centro.tipo}
    //Se busca el nombre de la localidad y se almacena 
    let localidad = localidades.find(val => val.codigo === centro.en_localidad)

    //Se busca el nombre de la provincia y se almacena
    let provincia = provincias.find(val => val.codigo === localidad.en_provincia)

    //Se crea un objeto localidad que tiene el nombre de la localidad y de la provincia.
    var localidadObjeto = {nombre: localidad.nombre,
                           provincia: provincia}
    
    //Se asigna el objeto al campo localidad del centroCompleto
    centroCompleto.localidad = localidadObjeto

    //Se devuelve el centroCompleto con los datos necesarios
    return centroCompleto                           
}