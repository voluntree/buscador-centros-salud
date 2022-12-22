import express from "express";
import fs from "fs"
import cors from "cors"
import { xmlToJson } from "../../services/wrappers.js";

const PORT = process.env.PORT || 3003
const app = express();

app.use(cors())


app.listen(PORT, () => {
    console.log("Server is listening on " + PORT)
})

app.get("/centros/ib", (req, res) => {
    fs.readFile("IB.xml", "utf-8", function (err, data) {
        var array = xmlToJson(data)
        
        res.header("Content-Type", "application/json")
        res.send(JSON.stringify(array, null, 4))
    })
})