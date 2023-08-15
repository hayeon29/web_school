import mongoose from 'mongoose';

import { MemberSchema } from '../models/Member.js';

let connection = mongoose.connection;
const Member = connection.model('Member', MemberSchema);

export async function getStudentPage(req, res){
    const members = await Member.find({});
    res.render('student_web', {
        members: members
    });
}
