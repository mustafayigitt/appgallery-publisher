# Parse parameters
for ARGUMENT in "$@"; do
    KEY=$(echo $ARGUMENT | cut -f1 -d=)
    VALUE=$(echo $ARGUMENT | cut -f2 -d=)

    case "$KEY" in
    appId) appId=${VALUE} ;;
    clientId) clientId=${VALUE} ;;
    clientSecret) clientSecret=${VALUE} ;;
    artifactPath) artifactPath=${VALUE} ;;
    *) ;;
    esac
done

suffix=${artifactPath: -3}

# Print parameters
echo $appId
echo $clientId
echo $clientSecret
echo $artifactPath
echo $suffix

if [[ ! $appId ]] || [[ ! $clientId ]] || [[ ! $clientSecret ]] || [[ ! $artifactPath ]] || [[ ! $suffix ]];
  then
  echo "Err: Arguments not valid!"
  exit 1
fi


# Define base urls
tokenUrl='https://connect-api.cloud.huawei.com/api/oauth2/v1/token'
uploadUrl="https://connect-api.cloud.huawei.com/api/publish/v2/upload-url?appId=$appId&suffix=$suffix"
appFileInfoUrl="https://connect-api.cloud.huawei.com/api/publish/v2/app-file-info?appId=$appId"

# -------------------Get Token with credentials -------------------------
echo Authorize to AppGallery Connect...
echo
token=$(curl -s --location --request POST $tokenUrl \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "grant_type":"client_credentials",
    "client_id":"'$clientId'",
    "client_secret":"'$clientSecret'"
}' | python3 -c "import sys, json; print(json.load(sys.stdin)['access_token'])")

if [[ ! $token ]];
  then
  echo "Err: Token not received!"
  exit 1
fi

echo "Token retrieved successfully!"
echo

# -------------------Get Url and AuthCode for upload -------------------------
echo Get upload url and authCode with token...
echo
uploadParams=($(curl -s --location --request GET "$uploadUrl" \
  --header "Authorization: Bearer $token" \
  --header "client_id: $clientId" \
  | python3 -c "import sys, json; data = json.load(sys.stdin); print(data['uploadUrl'],data['authCode'])" | tr -d '[]'))

targetUploadUrl=${uploadParams[0]}
uploadAuthCode=${uploadParams[1]}

if [[ ! $targetUploadUrl ]];
  then
  echo "Err: UploadUrl not received!"
  exit 1
fi

if [[ ! $uploadAuthCode ]];
  then
  echo "Err: UploadAuthCode not received!"
  exit 1
fi

echo "UploadUrl received!"
echo "AuthCode received!"
echo

# ------------------Upload File to server-------------------------
echo Upload artifact to server...
echo
uploadResult=($(curl --location --request POST "$targetUploadUrl" \
  --header 'Content-Type: multipart/form-data' \
  --form "file=$artifactPath" \
  --form "authCode=$uploadAuthCode" \
  --form 'fileCount=1' \
  --form 'parseType=1' \
  | python3 -c "import sys, json; data = json.load(sys.stdin)['result'];rsp = data['UploadFileRsp']; fileInfo = rsp['fileInfoList'][0]; print(fileInfo['fileDestUlr'],fileInfo['size'])" \
  | tr -d '[]'))

fileDestUrl=${uploadResult[0]}
fileSize=${uploadResult[1]}

if [[ ! $fileDestUrl ]];
  then
  echo "Err: FileDestUrl not received!"
  exit 1
fi

if [[ ! $fileSize ]];
  then
  echo "Err: FileSize not received!"
  exit 1
fi
echo "FileDestUrl received!"
echo "FileSize $fileSize"
echo

# -----------------------------------------------------------
echo Update AppGallery Console to latest artifact
echo
updateConsoleResult=($(curl --location --request PUT "$appFileInfoUrl" \
  --header 'Content-Type: application/json' \
  --header "Authorization: Bearer $token" \
  --header "client_id: $clientId" \
  --data-raw '{
    "fileType": 5,
    "files": {
        "fileName": "app-release.'$suffix'",
        "fileDestUrl": "'$fileDestUrl'",
        "size": "'$fileSize'"
    }
}' | python3 -c "import sys, json; ret = json.load(sys.stdin)['ret']['msg']; print(ret)"))

echo "Result: ${updateConsoleResult[*]}"
echo
exit