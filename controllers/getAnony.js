const mongoose = require('mongoose')
const moment = require('moment')

var connection = mongoose.createConnection('mongodb://localhost/schoolDB')

const AnonyBoardSchema = require('../models/AnonyBoard')
const AnonyBoard = connection.model('AnonyBoard', AnonyBoardSchema)

module.exports = (req, res) => {
    AnonyBoard.find({}, function(err, data){
        if(err){
            return res.json(err)
        }
        return res.render('anony_board_web.ejs', {
            page: Number(req.params.page),
            anonyboard: data,
            moment
        })
    })
}