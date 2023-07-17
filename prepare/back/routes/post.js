const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const { Post, Image, Comment, User } = require("../models");
const { isLoggedIn } = require("./middlewares");

const router = express.Router();

// 이미지 업로드 파일 생성
try {
  fs.accessSync("uploads");
} catch (error) {
  console.log("uploads 폴더가 없어서 맹들었슴돠 !");
  fs.mkdirSync("uploads");
}

// multer 미들웨어 : 게시물 이미지 업로드 설정
const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, "uploads");
    },
    filename(req, file, done) {
      const ext = path.extname(file.originalname); // 확장자추출(.png)
      const basename = path.basename(file.originalname, ext); // 파일명
      done(null, basename + "_" + new Date().getTime() + ext); // 파일명 + _ + 시간초 + 확장자
    },
  }),
  limits: { fileSize: 20 * 1024 * 1024 },
});

// 게시글 업로드
router.post("/", isLoggedIn, upload.none(), async (req, res, next) => {
  // POST /post
  try {
    const post = await Post.create({
      content: req.body.content,
      UserId: req.user.id, // 게시글을 작성한 사용자 id
    });
    // 받은 이미지 시퀄라이즈, DB저장
    if (req.body.image) {
      if (Array.isArray(req.body.image)) {
        // 이미지를 여러개 올리면 image: [파일명.png, 파일명.png]
        const images = await Promise.all(
          req.body.image.map((image) => Image.create({ src: image }))
        );
        await post.addImages(images);
      } else {
        // 이미지를 하나만 올리면 image: 파일명.png
        const image = await Image.create({ src: req.body.image });
        await post.addImages(image);
      }
    }
    const fullPost = await Post.findOne({
      where: { id: post.id },
      include: [
        {
          model: Image,
        },
        {
          model: Comment,
          include: [
            {
              model: User, // 댓글 단 작성자
              attributes: ["id", "nickname"],
            },
          ],
        },
        {
          model: User, // 게시글 작성자
          attributes: ["id", "nickname"],
        },
        {
          model: User, // 좋아요 누른 사람
          as: "Likers",
          attributes: ["id"],
        },
      ],
    });
    res.status(201).json(fullPost);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// 이미지 업로드
router.post("/images", isLoggedIn, upload.array("image"), (req, res, next) => {
  console.log(req.files);
  res.json(req.files.map((v) => v.filename));
});

// 게시글의 댓글 달기
router.post("/:postId/comment", isLoggedIn, async (req, res, next) => {
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
      // params는 문자열로 이뤄진다!!!!!!!!
      PostId: parseInt(req.params.postId, 10), // 동적url은 params를 사용한다.
      UserId: req.user.id, // 게시글을 작성한 사용자 id
    });
    const fullComment = await Comment.findOne({
      where: { id: comment.id },
      include: [
        {
          model: User,
          attributes: ["id", "nickname"],
        },
      ],
    });
    res.status(201).json(fullComment);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// 게시글 좋아요
router.patch("/:postId/like", isLoggedIn, async (req, res, next) => {
  // PATCH /post/1/like
  try {
    const post = await Post.findOne({ where: { id: req.params.postId } });
    if (!post) return res.status(403).send("존재하지 않은 게시물입니다.");
    await post.addLikers(req.user.id);
    res.json({ PostId: post.id, UserId: req.user.id });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// 게시글 좋아요 취소
router.delete("/:postId/like", isLoggedIn, async (req, res, next) => {
  // DELETE /post/1/like
  try {
    const post = await Post.findOne({ where: { id: req.params.postId } });
    if (!post) return res.status(403).send("존재하지 않은 게시물입니다.");
    await post.removeLikers(req.user.id);
    res.json({ PostId: post.id, UserId: req.user.id });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// 내가 쓴 게시글 삭제
router.delete("/:postId", isLoggedIn, async (req, res, next) => {
  // DELETE /post/1
  try {
    await Post.destroy({
      where: {
        id: req.params.postId,
        UserId: req.user.id,
      },
    });
    res.status(200).json({ PostId: parseInt(req.params.postId, 10) });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
