const mongoose = require('mongoose')
const moment = require('moment')

const NoticeSchema = require('../models/Notice')

var connection = mongoose.createConnection('mongodb://localhost/schoolDB')

const Notice = connection.model('Notice', NoticeSchema)

module.exports = (req, res)=>{
    Notice.findById({_id: req.params.id}, function(err, data){
        if(err){
            return res.json(err)
        }
        return res.render('notice_content_web.ejs', {
            notice: data,
            moment
        })
    })
}