const azurePass = require("../../config/keys/azure");
const blobService = require("../../config/azure");
const Readable = require("stream").Readable;

exports.upload = (userId, fileName, buffer) => {
  const readStream = bufferToStream(buffer);
  fileName = `${userId}_${fileName}`;
  return blobService.createAppendBlobFromStream(
    azurePass.containerName,
    fileName,
    readStream,
    readStream.readableLength,
    error => {
      if (!error) {
        console.log(`File ${fileName} uploaded successfully`);
      }
    }
  );
};

exports.deleteBlob = (userId, fileName) => {
  const blobName = `${userId}_${fileName}`;
  return blobService.deleteBlobIfExists(
    azurePass.containerName,
    blobName,
    err => {
      if (!err) {
        console.log(`Block blob ${blobName} deleted`);
      }
    }
  );
};

exports.download = (userId, fileName) => {
  fileName = `${userId}_${fileName}`;
  return blobService.createReadStream(
    azurePass.containerName,
    fileName,
    (error, result, response) => {
      if (!error) {
        if (result) {
          console.log(`File ${fileName} downloaded`);
        }
      }
    }
  );
};

function bufferToStream(buffer) {
  var stream = new Readable();
  stream.push(buffer);
  stream.push(null);

  return stream;
}
