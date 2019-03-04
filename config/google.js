const { Storage } = require("@google-cloud/storage");

const storage = new Storage({
  projectId: "File Storage App",
  keyFilename: "./config/keys/google.json"
});

const myBucket = storage.bucket("file-storage-app");

module.exports = { storage, myBucket };
