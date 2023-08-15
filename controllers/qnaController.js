import mongoose from 'mongoose';

import { QnASchema } from '../models/QnA.js';

let connection = mongoose.connection;
const QnA = connection.model('QnA', QnASchema);

export async function getQnAPage(req, res){
    const question_and_answer = await QnA.find({});
    res.render('QnA_web', {
        question_and_answer: question_and_answer,
    });
}