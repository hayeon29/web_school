const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const UserSchema = require('../models/User')

var connection = mongoose.createConnection('mongodb://localhost/schoolDB')

const User = connection.model('User', UserSchema)

module.exports = async(req, res) => {
    bcrypt.hash(req.body.password, 10, (err, encryptedPassowrd) => {
		// async callback
		const one = {
			id: req.body.id,
            password: encryptedPassowrd,
			email: req.body.email,
		};
		const newUser = new User(one);
		newUser
			.save()
	})
	res.redirect('/')
}