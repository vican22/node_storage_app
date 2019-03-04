const aws_functions = require('./cloud_functions/aws');
const google_functions = require('./cloud_functions/google');
const azure_functions = require('./cloud_functions/azure');

const File = require('../models/file');
const User = require('../models/user');

const ITEMS_PER_PAGE = 10;

async function getAllFiles(req, res) {
	const page = req.query.page;

	try {
		const userId = Number(req.params.userId);
		const allFiles = await File.findAll({
			where: { UserId: userId },
			offset: (page - 1) * ITEMS_PER_PAGE,
			limit: ITEMS_PER_PAGE,
			subQuery: false
		});
		res.send(allFiles);
	} catch (err) {
		console.log(err);
		res.send(err.message);
	}
}

async function upload(req, res) {
	try {
		const userId = Number(req.query.userId);
		const cloud = Number(req.query.cloud);
		console.log(userId, cloud);
		const fileName = req.file.originalname;
		const fileSize = Math.round(req.file.size / 1024);

		const userExists = await User.findOne({
			where: { UserId: userId }
		});
		if (!userExists) {
			throw new Error(`User doesn't exists!`);
		}
		const file = await File.findOne({
			where: {
				UserId: userId,
				FileName: fileName
			}
		});

		if (file) {
			throw new Error(`Filename ${file.FileName} already exists!`);
		}

		// CLOUD UPLOAD
		try {
			if (cloud == 1) {
				await aws_functions.upload(userId, fileName, req.file.buffer);
			} else if (cloud == 2) {
				await google_functions.upload(
					userId,
					fileName,
					req.file.buffer,
					req.file.mimetype
				);
			} else if (cloud == 3) {
				await azure_functions.upload(userId, fileName, req.file.buffer);
			}
		} catch (err) {
			throw new Error(err);
		}
		// DATABASE UPLOAD
		try {
			await File.create({
				FileName: fileName,
				FileSize: fileSize,
				UserId: userId,
				Cloud: cloud
			});
		} catch (err) {
			/// delete from cloud
			/// ......

			throw new Error(err);
		}
		res.send('File uploaded');
	} catch (err) {
		console.log(err);
		res.status(400).send(err.message);
	}
}

async function download(req, res) {
	try {
		const userId = req.query.userId;
		const fileName = req.query.fileName;
		const file = await File.findOne({
			where: {
				UserId: userId,
				FileName: fileName
			}
		});
		const cloud = file.toJSON().Cloud;

		// DOWNLOAD FROM CLOUD / CREATE READ STREAM
		let fileStream;
		if (cloud === 'Amazon S3') {
			fileStream = aws_functions.download(userId, fileName);
		} else if (cloud === 'Google Cloud Storage') {
			fileStream = google_functions.download(userId, fileName);
		} else if (cloud === 'Azure Blob Storage') {
			fileStream = azure_functions.download(userId, fileName);
		}
		res.attachment(fileName);
		fileStream.pipe(res);
	} catch (err) {
		console.log(err);
		res.status(400).send(err.message);
	}
}

async function deleteFile(req, res) {
	try {
		const userId = req.query.userId;
		const fileName = req.query.fileName;
		const file = await File.findOne({
			where: {
				UserId: userId,
				FileName: fileName
			}
		});
		const cloud = file.toJSON().Cloud;

		// CLOUD DELETE
		try {
			if (cloud === 'Amazon S3') {
				await aws_functions.deleteFile(userId, fileName);
			} else if (cloud === 'Google Cloud Storage') {
				await google_functions.deleteFile(userId, fileName);
			} else if (cloud === 'Azure Blob Storage') {
				await azure_functions.deleteBlob(userId, fileName);
			}
		} catch (err) {
			throw new Error(err);
		}

		try {
			await File.destroy({
				where: {
					UserId: userId,
					FileName: fileName
				}
			});
		} catch (err) {
			/// add to cloud again ???
			/// ......
			throw new Error(err);
		}
		res.send('File deleted');
	} catch (err) {
		console.log(err);
		res.status(400).send(err.message);
	}
}

module.exports = { getAllFiles, upload, download, deleteFile };
