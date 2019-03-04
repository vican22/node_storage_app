const AWS = require('aws-sdk');
const aws_key = require('./keys/aws');

AWS.config.update({
	accessKeyId: aws_key.accessKeyId,
	secretAccessKey: aws_key.secretAccessKey
});

const s3 = new AWS.S3();

module.exports = { s3 };
