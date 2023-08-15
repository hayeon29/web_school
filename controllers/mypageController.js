import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

import { UserSchema } from '../models/User.js';

import { checkID, checkPassword } from './authController.js';

let connection = mongoose.connection;
const User = connection.model('User', UserSchema);

export async function getMyPage(req, res){
    try {
        const existing_user = await checkID(req.session.user_id);
        if(!existing_user){
            return res.status(400).render('login_web');
        } else {
            switch(req.query.menu){
                case 'editMemberInfo':
                    res.render('mypage_editinfo_web', {
                        user_id: existing_user.id,
                        email: existing_user.email
                    });
                    break;
                case 'withdraw':
                    res.render('mypage_withdraw_web');
                    break;
                default:
                    res.render('mypage_editinfo_web', {
                        user_id: existing_user.id,
                        email: existing_user.email
                    });
                    break;
            }
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json('/');
    }
}

export async function change_info(req, res){
    try {
        const existing_user = await checkID(req.session.user_id);
        if(!existing_user){
            return res.status(400).render('login_web');
        } else {
            console.log(req.body.email_cur, req.body.email_change, req.body.password_cur, req.body.password_change);
            if(req.body.email_cur && req.body.email_change){
                try {
                    User.findOneAndUpdate({id: existing_user.id}, {$set: {email: req.body.email_change}}, function(err, data){
                        return res.json({
                            message: "SUCCESS",
                            redirect_url: "/mypage?menu=editMemberInfo",
                        });
                    });
                } catch (err){
                    console.log("Error occurred while updating user's email:: ", err);
                    return res.json({
                        message: "USER_DB_ERROR",
                        redirect_url: "/mypage?menu=editMemberInfo",
                    });
                }
            } else if(req.body.password_cur && req.body.password_change){
                try {
                    const correct_password = await checkPassword(req.body.password_cur, existing_user.password);
                    console.log(correct_password);
                    if(!correct_password){
                        console.log("Error occurred with incorrect password");
                        return res.json({
                            message: "USER_DB_ERROR",
                            redirect_url: "/mypage?menu=editMemberInfo",
                        });
                    } else {
                        bcryptjs.genSalt(10, (_, salt) => {
                            bcryptjs.hash(req.body.password_change, salt, (err, encrypted_password) => {
                                if(err){
                                    console.log(err);
                                    return res.status(500).json({
                                        message: "SERVER_ERROR",
                                        redirect_url: "/",
                                    });
                                }
                                User.findOneAndUpdate({id: existing_user.id}, {$set: {password: encrypted_password}}, function(err, data){
                                    return res.json({
                                        message: "SUCCESS",
                                        redirect_url: "/mypage?menu=editMemberInfo",
                                    });
                                });
                            })
                        });
                    }
                } catch (err){
                    console.log("Error occurred with incorrect password", err);
                    return res.json({
                        message: "USER_DB_ERROR",
                        redirect_url: "/mypage?menu=editMemberInfo",
                    });
                }
            }
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "SERVER_ERROR",
            redirect_url: "/",
        });
    }
}