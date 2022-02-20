# appgallery-publisher
Upload/Publish your bundle (apk or aab) to AppGallery automatically with ***appgallery-publisher***

## Usage
    node standalone.js appId=app_id submit=true grantType=client_credentials clientId=client_id clientSecret=client_secret artifactPath=path
### Params
    {
        "appId": "app_id"
        "submit": "true" (optional),
        "grant_type": "client_credentials",
        "client_id": "client_id",
        "client_secret": "client_secret",
        "artifact_path": "path" (etc: /Users/mustafa.yigit/Desktop/app-release.aab)
    }

## Steps
  1. [getToken(grantType, clientId, clientSecret)](https://github.com/mustafayigitt/appgallery-publisher/blob/6662fc061230c9283babddbb8bc61ca5403533dc/Publisher.js#L5)
  2. [getUploadUrl(appId, suffix, clientId, token)](https://github.com/mustafayigitt/appgallery-publisher/blob/6662fc061230c9283babddbb8bc61ca5403533dc/Publisher.js#L23)
  3. [getArtifactFromPath(path)](https://github.com/mustafayigitt/appgallery-publisher/blob/6662fc061230c9283babddbb8bc61ca5403533dc/Publisher.js#L43)
  4. [uploadArtifact(artifact, suffix, uploadUrl, authCode)](https://github.com/mustafayigitt/appgallery-publisher/blob/6662fc061230c9283babddbb8bc61ca5403533dc/Publisher.js#L54)
  5. [updateConsole(appId, suffix, clientId, token, uploadResult)](https://github.com/mustafayigitt/appgallery-publisher/blob/6662fc061230c9283babddbb8bc61ca5403533dc/Publisher.js#L81)
  6. [publish(token, clientId, appId)](https://github.com/mustafayigitt/appgallery-publisher/blob/6662fc061230c9283babddbb8bc61ca5403533dc/Publisher.js#L108)
  

