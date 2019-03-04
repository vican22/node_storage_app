const Sequelize = require('sequelize');

const sequelize = require('../config/database');

const File = sequelize.define(
	'File',
	{
		FileId: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false
		},
		FileName: {
			type: Sequelize.STRING,
			allowNull: false
		},
		FileSize: {
			type: Sequelize.INTEGER,
			allowNull: false
		},
		Cloud: {
			type: Sequelize.ENUM(
				'Amazon S3',
				'Google Cloud Storage',
				'Azure Blob Storage'
			),
			allowNull: false
		}
	},
	{
		indexes: [
			{
				unique: true,
				fields: ['FileName', 'UserId']
			}
		]
	}
);

module.exports = File;
