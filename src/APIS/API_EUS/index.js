import express from "express";
import fs from "fs"
import cors from "cors"
import eusData from './EUS.json' assert { type: "json" };

const PORT = process.env.PORT || 3002
const app = express();

app.use(cors())


app.listen(PORT, () => {
    console.log("Server is listening on " + PORT)
})

app.get("/centros/eus", (req, res) => {
    res.header("Content-Type", "application/json")
    res.send(JSON.stringify(eusData, null, 4))
})