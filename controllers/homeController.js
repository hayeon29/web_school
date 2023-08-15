import mongoose from 'mongoose';
import { connect } from './dbController.js';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale/index.js';

import { NoticeSchema } from '../models/Notice.js';
import { AnonymousPostSchema } from '../models/AnonymousPost.js';
import { CalendarSchema } from '../models/Calendar.js';
import { SchoolMealSchema } from '../models/SchoolMeal.js';
import { getFormatDate, convertDateToFormat } from './dateController.js';

connect();

let connection = mongoose.connection;

const Notice = connection.model('Notice', NoticeSchema);
const AnonymousPost = connection.model('AnonymousPost', AnonymousPostSchema);
const Calendar = connection.model('Calendar', CalendarSchema);
const SchoolMeal = connection.model('SchoolMeal', SchoolMealSchema);

export async function getHomePage(req, res) {
    const cur_month = new Date().getMonth();
    const cur_year = new Date().getFullYear();
    const cur_date = getFormatDate(new Date(), 'yyyy-MM-dd');
    const school_meal_date = getFormatDate(new Date(), 'yyyy년 MM월 dd일');
    const school_meal_day_week = getFormatDate(new Date(), 'EE');
    let start_day = new Date(cur_year, cur_month, 1);
    start_day.setHours(start_day.getHours() + 9);
    let end_day = new Date(cur_year, cur_month + 1, 0);
    end_day.setHours(end_day.getHours() + 9);

    let notices = await Notice.find({}).sort({date: -1}).limit(7);
    notices = convertDateToFormat(notices, 'yyyy-MM-dd');
    const anonymous_post = await AnonymousPost.find({}).sort({date: -1}).limit(7);
    let calendars = await Calendar.find({
        date : {
            $gte: start_day,
            $lte: end_day
        }
    });
    calendars = convertDateToFormat(calendars, 'yyyy-MM-dd');

    let school_meal = await SchoolMeal.find({
        date: { $eq: new Date().getTime() },
    })
    .sort({option: 1});

    return res.render('index', {
        notices: notices,
        anonymous_post: anonymous_post,
        calendars: calendars,
        school_meal: school_meal,
        cur_date: cur_date,
        school_meal_date: school_meal_date,
        school_meal_day_week: school_meal_day_week,
    });
}