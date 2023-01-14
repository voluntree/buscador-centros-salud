import { xml2js } from "xml-js"

//Wrapper de Comunidad Valencia
export function csvToJson(data){
    
    /*
    Remplaza los caracteres especiales ?:\\[r] o [\r] por "". Y separa por \n y almacena las 
    lineas del archivo csv.
    */
    const lines = data.replace(/(?:\\[r]|[\r])+/g, "").split("\n");
    
    /*
    Obtiene los nombres de los campos de cada objeto del csv y los separa por ;
    */
    const keys = lines[0].split(";");
    
    //Se crea una array vacío
    const array = [];

    //Se recorren las lineas desde la 1 a lenght - 1 
    for(let i = 1; i < lines.length; i++){
        // Se separa la linea por ; para obtener los valores
        const values = lines[i].split(";");
        
        // Se crea un nuevo objeto
        const dict = {};
        
        // Se completa el objeto con los nombres de los campos. Para cada campo se le asigna un valor
        for(let k = 0; k < keys.length; ++k) {
          dict[keys[k]] = values[k];
        }
        
        //Se añade el objeto al array
        array.push(dict);
    }
        
    //Devuelve el array con los objetos
    return array 
}

//Wrapper de Illes Balears
export function xmlToJson(data){
    /*
    Se hace uso de la libreria xml-js para convertir el xml a json. Se le pasan los datos y 
    se le pasan las opciones para formatear el JSON.
    */
    console.log(data);
    const obj = xml2js([data], {compact: true, 
                           spaces: 4, 
                           ignoreComment: true, 
                           ignoreAttributes: true,
                           textFn: removeJsonTextAttribute,
                           trim: true,
                           });
    //Devuelve el JSON generado
    return obj.response.row.row
}

//Opciones extra para convertir el xml a json
function nativeType(value) {
    var nValue = Number(value);
    if (!isNaN(nValue)) {
      return nValue;
    }
    var bValue = value.toLowerCase();
    if (bValue === 'true') {
      return true;
    } else if (bValue === 'false') {
      return false;
    }
    return value;
  }

//Opciones extra para convertir el xml a json
var removeJsonTextAttribute = function(value, parentElement) {
    try {
      var keyNo = Object.keys(parentElement._parent).length;
      var keyName = Object.keys(parentElement._parent)[keyNo - 1];
      parentElement._parent[keyName] = nativeType(value);
    } catch (e) {}
  }
