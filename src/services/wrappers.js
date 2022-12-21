import fs from "fs"
const {pathname: root} = new URL('../', import.meta.url)

export function csvToJson(){
    fs.readFileSync(root + "APIS/API_CV/CV.csv", "utf-8", function (err, data) {
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
        
        console.log(JSON.stringify(array));
    })
}
