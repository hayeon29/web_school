const mongoose = require('mongoose')
const moment = require('moment')

const CalendarSchema = require('../models/Calendar')

var connection = mongoose.createConnection('mongodb://localhost/schoolDB')

const Calendar = connection.model('Calendar', CalendarSchema)

function getFormatDate(date){
    var year = date.getFullYear();
    var month = date.getMonth();
    month = month + 1 >= 10 ? month + 1: '0' + (month + 1 );
    var day = date.getDate();
    day = day >= 10 ? day: '0' + day;
    return year + '-' + month + '-' + day;
}

module.exports = async(req, res)=>{
    var currentMonth = new Date().getMonth()
    var currentYear = new Date().getFullYear()
    var start_day = new Date(currentYear, currentMonth, 1)
    var start_day_format = getFormatDate(start_day)
    var end_day = new Date(currentYear, currentMonth + 1, 0)
    var end_day_format = getFormatDate(end_day)

        console.log("start day = " + start_day_format + ", end day = " + end_day_format)

    const calendars = await Calendar.find({
        date: {
            $gte: start_day_format,
            $lte: end_day_format
        }
    });

    res.render('calendar_web', {
        calendars: calendars,
        moment
    })
}