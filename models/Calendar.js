const mongoose = require('mongoose')
const Schema = mongoose.Schema

module.exports = new Schema({
    date: {
        type: Date,
        default: new Date()
    },
    content: String
})