const mongoose = require('mongoose')
const moment = require('moment')

const NoticeSchema = require('../models/Notice')

var connection = mongoose.createConnection('mongodb://localhost/schoolDB')

const Notice = connection.model('Notice', NoticeSchema)

module.exports = (req, res)=>{
    Notice.find({}, function(err, data){
        if(err){
            return res.json(err)
        }
        return res.render('notice_web.ejs', {
            page: Number(req.params.page),
            notice: data,
            moment
        })
    })
}