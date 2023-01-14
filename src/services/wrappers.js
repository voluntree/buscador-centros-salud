import { xml2js, xml2json } from "xml-js"

export function csvToJson(data){
    
    const lines = data.replace(/(?:\\[r]|[\r])+/g, "").split("\n");
        
    const keys = lines[0].split(";");
    
    const array = [];

    for(let i = 1; i < lines.length; i++){
        // split line to get values
        const values = lines[i].split(";");
        
        // create new object
        const dict = {};
        
        // fill object with keys and values
        for(let k = 0; k < keys.length; ++k) {
        dict[keys[k]] = values[k];
        }
        
        // add object to array
        array.push(dict);
    }
        
    return array 
}

export function xmlToJson(data){
    console.log(data);
    const obj = xml2js([data], {compact: true, 
                           spaces: 4, 
                           ignoreComment: true, 
                           ignoreAttributes: true,
                           textFn: removeJsonTextAttribute,
                           trim: true,
                           });
    console.log(obj)                       
    return obj.response.row.row
}

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

var removeJsonTextAttribute = function(value, parentElement) {
    try {
      var keyNo = Object.keys(parentElement._parent).length;
      var keyName = Object.keys(parentElement._parent)[keyNo - 1];
      parentElement._parent[keyName] = nativeType(value);
    } catch (e) {}
  }
