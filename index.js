const express = require('express')
const mongoose = require('mongoose')
const autoIncrement = require('mongoose-auto-increment')
const bodyParser = require('body-parser')
const app = express()
const cors = require('cors')
const express_session = require('express-session')

const homeController = require('./controllers/home')
const introduceController = require('./controllers/introduce')
const loginController = require('./controllers/login')
const qnaController = require('./controllers/qna')
const getAnonyContentController = require('./controllers/getAnonyContent')
const getAnonyController = require('./controllers/getAnony')
const getNoticeContorller = require('./controllers/getNotice')
const getNoticeContentController = require('./controllers/getNoticeContent')
const studentController = require('./controllers/student')
const calendarController = require('./controllers/calendar')
const logoutController = require('./controllers/logout')
const writeAnonyController = require('./controllers/writeAnony')
const writeNoticeController = require('./controllers/writeNotice')
const signupController = require('./controllers/signup')
const getDateController = require('./controllers/getDate')
const getMealDateController = require('./controllers/getMealDate')
const sendNoticeController = require('./controllers/sendNotice')
const sendAnonyController = require('./controllers/sendAnony')
const loginResultController = require('./controllers/loginResult')
const signupResultController = require('./controllers/signupResult')
const checkIDController = require('./controllers/checkID')

const corsOptions = {
    origin: 'http://localhost:4000/',
}

global.is_login = null

app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(cors(corsOptions))
app.use(express_session({
    secret: 'hanasaki web project'
}))
app.use("*", (req, res, next) => {
    is_login = req.session.user
    next()
})


const NoticeSchema = require('./models/Notice')
const AnonyBoardSchema = require('./models/AnonyBoard')

var connection = mongoose.createConnection('mongodb://localhost/schoolDB')

autoIncrement.initialize(connection)

NoticeSchema.plugin(autoIncrement.plugin, {
    model: 'Notice',
    field: 'id',
    startAt: 1,
    increment: 1,
}) 

AnonyBoardSchema.plugin(autoIncrement.plugin, {
    model: 'AnonyBoard',
    field: 'id',
    startAt: 1,
    increment: 1,
})

app.get('/', homeController)

app.get('/introduce', introduceController)

app.get('/login', loginController)

app.get('/qna', qnaController)

app.get('/anonyboard/content/:id', getAnonyContentController)

app.get('/anonyboard/pages/:page', getAnonyController)

app.get('/notice/pages/:page', getNoticeContorller)

app.get('/notice/content/:id', getNoticeContentController)

app.get('/student', studentController)

app.get('/calendar', calendarController)

app.get('/logout', logoutController)

app.get('/anonyboard/write', writeAnonyController)

app.get('/notice/write', writeNoticeController)

app.get('/signup', signupController)

app.post('/get-date', getDateController)

app.post('/get-meal-date', getMealDateController)

app.post('/notice/write/post', sendNoticeController)

app.post('/anonyboard/write/post', sendAnonyController)

app.post('/login/result', loginResultController)

app.post('/signup/result', signupResultController)

app.post('/check-id', checkIDController)

app.listen(4000, function(){
    console.log("App listening on port 4000...")
})
