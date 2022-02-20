import Publisher from "./Publisher.js";

const args = parseArgs(process.argv.slice(2))

const appId = args["appId"]
const submitNow = args["submit"]

const grantType = args["grantType"]
const clientId = args["clientId"]
const clientSecret = args["clientSecret"]
const artifactPath = args["artifactPath"]

const suffix = artifactPath.substring(artifactPath.length - 3, artifactPath.length)

try {

    const token = await Publisher.getToken(grantType, clientId, clientSecret)

    const {uploadUrl, authCode} = await Publisher.getUploadUrl(appId, suffix, clientId, token)

    const artifact = await Publisher.getArtifactFromPath(artifactPath)

    const uploadResult = await Publisher.uploadArtifact(artifact, suffix, uploadUrl, authCode)

    const updateConsoleResult = await Publisher.updateConsole(appId, suffix, clientId, token, uploadResult)

    let publishResult = null
    if (submitNow == "true") {
        console.log("submit now...")
        publishResult = await Publisher.publish(token, clientId, appId)
    }

    console.log(publishResult ?? updateConsoleResult)

} catch (err) {
    console.log(err.toString())
}

function parseArgs(args) {
    const arr = []
    args.forEach(a => {
        let sp = a.split("=")
        arr[sp[0]] = sp[1]
    })
    return arr
}