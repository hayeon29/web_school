const mongoose = require('mongoose')
const moment = require('moment')

var connection = mongoose.createConnection('mongodb://localhost/schoolDB')

const AnonyBoardSchema = require('../models/AnonyBoard')
const AnonyBoard = connection.model('AnonyBoard', AnonyBoardSchema)

module.exports = (req, res)=>{
    AnonyBoard.findByIdAndUpdate({_id: req.params.id}, { $inc: { hits: 1 } }, function(err, data){
        if(err){
            return res.json(err)
        }
        var text = data.content.replace(/<br\/>/ig, "\n");
        text = text.replace(/<(\/)?([a-zA-Z]*)(\s[a-zA-Z]*=[^>]*)?(\s)*(\/)?>/ig, "");
        text = text.replace(/(<([^>]+)>)/gi, "");
        text = text.replace(/&nbsp;/gi,"");
        
        data.hits += 1
        return res.render('anony_content_web.ejs', {
            anonyboard: data,
            content: text,
            moment
        })
    })
}