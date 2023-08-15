import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { UserSchema } from '../models/User.js';
import { TokenSchema } from '../models/Token.js';
import { AnonymousPostSchema } from '../models/AnonymousPost.js';
import { NoticeSchema } from '../models/Notice.js';

import { checkID, checkPassword } from './authController.js';

let connection = mongoose.connection;

const User = connection.model('User', UserSchema);
const Token = connection.model('Token', TokenSchema);
const AnonymousPost = connection.model('AnonymousPost', AnonymousPostSchema);
const Notice = connection.model('Notice', NoticeSchema);

export async function getLoginResult(req, res){
    const {id, password} = req.body;
    
    try {
        const existing_user = await checkID(id);
        if(!existing_user){
            return res.status(400).json({
                message: "User Not Found",
                redirect_url: "/login",
            });
        } 
        else {
            try {
                const correct_password = await checkPassword(password, existing_user.password);
                if(!correct_password){
                    return res.status(400).json({
                        message: "Invalid Password",
                        redirect_url: "/login",
                    });
                } else {
                    const accessToken = jwt.sign({
                        id: existing_user.id,
                        email: existing_user.email
                    }, process.env.ACCESS_TOKEN_SECRET,
                    {
                        expiresIn: '5m'
                    });

                    const refresh_token = jwt.sign({
                        id: existing_user.id,
                        email: existing_user.email
                    }, process.env.REFRESH_TOKEN_SECRET,
                    {
                        expiresIn: '60m'
                    });

                    await Token.findOneAndUpdate({user_id: existing_user.id}, {$set: {token: refresh_token}}, {new: true, upsert: true});

                    res.cookie('user_id', existing_user.id, { maxAge: 60 * 60 * 1000});
                    res.cookie('refresh_token', refresh_token, { maxAge: 60 * 60 * 1000, httpOnly: true });
                    req.session.is_logged_in = true;
                    req.session.user_id = existing_user.id;
                    req.session.save(() => {
                        return res.status(201).json({
                            token: accessToken,
                            redirect_url: "/",
                        });
                    });
                }
            } catch (err) {
                console.log(err);
                return res.status(500).json({
                    message: "something went wrong",
                    redirect_url: "/",
                });
            }
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "something went wrong",
            redirect_url: "/",
        });
    }
}

export async function getSignUpResult(req, res){
    const {id, password, email} = req.body;
    try{
        const existing_user = await checkID(id);
        if(existing_user){
            return res.status(400).json({
                message: "User Already Exists",
                redirect_url: "/login",
            });
        } else {
            bcryptjs.genSalt(10, (_, salt) => {
                bcryptjs.hash(password, salt, (err, encryptedPassowrd) => {
                    if(err){
                        console.log(err);
                        return res.status(500).json({
                            message: "something went wrong",
                            redirect_url: "/",
                        });
                    }

                    const one = {
                        id: id,
                        password: encryptedPassowrd,
                        email: email,
                        auth: "Public"
                    };
        
                    const newUser = new User(one);
                    newUser.save();
                    
                    return res.status(201).json({
                        redirect_url: "/",
                    });
                });
            });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "something went wrong",
            redirect_url: "/",
        });
    }
}

export async function withdrawUser(req, res){
    console.log(req.body);
    try {
        const existing_user = await checkID(req.body.user_id);
        if(!existing_user){
            return res.json({
                message: "USER_NOT_FOUND"
            });
        } else {
            //쿠키 삭제(refresh_token, user_id)
            res.clearCookie('refresh_token');
            res.clearCookie('user_id');
            //세션 삭제
            req.session.destroy();
            //토큰(DB) 삭제
            await Token.findOneAndDelete({id: req.body.user_id}).then(() => {
                console.log("user's refresh token successfully deleted");
            }).catch((err) => {
                console.log("some error occurred and refresh token data didn't be deleted. error name: ", err);
                return res.json({
                    message: "TOKEN_DB_ERROR",
                    result_code: false,
                });
            });
            //글(DB) 삭제
            await AnonymousPost.deleteMany({id: req.body.user_id}).then(() => {
                console.log("user's anonymous post data successfully deleted");
            }).catch((err) => {
                console.log("some error occurred and anonymous post data didn't be deleted. error name: ", err);
                return res.json({
                    message: "ANONYMOUS_DB_ERROR",
                    result_code: false,
                });
            });
            await Notice.deleteMany({id: req.body.user_id}).then(() => {
                console.log("user's notice data successfully deleted");
            }).catch((err) => {
                console.log("some error occurred and notice data didn't be deleted. error name: ", err);
                return res.json({
                    message: "NOTICE_DB_ERROR",
                    result_code: false,
                });
            });
            //유저(DB) 삭제
            await User.findOneAndDelete({id: req.body.user_id}).then(() => {
                console.log("user ", req.body.user_id, "was successfully deleted.");
            }).catch((err) => {
                console.log("some error occurred and user info data didn't be deleted. error name: ", err);
                return res.json({
                    message: "USER_DB_ERROR",
                    result_code: false,
                });
            });
            return res.json({
                redirect_url: "/withdraw/complete",
                result_code: true,
            });
        }
    } catch (err) {
        console.log(err);
        return res.json({
            message: "something went wrong",
            redirect_url: "/",
        });
    }

   
}

export async function withdrawComplete(req, res){
    res.render('withdrawComplete_web');
}

export async function getUserInfoCheck(req, res){
    try {
        const existing_user = await checkID(req.body.user_id);
        if(!existing_user){
            return res.json({
                message: "User Not Found"
            });
        } else {
            try {
                const correct_password = await checkPassword(req.body.password, existing_user.password);
                if(!correct_password){
                    return res.json({
                        message: "Invalid Password"
                    });
                } else {
                    return res.json({
                        message: "Success"
                    });
                }
            } catch (err) {
                console.log(err);
                return res.json({
                    message: "something went wrong",
                    redirect_url: "/",
                });
            }
        }
    } catch (err) {
        console.log(err);
        return res.json({
            message: "something went wrong",
            redirect_url: "/",
        });
    }
}

export async function checkIDExisting (req, res) {
    let result = new Object();
    result.is_exist = false;
    try{
        const user = await checkID(req.body.user_id);
        if(user){
            result.is_exist = true;
        } 
        return res.send(JSON.stringify(result));
    } catch (err) {
        console.log(err);
    }
}

export function login(req, res){
    return res.render('login_web');
}

export function logout(req, res){
    req.session.destroy(() => {
        res.clearCookie('connect.sid');
        res.clearCookie('user_id');
        res.clearCookie('refresh_token');
        res.redirect('/');
    });
}

export function signup(req, res){
    return res.render('signup_web');
}