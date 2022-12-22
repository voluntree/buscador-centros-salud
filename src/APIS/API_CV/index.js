import express from "express";
import fs from "fs"
import cors from "cors"
import { csvToJson } from "../../services/wrappers.js";

const PORT = process.env.PORT || 3001
const app = express();

app.use(cors())


app.listen(PORT, () => {
    console.log("Server is listening on " + PORT)
})

app.get("/centros/cv", (req, res) => {
    fs.readFile("CV.csv", "utf-8", function (err, data) {
        
        const array = csvToJson(data)
        
        res.header("Content-Type", "application/json")
        res.send(JSON.stringify(array, null, 4))
    })
})