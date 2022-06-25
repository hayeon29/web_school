const mongoose = require('mongoose')

const NoticeSchema = require('../models/Notice')

var connection = mongoose.createConnection('mongodb://localhost/schoolDB')

const Notice = connection.model('Notice', NoticeSchema)

module.exports = (req, res) => {
    const notice = new Notice()
    notice.title = req.body.title
    notice.writer = req.body.writer
    notice.content = req.body.content
    notice
        .save()
    res.redirect('/notice')
}