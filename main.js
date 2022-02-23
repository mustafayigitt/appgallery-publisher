import "dotenv/config"
import express from "express"
import bodyParser from "body-parser";
import morgan from "morgan"
import cors from "cors"

import Publisher from "./Publisher.js";

const app = express()

app.use(morgan("combined"))
app.use(bodyParser.json())
app.use(cors())

app.post("/publish", async (req, res) => {

    const appId = req.query.appId
    const submitNow = req.query.submit

    const clientId = req.body.client_id
    const clientSecret = req.body.client_secret
    const artifactPath = req.body.artifact_path

    const suffix = artifactPath.substring(artifactPath.length - 3, artifactPath.length)

    try {

        const token = await Publisher.getToken(clientId, clientSecret)

        const {uploadUrl, authCode} = await Publisher.getUploadUrl(appId, suffix, clientId, token)

        const artifact = await Publisher.getArtifactFromPath(artifactPath)

        const uploadResult = await Publisher.uploadArtifact(artifact, suffix, uploadUrl, authCode)

        const updateConsoleResult = await Publisher.updateConsole(appId, suffix, clientId, token, uploadResult)

        let publishResult = null
        if (submitNow == "true"){
            console.log("submit now...")
            publishResult = await Publisher.publish(token, clientId, appId)
        }

        res.status(200).json({
            result: publishResult ?? updateConsoleResult
        })
    } catch (err) {
        res.status(500).json({
            err: err.toString()
        })
    }
})

app.listen(process.env.PORT, () => {
    console.log("Live on " + process.env.PORT)
})