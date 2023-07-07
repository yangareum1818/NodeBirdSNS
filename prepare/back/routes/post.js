const express = require("express");
const { Post, Image, Comment, User } = require("../models");
const { isLoggedIn } = require("./middlewares");

const router = express.Router();

router.post("/", isLoggedIn, async (req, res, next) => {
  // POST /post
  try {
    const post = await Post.create({
      content: req.body.content,
      UserId: req.user.id, // 게시글을 작성한 사용자 id
    });
    const fullPost = await Post.findOne({
      where: { id: post.id },
      include: [
        {
          model: Image,
        },
        {
          model: Comment,
        },
        {
          model: User,
        },
      ],
    });
    res.status(201).json(fullPost);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.post(`/:postId/comment`, isLoggedIn, async (req, res, next) => {
  // POST /postId/comment (동적 url(파라미터))
  try {
    // 존재하는 게시글인지 검사하기 (프론트는 어느 위험에 노출될 수 있으니 back에서 처리해준다.)
    const post = await Post.findOne({
      where: { id: req.params.postId },
    });
    // return 잊지말자!! 밑에 res(응답)과 두번 응답하는 일이 발생!!
    if (!post) return res.status(403).send("존재하지 않는 게시물입니다.");
    const comment = await Comment.create({
      content: req.body.content,
      PostId: req.params.postId, // 동적url은 params를 사용한다.
      UserId: req.user.id, // 게시글을 작성한 사용자 id
    });
    res.status(201).json(comment);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.delete("/", (req, res) => {
  // DELETE /post
  res.json({ id: 1 });
});

module.exports = router;
