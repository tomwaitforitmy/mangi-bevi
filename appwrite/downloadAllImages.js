//call like this:
//node .\downloadAllImages.js
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const sdk = require("node-appwrite");
const fs = require("fs");

const client = new sdk.Client()
  .setEndpoint("https://fra.cloud.appwrite.io/v1")
  .setProject(process.env.EXPO_APPWRITE_PROJECT_ID)
  .setKey(process.env.EXPO_APPWRITE_API_KEY); // Get from Appwrite Console -> Settings -> Overview -> View API keys

const storage = new sdk.Storage(client);
const bucketId = process.env.EXPO_APPWRITE_BUCKET_ID;
const downloadDir = path.join(__dirname, "downloads");
const imageAmount = 5;

(async () => {
  if (!fs.existsSync(downloadDir)) {
    fs.mkdirSync(downloadDir);
  }

  const { files } = await storage.listFiles(bucketId, [
    sdk.Query.limit(imageAmount),
  ]);
  let progressCounter = 1;
  for (const file of files) {
    console.log("Downloading " + progressCounter + " / " + files.length);
    const arrayBuffer = await storage.getFileDownload(bucketId, file.$id);
    //I don't understand why, but eslint gives me an error.
    //Nonetheless the script worked.
    // eslint-disable-next-line no-undef
    const buffer = Buffer.from(arrayBuffer);
    const filePath = path.join(downloadDir, file.name);
    fs.writeFileSync(filePath, buffer);
    progressCounter++;
  }

  console.log("All images downloaded.");
})();
