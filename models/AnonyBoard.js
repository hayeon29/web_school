const mongoose = require('mongoose')
const Schema = mongoose.Schema

module.exports = new Schema({
    title: String,
    writer: String,
    date: {
        type: Date,
        default: new Date()
    },
    hits: {
        type: Number,
        default: 0
    },
    content: String
})
