const bucket = require('../../config/keys/aws').bucketName;
const { s3 } = require('../../config/aws');

const upload = (userId, fileName, buffer) => {
	console.log(buffer);
	const key = `${userId}_${fileName}`;
	const params = {
		Bucket: bucket,
		Body: buffer,
		Key: key
	};
	return s3
		.upload(params)
		.promise()
		.then(
			data => data,
			err => {
				throw err;
			}
		);
};

const download = (userId, fileName) => {
	const key = `${userId}_${fileName}`;
	const params = {
		Bucket: bucket,
		Key: key
	};
	return s3.getObject(params).createReadStream();
};

const deleteFile = (userId, fileName) => {
	const key = `${userId}_${fileName}`;
	const params = {
		Bucket: bucket,
		Key: key
	};
	return s3
		.deleteObject(params)
		.promise()
		.then(
			data => data,
			err => {
				throw err;
			}
		);
};

module.exports = { upload, download, deleteFile };
