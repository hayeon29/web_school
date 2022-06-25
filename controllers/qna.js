const mongoose = require('mongoose')

const QnASchema = require('../models/QnA')
var connection = mongoose.createConnection('mongodb://localhost/schoolDB')
const QnA = connection.model('QnA', QnASchema)

module.exports = async(req, res)=>{
    const qnas = await QnA.find({});
    res.render('QnA_web', {
        qnas: qnas
    });
}