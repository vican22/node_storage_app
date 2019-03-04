const Sequelize = require('sequelize');

const sequelize = require('../config/database');
const File = require('./file');

const User = sequelize.define(
	'User',
	{
		UserId: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false
		},
		Username: {
			type: Sequelize.STRING,
			allowNull: false,
			unique: true
		},
		PasswordHash: {
			type: Sequelize.STRING,
			allowNull: false
		}
	},
	{}
);
User.hasMany(File, { foreignKey: { name: 'UserId', allowNull: false } });

module.exports = User;
