# appgallery-publisher
Upload/Publish your bundle (apk or aab) to AppGallery automatically with ***appgallery-publisher***

## Usage
* [Single Javascript File](https://github.com/mustafayigitt/appgallery-publisher/tree/javascript)
* [Bash File](https://github.com/mustafayigitt/appgallery-publisher/tree/bash)
* Node App (Here)

### Query Params
    - appId (required, string)
    - submit (optional, boolean)

### Body
    {
        "client_id": "client_id",
        "client_secret": "client_secret",
        "artifact_path": "path" (etc: /Users/mustafa.yigit/Desktop/app-release.aab)
    }

### Request
    POST -> http://localhost:3000/publish?appId=105596257&submit=true

### Response
#### * upload only
    "result": {
        "packageVersion": "98591645147584"
    }
    
#### * upload & publish
    "result": "success"

## Steps
  1. [getToken(clientId, clientSecret)](https://github.com/mustafayigitt/appgallery-publisher/blob/6662fc061230c9283babddbb8bc61ca5403533dc/Publisher.js#L5)
  2. [getUploadUrl(appId, suffix, clientId, token)](https://github.com/mustafayigitt/appgallery-publisher/blob/6662fc061230c9283babddbb8bc61ca5403533dc/Publisher.js#L23)
  3. [getArtifactFromPath(path)](https://github.com/mustafayigitt/appgallery-publisher/blob/6662fc061230c9283babddbb8bc61ca5403533dc/Publisher.js#L43)
  4. [uploadArtifact(artifact, suffix, uploadUrl, authCode)](https://github.com/mustafayigitt/appgallery-publisher/blob/6662fc061230c9283babddbb8bc61ca5403533dc/Publisher.js#L54)
  5. [updateConsole(appId, suffix, clientId, token, uploadResult)](https://github.com/mustafayigitt/appgallery-publisher/blob/6662fc061230c9283babddbb8bc61ca5403533dc/Publisher.js#L81)
  6. [publish(token, clientId, appId)](https://github.com/mustafayigitt/appgallery-publisher/blob/6662fc061230c9283babddbb8bc61ca5403533dc/Publisher.js#L108)
  

