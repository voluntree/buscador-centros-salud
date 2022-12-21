import express from "express";
import fs from "fs"
import cors from "cors"

const PORT = process.env.PORT || 3002
const app = express();

app.use(cors())


app.listen(PORT, () => {
    console.log("Server is listening on " + PORT)
})

app.get("/centros/cv", (req, res) => {
    fs.readFile("CV.csv", "utf-8", function (err, data) {
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
        

        res.status(200).json(array)
    })
})