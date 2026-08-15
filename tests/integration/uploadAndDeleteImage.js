// Integration test for the Appwrite image storage round-trip (upload + delete).
//
// Why this isn't a Jest test: the production path (appwrite/uploadImageToAppwrite.js)
// depends on RN's `Image.getSize`, which jest-expo's own NativeModules mock calls with
// the wrong signature and crashes ("success is not a function") before any app code
// runs. That's a jest-expo/RN incompatibility, not fixable in app code.
//
// Uses the `node-appwrite` server SDK (needs >=27, which dropped the buggy
// node-fetch-native-with-agent transport that threw "invalid onError method"
// against Node's built-in undici fetch) with an API key, same pattern as
// appwrite/downloadAllImages.js. The API key needs the files.write/files.delete
// scopes (Appwrite Console -> Project Settings -> API Keys).
//
// Usage: node tests/integration/uploadAndDeleteImage.js
const path = require("path");
const fs = require("fs");
const sdk = require("node-appwrite");
const { InputFile } = require("node-appwrite/file");

function loadDotEnv(envPath) {
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!(key in process.env)) process.env[key] = value;
  }
}

loadDotEnv(path.resolve(__dirname, "../../.env"));

const projectId = process.env.EXPO_APPWRITE_PROJECT_ID;
const bucketId = process.env.EXPO_APPWRITE_BUCKET_ID;
const apiKey = process.env.EXPO_APPWRITE_API_KEY;

if (!projectId || !bucketId || !apiKey) {
  console.error(
    "Missing EXPO_APPWRITE_PROJECT_ID / EXPO_APPWRITE_BUCKET_ID / EXPO_APPWRITE_API_KEY (checked process.env and .env).",
  );
  process.exit(1);
}

const client = new sdk.Client()
  .setEndpoint("https://fra.cloud.appwrite.io/v1")
  .setProject(projectId)
  .setKey(apiKey);

const storage = new sdk.Storage(client);

const testImagePath = path.resolve(__dirname, "fixtures/test-image.jpg");

(async () => {
  const fileId = sdk.ID.unique();
  let uploaded = false;

  try {
    console.log(`Uploading ${testImagePath} as ${fileId} ...`);
    const bytes = fs.readFileSync(testImagePath);
    const created = await storage.createFile({
      bucketId,
      fileId,
      file: InputFile.fromPath(testImagePath, "integration-test.jpg"),
    });
    uploaded = true;
    if (!created || !created.$id) {
      throw new Error("Upload returned no file ID");
    }
    console.log("Upload OK:", created.$id);

    console.log("Verifying file is retrievable ...");
    const fetched = await storage.getFile(bucketId, fileId);
    if (!fetched || fetched.$id !== fileId) {
      throw new Error("Uploaded file could not be re-fetched by ID");
    }
    console.log("Fetch OK:", fetched.name, fetched.sizeOriginal, "bytes");

    console.log("Downloading the view URL used in production ...");
    const viewUrl = `${client.config.endpoint}/storage/buckets/${bucketId}/files/${fileId}/view?project=${projectId}`;
    const viewResponse = await fetch(viewUrl);
    if (!viewResponse.ok) {
      throw new Error(`View URL returned ${viewResponse.status}`);
    }
    const downloadedBytes = Buffer.from(await viewResponse.arrayBuffer());
    if (downloadedBytes.length !== bytes.length) {
      throw new Error(
        `Downloaded size ${downloadedBytes.length} != uploaded size ${bytes.length}`,
      );
    }
    console.log("View URL OK:", downloadedBytes.length, "bytes match");

    console.log("Deleting file ...");
    await storage.deleteFile(bucketId, fileId);
    uploaded = false;
    console.log("Delete OK");

    console.log("Verifying file is gone ...");
    try {
      await storage.getFile(bucketId, fileId);
      throw new Error("File still exists after delete");
    } catch (error) {
      if (error.code !== 404) throw error;
      console.log("Confirmed 404 after delete");
    }

    console.log("\nPASS: upload + delete round-trip succeeded.");
    process.exit(0);
  } catch (error) {
    console.error("\nFAIL:", error.message || error);
    if (uploaded) {
      console.error(`Cleaning up leftover file ${fileId} ...`);
      await storage.deleteFile(bucketId, fileId).catch(() => {});
    }
    process.exit(1);
  }
})();
