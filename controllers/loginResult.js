const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const UserSchema = require('../models/User')

var connection = mongoose.createConnection('mongodb://localhost/schoolDB')

const User = connection.model('User', UserSchema)

module.exports = (req, res) => {
    const {id, password} = req.body
    if(req.session.user){
        console.log("이미 로그인되었습니다.")
    } else {
        User.findOne({id: id}, (err, user) => {
            if(user){
                bcrypt.compare(password, user.password, (err, same) => {
                    if(same){
                        req.session.user = {
                            id: id,
                            password: password
                        }
                        res.redirect('/')
                    } else {
                        res.redirect('/login')
                    }
                }) 
            } else {
                res.redirect('/login')
            }
        })
    }
}