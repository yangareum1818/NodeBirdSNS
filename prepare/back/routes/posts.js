const express = require("express");
const { Op } = require("sequelize");
const { Post, User, Comment, Image } = require("../models");
const router = express.Router();

router.get("/", async (req, res, next) => {
  // GET posts
  try {
    const where = {};
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

module.exports = router;
