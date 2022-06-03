const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CalendarSchema = new Schema({
    date: {
        type: Date,
        default: new Date()
    },
    content: String
})

const Calendar = mongoose.model('Calendar', CalendarSchema)
module.exports = Calendar