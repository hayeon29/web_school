const mongoose = require('mongoose')

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

function getLastDateOfMonth(date){
    var year = date.getFullYear();
    var month = date.getMonth();
    var date = 1;

    switch(month){
        case 0:
        case 2:
        case 4:
        case 6:
        case 7:
        case 9:
        case 11:
            date = 31;
            break;
        case 3:
        case 5:
        case 8:
        case 10:
            date = 30;
            break;
        case 1:
            if(year % 4 == 0){
                date = 29;
            } else {
                date = 28;
            }
    }
    
    var last_date = getFormatDate(new Date(year, month, date));
    return last_date;
}

module.exports = async(req, res)=>{
    var curMonth = req.body.month
    var curYear = req.body.year
    var start_day = new Date(curYear, curMonth, 1)
    var start_day_format = getFormatDate(start_day)
    var end_day_format = getLastDateOfMonth(start_day)

    Calendar.find({
        date: {
            $gte: start_day_format,
            $lte: end_day_format
        }
    }, (err, calendars) => {
        let result = new Object()
        result.calendars = calendars
        res.send(JSON.stringify(result))
    })
}