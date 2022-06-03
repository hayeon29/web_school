const mongoose = require('mongoose')
const Schema = mongoose.Schema

const QnASchema = new Schema({
    //_id는 자동으로 생성 
    title: String,
    content: String
})

const Notice = mongoose.model('Notice', NoticeSchema)
module.exports = Notice