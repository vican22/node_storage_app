const azure = require("azure-storage");
const azurePass = require("./keys/azure");

const blobService = azure.createBlobService(
  azurePass.storageAccountName,
  azurePass.accountAccessKey
);

blobService.createContainerIfNotExists(
  azurePass.containerName,
  { publicAccessLevel: "blob" },
  (error, result, response) => {
    if (!error) {
      if (result.created) {
        console.log(`Container ${azurePass.containerName} was created`);
      } else {
        console.log(`Container ${azurePass.containerName} already exists`);
      }
    } else {
      console.log(error);
    }
  }
);

module.exports = blobService;
