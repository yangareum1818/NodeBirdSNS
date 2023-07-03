const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");

const { User } = require("../models");

const router = express.Router();

// 로그인
router.post("/login", (req, res, next) => {
  // POST /user/login
  passport.authenticate("local", (err, user, info) => {
    // 서버 에러
    if (err) {
      console.error(err);
      return next(err);
    }
    // 클라이언트 에러
    if (info) return res.status(401).send(info.reason);

    // 성공 시
    return req.login(user, (loginErr) => {
      if (loginErr) {
        console.error(loginErr);
        return next(loginErr);
      }
      return res.status(200).json(user);
    });
  })(req, res, next);
});

// 회원가입
router.post("/", async (req, res, next) => {
  // POST /user
  try {
    const exUser = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (exUser) {
      return res.status(403).send("이미 사용중인 아이디입니다.");
    }

    const hashedPassWord = await bcrypt.hash(req.body.password, 12);
    await User.create({
      email: req.body.email,
      nickname: req.body.nickname,
      password: hashedPassWord,
    });
    res.status(201).send("ok"); // 201 === 잘 만들어졌다.
  } catch (err) {
    console.error(err);
    next(err); // status 500
  }
});

// 로그아웃
router.post("/user/logout", (req, res, next) => {
  req.logout();
  req.session.destroy();
  res.send("ok");
});

module.exports = router;
