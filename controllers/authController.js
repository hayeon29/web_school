import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';

import { TokenSchema } from '../models/Token.js';
import { UserSchema } from '../models/User.js';

let connection = mongoose.connection;

const Token = connection.model('Token', TokenSchema);
const User = connection.model('User', UserSchema);

function checkAccessToken(access_token){
    try{
        return jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET);
    } catch (err){
        console.log("checkAccessToken() access_token:: ", access_token);
        console.log("checkAccessToken():: ", err.name);
        if(err.name === "JsonWebTokenError") return undefined;
        if(err.name === "TokenExpiredError") return null;
        return null;
    }
}

async function checkRefreshToken(refresh_token){
    const refresh_token_db = await Token.findOne({token: refresh_token});
    console.log("checkRefreshToken:: refresh_token_db ", refresh_token_db);
    try {
        const decoded = await jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET);
        if(refresh_token_db !== null && refresh_token_db.token == refresh_token) return decoded;
    } catch (err) {
        console.log("checkRefreshToken:: error name: ", err);
        if(err.name === "JsonWebTokenError") return undefined;
        if(err.name === "TokenExpiredError") return null;
    }
}

export async function checkID(id){
    return User.findOne({id: id});
}

export async function checkPassword(password, user_password){
    return bcryptjs.compare(password, user_password);
}

export async function checkPasswordCorrect(req, res){
    const {id, password} = req.body;
    
    try {
        const existing_user = await checkID(id);
        if(!existing_user){
            return res.json({
                message: "User Not Found",
                is_exist: false,
                redirect_url: "/login",
            });
        } 
        else {
            try {
                const correct_password = await checkPassword(password, existing_user.password);
                if(!correct_password){
                    return res.json({
                        message: "Invalid Password",
                        is_exist: false,
                    });
                } else {
                    return res.json({
                        message: "Success",
                        is_exist: true,
                    });
                }
            } catch (err) {
                console.log(err);
                return res.status(500).json({
                    message: "something went wrong",
                    is_exist: false,
                    redirect_url: "/",
                });
            }
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "something went wrong",
            is_exist: false,
            redirect_url: "/",
        });
    }
}

export async function auth(req, res, next) {
    const auth_header = req.get('Authorization');

    if(typeof auth_header !== 'undefined'){
        const auth = auth_header.split(' ');
        const auth_token = auth[1]; 

        const access_token = checkAccessToken(auth_token);
        const refresh_token = await checkRefreshToken(req.cookies.refresh_token);

        if(access_token === null){ // access token expired
            if(refresh_token === null){ // refresh token expired
                console.log("auth():: access token and refresh token both expired");
                await Token.deleteOne({id: req.cookies.user_id}); // DB에서 토큰 삭제
                res.clearCookie('user_id'); 
                res.clearCookie('refresh_token'); //쿠키 삭제
                req.session.is_logged_in = false;
                req.session.save();
                req.status = 403;
                next();
            } else if(refresh_token === undefined){ // refresh token invalid 
                console.log("auth():: refresh token is not invalid");
                res.clearCookie('refresh_token'); //쿠키 삭제
                req.session.is_logged_in = false;
                req.session.save();
                req.status = 401;
                next();
            } else { //refresh token valid
                console.log("auth():: access token expired but refresh token valid");
                const user = await User.findOne({id: req.cookies.user_id});
                const new_access_token = jwt.sign({
                    id: user.id,
                    email: user.email,
                }, process.env.ACCESS_TOKEN_SECRET,
                {
                    expiresIn: '5m'
                });
                req.status = 201;
                req.access_token = new_access_token;
                next();
            }
        } else if (access_token === undefined){ // access token invalid
            console.log("auth():: access token is not invalid");
            req.session.is_logged_in = false;
            req.session.save();
            req.status = 401;
            next();
        } else { // access token valid 
            if(refresh_token === null){ // refresh token expired
                console.log("auth():: access token valid but refresh token expired");
                const user = await User.findOne({id: req.cookies.user_id});
                const new_refresh_token = jwt.sign({
                    id: user.id,
                    email: user.email,
                }, process.env.REFRESH_TOKEN_SECRET,
                {
                    expiresIn: '60m'
                });
                req.status = 201;
                req.user_id = user.id;
                req.refresh_token = new_refresh_token;
                next();
            } else if(refresh_token === undefined){ // refresh token invalid 
                console.log("auth():: access token valid but refresh token is not invalid");
                req.session.is_logged_in = false;
                req.session.save();
                req.status = 401;
                next();
            } else { //refresh token valid
                console.log("auth():: both tokens are valid");
                req.status = 201;
                next();
            }
        }
    } else {
        console.log("auth():: access token undefined");
        req.session.is_logged_in = false;
        req.session.save();
        req.status = 401;
        next();
    }
}

export function clickAuthResult(req, res){
    let method_type = "write";

    if(req.status == 401){
        return res.status(req.status).json({
            message: "Invalid access",
            redirect_url: "/login"
        })
    } else if(req.status == 403){
        return res.status(req.status).json({
            message: "Timeout",
            redirect_url: "/login"
        })
    } else if(req.status == 201){
        if(req.access_token){
            console.log("access token");
            return res.status(req.status).json({
                message: "New Access Token",
                token: req.access_token,
                method: method_type,
            });
        } 
        
        if(req.refresh_token){
            console.log("refresh token");
            res.cookie('user_id', req.user_id);
            res.cookie('refresh_token', req.refresh_token, { maxAge: 60 * 60 * 1000, httpOnly: true });
            return res.status(req.status).json({
                message: "New Refresh Token",
                method: method_type,
            });
        }

        console.log("Access succeed");
        return res.status(req.status).json({
            message: "Success",
            method: method_type,
        });
    }
}
