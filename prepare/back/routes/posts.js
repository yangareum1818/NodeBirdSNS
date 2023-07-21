const express = require("express");
const { Post, User, Comment, Image } = require("../models");
const router = express.Router();

router.get("/", async (req, res, next) => {
  // GET posts
  try {
    const posts = await Post.findAll({
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
    console.log(posts);
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    next(err);
  }
});

module.exports = router;
