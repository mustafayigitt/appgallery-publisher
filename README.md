# appgallery-publisher
Upload/Publish your bundle (apk or aab) to AppGallery automatically with ***appgallery-publisher***

## Dependencies
* Python3 (deserialize json)

## Usage

    ./publisher.sh appId=YOUR_APP_ID clientId=YOUR_CLIENT_ID clientSecret=YOUR_CLIENT_SECRET artifactPath=YOUR_BUNDLE_PATH

    # Response
    "Result: success"

### Params
    - appId (required)
    - clientId (required)
    - clientSecret (required)
    - artifactPath (required)