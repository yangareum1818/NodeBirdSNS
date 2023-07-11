const express = require("express");
const cors = require("cors");
const postRouter = require("./routes/post");
const postsRouter = require("./routes/posts");
const userRouter = require("./routes/user");
const db = require("./models");
const dotenv = require("dotenv");
const morgan = require("morgan");

const passportConfig = require("./passport");
const passport = require("passport");
const session = require("express-session");
const cookieParser = require("cookie-parser");

dotenv.config();

const app = express();

db.sequelize
  .sync()
  .then(() => {
    console.log("db 연결 성공");
  })
  .catch(console.error);

passportConfig();

app.use(morgan("dev"));
app.use(
  cors({
    origin: "http://localhost:3060",
    credentials: true, // 쿠키 전송 true
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser("nodebirdsecret"));
app.use(
  session({
    saveUninitialized: false,
    resave: false,
    secret: process.env.COOKIE_SECRET,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.send("hello express");
});

app.get("/", (req, res) => {
  res.send("hello api");
});

app.use("/post", postRouter);
app.use("/posts", postsRouter);
app.use("/user", userRouter);

// 이 사이에 에러처리 미들웨어가 내부적으로 존재한다.

app.listen(3065, () => {
  console.log("서버 실행 중 - !");
});
