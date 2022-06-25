const mongoose = require('mongoose')

const MemberSchema = require('../models/Member')
var connection = mongoose.createConnection('mongodb://localhost/schoolDB')
const Member = connection.model('Member', MemberSchema)


module.exports = async(req, res)=>{
    const members = await Member.find({});
    res.render('student_web', {
        members: members
    })
}