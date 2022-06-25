const mongoose = require('mongoose')
const moment = require('moment')

const NoticeSchema = require('../models/Notice')
const AnonyBoardSchema = require('../models/AnonyBoard')
const CalendarSchema = require('../models/Calendar')
const SchoolMealSchema = require('../models/SchoolMeal')

function getFormatDate(date){
    var year = date.getFullYear();
    var month = date.getMonth();
    month = month + 1 >= 10 ? month + 1: '0' + (month + 1 );
    var day = date.getDate();
    day = day >= 10 ? day: '0' + day;
    return year + '-' + month + '-' + day;
}

var connection = mongoose.createConnection('mongodb://localhost/schoolDB')

const Notice = connection.model('Notice', NoticeSchema)
const AnonyBoard = connection.model('AnonyBoard', AnonyBoardSchema)
const Calendar = connection.model('Calendar', CalendarSchema)
const SchoolMeal = connection.model('SchoolMeal', SchoolMealSchema)

module.exports = async(req, res)=>{
    var currentMonth = new Date().getMonth()
    var currentYear = new Date().getFullYear()
    var start_day = new Date(currentYear, currentMonth, 1)
    var start_day_format = getFormatDate(start_day)
    var end_day = new Date(currentYear, currentMonth + 1, 0)
    var end_day_format = getFormatDate(end_day)
    var cur_day = new Date(currentYear, currentMonth, new Date().getDate())
    var cur_day_format = getFormatDate(cur_day)

    const notices = await Notice.find({});
    const anonyboards = await AnonyBoard.find({});
    const calendars = await Calendar.find({
        date: {
            $gte: start_day_format,
            $lte: end_day_format
        }
    });
    const schoolmeals = await SchoolMeal.find({
        date: {
            $gte: cur_day_format
        }
    });
    
    res.render('index', {
        notices: notices,
        anonyboards: anonyboards,
        calendars: calendars,
        schoolmeals: schoolmeals,
        moment
    });
}