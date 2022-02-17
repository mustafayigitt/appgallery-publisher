import "dotenv/config"
import express from "express"
import bodyParser from "body-parser";
import morgan from "morgan"
import cors from "cors"

const app = express()

app.use(morgan("combined"))
app.use(bodyParser.json())
app.use(cors())

app.listen(process.env.PORT, () => {
    console.log("Live on " + process.env.PORT)
})