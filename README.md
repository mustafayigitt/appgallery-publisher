# appgallery-publisher
Upload/Publish your bundle (apk or aab) to AppGallery automatically with ***appgallery-publisher***

## Dependencies
* node
* axios
* form-data

## Usage
    node standalone.js appId=app_id clientId=client_id clientSecret=client_secret artifactPath=path submit=true
### Params
    {
        "appId": "app_id"
        "client_id": "client_id",
        "client_secret": "client_secret",
        "artifact_path": "path" (etc: /Users/mustafa.yigit/Desktop/app-release.aab)
        "submit": "true" (optional)
    }

## Steps
  1. [getToken(clientId, clientSecret)](https://github.com/mustafayigitt/appgallery-publisher/blob/6662fc061230c9283babddbb8bc61ca5403533dc/Publisher.js#L5)
  2. [getUploadUrl(appId, suffix, clientId, token)](https://github.com/mustafayigitt/appgallery-publisher/blob/6662fc061230c9283babddbb8bc61ca5403533dc/Publisher.js#L23)
  3. [getArtifactFromPath(path)](https://github.com/mustafayigitt/appgallery-publisher/blob/6662fc061230c9283babddbb8bc61ca5403533dc/Publisher.js#L43)
  4. [uploadArtifact(artifact, suffix, uploadUrl, authCode)](https://github.com/mustafayigitt/appgallery-publisher/blob/6662fc061230c9283babddbb8bc61ca5403533dc/Publisher.js#L54)
  5. [updateConsole(appId, suffix, clientId, token, uploadResult)](https://github.com/mustafayigitt/appgallery-publisher/blob/6662fc061230c9283babddbb8bc61ca5403533dc/Publisher.js#L81)
  6. [publish(token, clientId, appId)](https://github.com/mustafayigitt/appgallery-publisher/blob/6662fc061230c9283babddbb8bc61ca5403533dc/Publisher.js#L108)
  

