const mongoose = require('mongoose')
const Schema = mongoose.Schema

module.exports = new Schema({
    name: String,
    position: String,
    image: String
})