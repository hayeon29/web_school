import mongoose from "mongoose";

import { CalendarSchema } from "../models/Calendar.js";

let connection = mongoose.connection;
const Calendar = connection.model('Calendar', CalendarSchema);

export async function getCalendarData(req, res){
    const is_on_load = typeof req.body.month === 'undefined' || typeof req.body.year === 'undefined' ? true : false;
    const cur_month = typeof req.body.month === 'undefined' ? new Date().getMonth() : req.body.month;
    const cur_year = typeof req.body.year === 'undefined' ? new Date().getFullYear() : req.body.year;
    let start_day = new Date(cur_year, cur_month, 1);
    start_day.setHours(start_day.getHours() + 9);
    let end_day = new Date(cur_year, cur_month + 1, 0);
    end_day.setHours(end_day.getHours() + 9);

    Calendar.find({
        date: {
            $gte: start_day,
            $lte: end_day
        }
    })
    .sort([['date', 1]])
    .exec((err, data) => {
        if(err){
            return res.json(err);
        }
        if (is_on_load){
            res.render('calendar_web.ejs', {
                calendars: data,
                cur_year: cur_year,
                cur_month: cur_month,
            });
        } else {
            let result = new Object();
            result.calendars = data;
            result.month = cur_month;
            res.send(JSON.stringify(result));
        }
    });
}