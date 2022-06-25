const mongoose = require('mongoose')

const UserSchema = require('../models/User')

var connection = mongoose.createConnection('mongodb://localhost/schoolDB')

const User = connection.model('User', UserSchema)

module.exports = (req, res) => {
    let user_id = req.body.id

    let result = new Object()
    result.is_exist = false

    User.findOne({id: user_id}, (err, user) => {
        if(err){
            result.is_exist = true
        } else {
            if(user != null){
                result.is_exist = true
            }
        }
        res.send(JSON.stringify(result))
    })
}