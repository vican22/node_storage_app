const bucket = require('../../config/google').myBucket;

const upload = (userId, fileName, buffer, type) => {
	const file = bucket.file(`${userId}_${fileName}`);
	return file
		.exists()
		.then(data => {
			const exists = data[0];
			if (exists) {
				throw new Error('File already exists');
			} else {
				return new Promise((resolve, reject) => {
					file.createWriteStream({
						metadata: {
							contentType: type
						}
					})
						.on('error', () =>
							reject('Error uploading to Google Cloud Storage')
						)
						.on('finish', () =>
							resolve('File uploaded to Google Cloud Storage')
						)
						.end(buffer);
				});
			}
		})
		.catch(err => {
			throw err;
		});
};

const download = (userId, fileName) => {
	const file = bucket.file(`${userId}_${fileName}`);
	return file.createReadStream();
};

const deleteFile = (userId, fileName) => {
	const file = bucket.file(`${userId}_${fileName}`);
	return new Promise((resolve, reject) => {
		file.delete(function(err, apiResponse) {
			if (err) reject('Error deleting file from Google Cloud Storage');
			resolve('File deleted from Google Cloud Storage!');
		});
	});
};

module.exports = { upload, download, deleteFile };
