const mongoose = require('mongoose')

const SchoolMealSchema = require('../models/SchoolMeal')

var connection = mongoose.createConnection('mongodb://localhost/schoolDB')

const SchoolMeal = connection.model('SchoolMeal', SchoolMealSchema)

function getFormatDate(date){
    var year = date.getFullYear();
    var month = date.getMonth();
    month = month + 1 >= 10 ? month + 1: '0' + (month + 1 );
    var day = date.getDate();
    day = day >= 10 ? day: '0' + day;
    return year + '-' + month + '-' + day;
}

module.exports = async(req, res)=>{
    var curDay = new Date(req.body.date);
    var cur_day_format = getFormatDate(curDay)

    SchoolMeal.find({
        date: {
            $gte: cur_day_format,
        }
    }, (err, schoolmeals) => {
        let result = new Object()
        result.schoolmeals = schoolmeals
        res.send(JSON.stringify(result))
    })
}