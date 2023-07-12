const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");

const { User, Post } = require("../models");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");

const router = express.Router();

// 로그인 정보 매번 불러오기 ( 로그인 유지, 사용자 정보 복구 )
router.get("/", async (req, res, next) => {
  // GET /user
  try {
    if (req.user) {
      // 로그인 한 상태였을 때만, 사용자의 정보 보내 로그인 유지
      const fullUserWithoutPassword = await User.findOne({
        where: { id: req.user.id }, // 조건문 없으면 에러나는 부분.
        attributes: {
          exclude: ["password"],
        },
        include: [
          {
            model: Post,
            attributes: ["id"], // id만 가져온다. (데이터 효율)
          },
          {
            model: User,
            as: "Followings",
            attributes: ["id"], // id만 가져온다. (데이터 효율)
          },
          {
            model: User,
            as: "Followers",
            attributes: ["id"], // id만 가져온다. (데이터 효율)
          },
        ],
      });
      res.status(200).json(fullUserWithoutPassword);
    } else {
      res.status(200).json(null);
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// 로그인
router.post("/login", isNotLoggedIn, (req, res, next) => {
  // 로그인은 로그인을 하지 않은 사용자만 사용이 가능하다. (isNotLoggedIn)
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
    return req.login(user, async (loginErr) => {
      if (loginErr) {
        console.error(loginErr);
        return next(loginErr);
      }
      const fullUserWithoutPassword = await User.findOne({
        where: { id: user.id },
        attributes: {
          exclude: ["password"],
        },
        include: [
          {
            model: Post,
          },
          {
            model: User,
            as: "Followings",
          },
          {
            model: User,
            as: "Followers",
          },
        ],
      });
      return res.status(200).json(fullUserWithoutPassword);
    });
  })(req, res, next);
});

// 회원가입
router.post("/", isNotLoggedIn, async (req, res, next) => {
  // 로그인 안 한 사용자
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
// passport@0.6이 되면서 로그인할 때 마다 세션 쿠키가 변경되고, 로그아웃할 때도 세션 쿠키가 정리됌.
// 결론 : 콜백함수를 이용해 그 안에서 응답해야한다.
router.post("/logout", isLoggedIn, (req, res) => {
  // 로그인 한 사용자. (isLoggedIn)
  req.logout(() => {
    req.session.destroy();
    res.send("ok");
  });
});

// 닉네임 변경
router.patch("/nickname", isLoggedIn, async (req, res, next) => {
  try {
    await User.update(
      { nickname: req.body.nickname }, // 프론트에서 제공한 닉네임
      {
        where: { id: req.user.id }, // 내 아이디
      }
    );
    res.status(200).json({ nickname: req.body.nickname });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
