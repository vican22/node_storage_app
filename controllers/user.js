const User = require('../models/user');
const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(10);

async function register(req, res) {
	try {
		const username = req.body.username;
		const password = req.body.password;

		const userExists = await User.findOne({
			where: { Username: username }
		});

		if (userExists) {
			throw new Error('User already exists!');
		} else {
			const passwordHash = bcrypt.hashSync(password, salt);
			const user = await User.create({
				Username: username,
				PasswordHash: passwordHash
			});
			res.send({
				UserId: user.UserId,
				Username: user.Username
			});
		}
	} catch (err) {
		console.log(err);
		res.send(err.message);
	}
}

async function login(req, res) {
	try {
		const username = req.body.username;
		const password = req.body.password;

		const userData = await User.findOne({
			where: { Username: username }
		});
		if (!userData) {
			throw new Error('User not found!');
		}
		const user = userData.toJSON();

		const validPassword = bcrypt.compareSync(password, user.PasswordHash);

		if (validPassword) {
			res.send({
				UserId: user.UserId,
				Username: user.Username
			});
		} else {
			throw new Error('Password is incorrect!');
		}
	} catch (err) {
		console.log(err);
		res.send(err.message);
	}
}

module.exports = { register, login };
