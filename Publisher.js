import axios from "axios";
import fs from "fs";
import FormData from "form-data";

async function getToken(clientId, clientSecret) {
    try {
        const tokenResult = await axios.post(
            "https://connect-api.cloud.huawei.com/api/oauth2/v1/token",
            {
                grant_type: "client_credentials",
                client_id: clientId,
                client_secret: clientSecret
            })
        console.log(await tokenResult.data);
        return await tokenResult.data["access_token"]
    } catch (err) {
        console.log("GetToken: ", err)
        throw err
    }

}

async function getUploadUrl(appId, suffix, clientId, token) {
    try {
        const uploadUrlResult = await axios.get(
            `https://connect-api.cloud.huawei.com/api/publish/v2/upload-url?appId=${appId}&suffix=${suffix}`,
            {
                headers: {
                    "Authorization": "Bearer " + token,
                    "client_id": clientId
                }
            }
        )
        const {uploadUrl, authCode} = await uploadUrlResult.data
        console.log(uploadUrl, authCode);
        return {uploadUrl: uploadUrl, authCode: authCode}
    } catch (err) {
        console.log("GetUploadUrl: ", err)
        throw err
    }
}

async function getArtifactFromPath(path) {
    try {
        const data = await fs.readFileSync(path)
        console.log("Data read", data.byteLength)
        return data
    } catch (err) {
        console.log("GetArtifactFromPath: ", err)
        throw err
    }
}

async function uploadArtifact(artifact, suffix, uploadUrl, authCode) {
    try {
        const formData = new FormData();
        formData.append('file', artifact, `app-release.${suffix}`);
        formData.append("authCode", authCode)
        formData.append("fileCount", "1")
        formData.append("parseType", "1")

        const uploadResult = await axios.post(
            uploadUrl,
            formData,
            {
                maxContentLength: Infinity,
                maxBodyLength: Infinity,
                headers: {
                    "Content-Type": ("multipart/form-data; boundary=" + formData._boundary)
                }
            }
        )
        const fileInfo = await uploadResult.data.result.UploadFileRsp.fileInfoList[0]
        return fileInfo
    } catch (err) {
        console.log("UploadArtifact: ", err)
        throw err
    }
}

async function updateConsole(appId, suffix, clientId, token, uploadResult) {
    try {
        const result = await axios.put(
            `https://connect-api.cloud.huawei.com/api/publish/v2/app-file-info?appId=${appId}`,
            {
                fileType: 5,
                files: {
                    fileName: `app-release.${suffix}`,
                    fileDestUrl: uploadResult.fileDestUlr,
                    size: uploadResult.size
                }
            },
            {
                headers: {
                    "Authorization": "Bearer " + token,
                    "client_id": clientId
                }
            }
        )
        const version = await result.data.pkgVersion[0]
        return { packageVersion: version }
    } catch (err) {
        console.log("UpdateConsole: ", err)
        throw err
    }
}

async function publish(token, clientId, appId) {
    try {
        const publishResult = await axios.post(
            `https://connect-api.cloud.huawei.com/api/publish/v2/app-submit?appId=${appId}`,
            null,
            {
                headers: {
                    "Authorization": "Bearer " + token,
                    "client_id": clientId
                }
            })
        console.log(await publishResult.data);
        return await publishResult.data.ret.msg
    } catch (err) {
        console.log("Publish: ", err)
        throw err
    }
}

export default {
    getToken,
    getUploadUrl,
    getArtifactFromPath,
    uploadArtifact,
    updateConsole,
    publish
}