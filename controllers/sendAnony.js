const mongoose = require('mongoose')

var connection = mongoose.createConnection('mongodb://localhost/schoolDB')

const AnonyBoardSchema = require('../models/AnonyBoard')
const AnonyBoard = connection.model('AnonyBoard', AnonyBoardSchema)

module.exports = (req, res) => {
    const anonyboard = new AnonyBoard()
    anonyboard.title = req.body.title
    anonyboard.writer = req.body.writer
    anonyboard.content = req.body.content
    console.log(req.body)
    anonyboard
        .save()
    res.redirect('/anonyboard/pages/1')
}