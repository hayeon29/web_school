import mongoose from 'mongoose';

import { AnonymousPostSchema } from '../models/AnonymousPost.js';
import { NoticeSchema } from '../models/Notice.js';
import { convertDateToFormat, convertSingleDateToFormat } from './dateController.js';

let connection = mongoose.connection;

const AnonymousPost = connection.model('AnonymousPost', AnonymousPostSchema);
const Notice = connection.model('Notice', NoticeSchema);

export async function getBoardPage(req, res){
    const content_type = req.originalUrl.split(/[\/|?]/)[1];
    switch(content_type){
        case 'anonymous-post':
            let anonymous_post = await AnonymousPost.find({});
            anonymous_post = convertDateToFormat(anonymous_post, 'yyyy-MM-dd');
            return res.render('anonymous_board_web.ejs', {
                page: Number(req.query.page),
                anonymous_post: anonymous_post,
            });
        case 'notice':
            let notice = await Notice.find({});
            notice = convertDateToFormat(notice, 'yyyy-MM-dd');
            return res.render('notice_web.ejs', {
                page: Number(req.query.page),
                notice: notice
            });
    }
}

export async function getBoardContent(req, res){
    const content_type = req.originalUrl.split('/')[1];
    switch(content_type){
        case 'anonymous-post':
            AnonymousPost.findOneAndUpdate({_id: req.query.id}, { $inc: { hits: 1 } }, function(err, data){ //익명 게시판 글 가져와서 조회수 1씩 증가
                if(err){
                    return res.json(err);
                }
                data = convertSingleDateToFormat(data, 'yyyy-MM-dd');
                return res.render('anonymous_content_web.ejs', {
                    user_id: req.cookies.user_id,
                    anonymous_post: data,
                });
            });
            break;
        case 'notice':
            Notice.findOneAndUpdate({_id: req.query.id}, { $inc: { hits: 1 } }, function(err, data){
                if(err){
                    return res.json(err);
                }
                data = convertSingleDateToFormat(data, 'yyyy-MM-dd');
                return res.render('notice_content_web.ejs', {
                    user_id: req.cookies.user_id,
                    notice: data,
                });
            });
            break;
    }   
}

export async function sendContent(req, res){
    const content_type = req.originalUrl.split('/')[1];
    let result = null;
    if(req.body.content.slice(-1) == "\n"){
        req.body.content = req.body.content.slice(0, -1);
    }
    switch(content_type){
        case 'anonymous-post':
            result = AnonymousPost.findOne({_id: req.query.id}, async (err, result) => {
                console.log(result);
                if(result == null){
                    console.log("sendContent()::", "new Content");
                    const anonymous_post = new AnonymousPost();
                    anonymous_post.title = req.body.title;
                    anonymous_post.writer = req.body.writer;
                    anonymous_post.writerID = req.cookies.user_id;
                    anonymous_post.content = req.body.content;
                    anonymous_post.save();
                } else {
                    console.log("sendContent()::", "update Content");
                    result.title = req.body.title;
                    result.writer = req.body.writer;
                    result.content = req.body.content;
                }
                return res.json({
                    redirect_url: '/anonymous-post?page=1',
                });
            });
            break;
        case 'notice':
            result = Notice.findOne({_id: req.query.id}, async (err, result) => {
                if(result == null){
                    console.log("sendContent()::", "new Content");
                    const notice = new Notice();
                    console.log("sendContent()::", notice._id);
                    notice.title = req.body.title;
                    notice.writer = req.body.writer;
                    notice.writerID = req.cookies.user_id;
                    notice.content = req.body.content;
                    console.log("sendContent()::", result, notice);
                    notice.save();
                } else {
                    console.log("sendContent()::", "update Content");
                    result.title = req.body.title;
                    result.writer = req.body.writer;
                    result.content = req.body.content;
                }
                return res.json({
                    redirect_url: '/notice?page=1',
                });
            });
            break;
    }
}

export function writeContent(req, res){
    const content_type = req.originalUrl.split('/')[1];
    switch(content_type){
        case 'anonymous-post':
            return res.render('anonymous_writing_board_web', {
                writeType: "anonymous_post",
                content: "",
            });
        case 'notice':
            return res.render('notice_writing_board_web', {
                user_id: req.cookies.user_id,
                writeType: "notice",
                content: "",
            });
    }
}

export function updateContent(req, res){
    const reqUrl = req.originalUrl.split('/');
    const content_type = reqUrl[1];
    const content_id = req.query.id;

    switch(content_type){
        case 'anonymous-post':
            AnonymousPost.findById(content_id, (err, result) => {
                if(err){
                    console.log(err);
                } else {
                    return res.render('anonymous_writing_board_web', {
                        writeType: "anonymous-post",
                        user_id: req.cookies.user_id,
                        content: result,
                    });
                }
            });
            break;
        case 'notice':
            Notice.findById(content_id, (err, result) => {
                if(err){
                    console.log(err);
                } else {
                    return res.render('notice_writing_board_web', {
                        writeType: "notice",
                        user_id: req.cookies.user_id,
                        content: result,
                    });
                }
            });
            break;
    }
}

export function deleteContent(req, res){
    const reqUrl = req.originalUrl.split('/');
    console.log(reqUrl);
    const content_type = reqUrl[1];
    const content_id = req.query.id;
    switch(content_type){
        case 'anonymous-post':
            AnonymousPost.findByIdAndDelete(content_id, (err, result) => {
                if(err){
                    console.log(err);
                } else {
                    return res.redirect('/anonymous-post?page=1');
                }
            });
            break;
        case 'notice':
            Notice.findByIdAndDelete(content_id, (err, result) => {
                if(err){
                    console.log(err);
                } else {
                    return res.redirect('/notice?page=1');
                }
            });
            break;
    }
}