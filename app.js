import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import express_session from "express-session";
import path from "path";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

const app = express();

import { getHomePage } from "./controllers/homeController.js";
import {
  getBoardPage,
  getBoardContent,
  sendContent,
  writeContent,
  updateContent,
  deleteContent,
} from "./controllers/contentController.js";
import { getIntroPage } from "./controllers/introduceController.js";
import { getQnAPage } from "./controllers/qnaController.js";
import { getWayPage } from "./controllers/wayController.js";
import { getMealPage } from "./controllers/mealController.js";
import { getStudentPage } from "./controllers/studentController.js";
import {
  getLoginResult,
  getSignUpResult,
  checkIDExisting,
  getUserInfoCheck,
  login,
  logout,
  signup,
  withdrawUser,
  withdrawComplete,
} from "./controllers/userController.js";
import {
  auth,
  clickAuthResult,
  checkPasswordCorrect,
} from "./controllers/authController.js";
import { getCalendarData } from "./controllers/calendarController.js";
import { getMealDate } from "./controllers/getDate.js";
import { getMyPage, change_info } from "./controllers/mypageController.js";
import { logger } from "./controllers/logger.js";

const corsOptions = {
  origin: "http://localhost:4000/",
};

dotenv.config();

const __dirname = path.resolve();

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(logger());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(
  express_session({
    secret: "board web site",
    resave: false, //resave: session에 변화가 없어도 저장
    saveUninitialized: true, //uninitialized 상태의 session을 강제로 저장하느냐 여부
    cookie: {
      maxAge: 30 * 60 * 1000,
    },
  })
);

let port = process.env.PORT;

app.use((req, res, next) => {
  if (
    typeof req.session.is_logged_in === "undefined" ||
    typeof req.session.is_logged_in === "null"
  ) {
    res.clearCookie("user_id");
    res.clearCookie("refresh_token");
    req.session.user_id = null;
    app.locals.isLoggedIn = false;
  } else {
    app.locals.isLoggedIn = true;
  }
  next();
});

app.post("/api/token", auth, clickAuthResult);

app.post("/api/check-user", getUserInfoCheck);

app.get("/", getHomePage);

app.get("/introduce", getIntroPage);

app.get("/login", login);

app.get("/qna", getQnAPage);

app.get("/way", getWayPage);

app.get("/meal", getMealPage);

app.get("/anonymous-post", (req, res) => {
  getBoardPage(req, res);
});

app.get("/notice", (req, res) => {
  getBoardPage(req, res);
});

app.post("/notice/content/post", (req, res) => {
  sendContent(req, res);
});

app.post("/anonymous-post/content/post", (req, res) => {
  sendContent(req, res);
});

app.get("/anonymous-post/content", (req, res) => {
  if (req.query.method == undefined) {
    getBoardContent(req, res);
  } else {
    if (req.query.method == "update") updateContent(req, res);
    else if (req.query.method == "delete") deleteContent(req, res);
  }
});

app.get("/notice/content", (req, res) => {
  if (req.query.method == undefined) {
    getBoardContent(req, res);
  } else {
    if (req.query.method == "update") updateContent(req, res);
    else if (req.query.method == "delete") deleteContent(req, res);
  }
});

app.get("/student", getStudentPage);

app.get("/calendar", getCalendarData);

app.get("/logout", logout);

app.get("/anonymous-post/write", writeContent);

app.get("/notice/write", writeContent);

app.get("/signup", signup);

app.post("/getdate", getCalendarData);

app.post("/get-meal-date", getMealDate);

app.post("/login/result", getLoginResult);

app.post("/signup/result", getSignUpResult);

app.get("/mypage", (req, res) => {
  getMyPage(req, res);
});

app.post("/check-id", checkIDExisting);

app.post("/check-password", checkPasswordCorrect);

app.post("/withdraw", (req, res) => {
  withdrawUser(req, res);
});

app.post("/edit-info", change_info);

app.get("/withdraw/complete", withdrawComplete);

app.listen(port, function () {
  console.log("App listening...");
});
