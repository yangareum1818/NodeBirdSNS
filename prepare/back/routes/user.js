const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const { Op } = require("sequelize");

const { User, Post, Image, Comment } = require("../models");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");

const router = express.Router();

// 로그인 정보 매번 불러오기 ( 로그인 유지, 사용자 정보 복구 )
router.get("/", async (req, res, next) => {
  console.log(req.headers);
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

// 팔로워즈 리스트
router.get("/followers", isLoggedIn, async (req, res, next) => {
  // GET /user/followers
  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    if (!user) return res.status(403).send("존재하지 않는 사용자입니다.");
    const followers = await user.getFollowers();
    res.status(200).json(followers);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// 팔로잉즈 리스트
router.get("/followings", isLoggedIn, async (req, res, next) => {
  // GET /user/followings
  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    if (!user) return res.status(403).send("존재하지 않는 사용자입니다.");
    const followings = await user.getFollowings();
    res.status(200).json(followings);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// 특정 사용자 정보를 가져오는 ROUTER (내 정보, 게시글만)
router.get("/:userId", async (req, res, next) => {
  console.log(req.headers);
  // GET /user
  try {
    // 로그인 한 상태였을 때만, 사용자의 정보 보내 로그인 유지
    const fullUserWithoutPassword = await User.findOne({
      where: {
        id: req.params.userId,
      }, // 조건문 없으면 에러나는 부분.
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
    if (fullUserWithoutPassword) {
      const data = fullUserWithoutPassword.toJSON();
      data.Posts = data.Posts.length;
      data.Followers = data.Followers.length;
      data.Followings = data.Followings.length;
      res.status(200).json(data);
    } else {
      res.status(404).json("존재하지 않는 사용자입니다.");
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// 특정 사용자의 게시글들만 가져오기
router.get("/:userId/posts", async (req, res, next) => {
  // GET /user/1/posts
  try {
    const where = { UserId: req.params.userId };
    if (parseInt(req.query.lastId, 10)) {
      // 초기 로딩이 아닐 때,
      // lastId보.다.작.은. 게시글 불러오기
      where.id = { [Op.lt]: parseInt(req.query.lastId, 10) };
    }
    const posts = await Post.findAll({
      // where은 조건이다. (내가 쓴 게시글만 보인다던지 등..)
      where,
      limit: 10,
      order: [
        ["createdAt", "DESC"], // 게시글의 생성일로 내림차순
        [Comment, "createdAt", "DESC"], // 댓글 생성일로 내림차순
      ],
      include: [
        {
          model: User,
          attributes: ["id", "nickname"],
        },
        {
          model: Comment,
          include: [
            {
              model: User,
              attributes: ["id", "nickname"],
            },
          ],
        },
        {
          model: User,
          as: "Likers",
          attributes: ["id"],
        },
        {
          model: Image,
        },
        {
          model: Post,
          as: "Retweet",
          include: [
            {
              model: User,
              attributes: ["id", "nickname"],
            },
            {
              model: Image,
            },
          ],
        },
      ],
    });
    // console.log(posts);
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    next(err);
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
            attributes: ["id"],
          },
          {
            model: User,
            as: "Followings",
            attributes: ["id"],
          },
          {
            model: User,
            as: "Followers",
            attributes: ["id"],
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

// 팔로우
router.patch("/:userId/follow", isLoggedIn, async (req, res, next) => {
  // PATCH /user/1/follow
  try {
    const user = await User.findOne({
      where: { id: req.params.userId },
    });
    if (!user)
      return res
        .status(403)
        .send("존재하지 않는 사용자라 팔로우하지 못합니다.");
    await user.addFollowers(req.user.id);
    res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// 언팔로우
router.delete("/:userId/follow", isLoggedIn, async (req, res, next) => {
  // PATCH /user/1/follow
  try {
    const user = await User.findOne({
      where: { id: req.params.userId },
    });
    if (!user)
      return res
        .status(403)
        .send("존재하지 않는 사용자라 언팔로우하지 못합니다.");
    await user.removeFollowers(req.user.id);
    res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// 팔로워 차단
router.delete("/follower/:userId", isLoggedIn, async (req, res, next) => {
  // DELETE /user/follower/1
  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    if (!user)
      return res
        .status(403)
        .send("존재하지 않는 사용자라 팔로우차단 하지 못합니다.");
    await user.removeFollowers(req.params.userId);
    res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});
module.exports = router;
