const express = require('express')
const path = require('path')
const ejs = require('ejs')
const mongoose = require('mongoose')
const autoIncrement = require('mongoose-auto-increment')
const bodyParser = require('body-parser')
const app = express()
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')
const moment = require('moment')

app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

const User = require('./models/User')
const { text } = require('body-parser')

var connection = mongoose.createConnection('mongodb://localhost/schoolDB')

autoIncrement.initialize(connection)

const NoticeSchema = new Schema({
    title: String,
    writer: String,
    date: {
        type: Date,
        default: new Date()
    },
    hits: {
        type: Number,
        default: 0
    },
    content: String
})

NoticeSchema.plugin(autoIncrement.plugin, {
    model: 'Notice',
    field: 'id',
    startAt: 1,
    increment: 1,
})

const AnonyBoardSchema = new Schema({
    title: String,
    writer: String,
    date: {
        type: Date,
        default: new Date()
    },
    hits: {
        type: Number,
        default: 0
    },
    content: String
})

AnonyBoardSchema.plugin(autoIncrement.plugin, 'AnonyBoard')

const Notice = connection.model('Notice', NoticeSchema)
const AnonyBoard = connection.model('AnonyBoard', AnonyBoardSchema)

app.get('/', async(req, res)=>{
    const notices = await Notice.find({});
    const anonyboards = await AnonyBoard.find({});
    res.render('index', {
        notices: notices,
        anonyboards: anonyboards
    });
})

app.get('/introduce', (req, res)=>{
    res.render('introduce_web');
})

app.get('/login', (req, res)=>{
    res.render('login_web');
})

app.get('/qna', (req, res)=>{
    res.render('QnA_web');
})

app.get('/anonyboard/content/:id', (req, res)=>{
    AnonyBoard.findById({_id: req.params.id}, function(err, data){
        if(err){
            return res.json(err)
        }
        var text = data.content.replace(/<br\/>/ig, "\n");
        text = text.replace(/<(\/)?([a-zA-Z]*)(\s[a-zA-Z]*=[^>]*)?(\s)*(\/)?>/ig, "");


        text = text.replace(/(<([^>]+)>)/gi, "");
        text = text.replace(/&nbsp;/gi,"");
        return res.render('anony_content_web.ejs', {
            anonyboard: data,
            content: text,
            moment
        })
    })
})

app.get('/anonyboard/pages/:page', (req, res) => {
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
})

app.get('/notice/pages/:page', (req, res)=>{
    Notice.find({}, function(err, data){
        if(err){
            return res.json(err)
        }
        console.log('page = ' + req.params.page)
        console.log('length = ' + data.length)
        return res.render('notice_web.ejs', {
            page: Number(req.params.page),
            notice: data,
            moment
        })
    })
})

app.get('/notice/content/:id', (req, res)=>{
    Notice.findById({_id: req.params.id}, function(err, data){
        if(err){
            return res.json(err)
        }
        return res.render('notice_content_web.ejs', {
            notice: data,
            moment
        })
    })
})

app.get('/student', (req, res)=>{
    res.render('student_web')
})

app.get('/calendar', (req, res)=>{
    res.render('calendar_web')
})

app.get('/login', (req, res)=>{
    res.render('login_web')
})

app.get('/anonyboard/write', (req, res)=>{
    res.render('anony_writing_board_web')
})

app.get('/notice/write', (req, res)=>{
    res.render('notice_writing_board_web')
})

app.get('/signup', (req, res)=>{
    res.render('signup_web')
})

app.post('/notice/write/post', (req, res) => {
    const notice = new Notice()
    notice.title = req.body.title
    notice.writer = req.body.writer
    notice.content = req.body.content
    notice
        .save()
    res.redirect('/notice')
})

app.post('/anonyboard/write/post', (req, res) => {
    const anonyboard = new AnonyBoard()
    anonyboard.title = req.body.title
    anonyboard.writer = req.body.writer
    anonyboard.content = req.body.content
    console.log(req.body)
    anonyboard
        .save()
    res.redirect('/anonyboard/pages/1')
})

app.post('/signup/result', (req, res) => {
    bcrypt.hash(req.body.password, 10, (err, encryptedPassowrd) => {
		// async callback
		const one = {
			id: req.body.id,
            password: encryptedPassowrd,
			email: req.body.email,
		};
		const newUser = new User(one);
		newUser
			.save()
			.then(() => res.json("Sign Up Successed"))
			.catch((err) => res.status(400).json("Error: " + err))
	})
})

app.listen(4000, function(){
    console.log("App listening on port 4000...")
})
