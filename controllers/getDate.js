import mongoose from 'mongoose';

import { SchoolMealSchema } from '../models/SchoolMeal.js';
import { getFormatDate } from './dateController.js';

let connection = mongoose.connection;

const SchoolMeal = connection.model('SchoolMeal', SchoolMealSchema);

export async function getMealDate(req, res){
    const cur_day = new Date(req.body.date).getTime();

    await SchoolMeal.find({
        date: {
            $eq: cur_day,
        }
    })
    .sort({option: 1})
    .exec((err, data) => {
        if(err) return res.json(err);
        let result = new Object();
        result.school_meal = data;
        result.cur_date_date = getFormatDate(cur_day, 'yyyy년 MM월 dd일');
        result.cur_date_week = getFormatDate(cur_day, 'EE');
        res.send(JSON.stringify(result));
    });
    
}