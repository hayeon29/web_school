const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    //_id는 자동으로 생성 
    id: {
        type: String,
        unique: true,
    },
    password: String,
    email: String,
})

const User = mongoose.model('User', UserSchema)
module.exports = User