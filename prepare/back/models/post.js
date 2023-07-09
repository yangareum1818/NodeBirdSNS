const { DataTypes } = require("sequelize");
const { sequelize } = require(".");

module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    "Post",
    {
      // id: {}, MySQL에서 id가 자동으로 생성된다.
      content: {
        type: DataTypes.TEXT, // 글자를 무제한으로 늘려주기위해 TEXT를 사용해보았다. STRING으로 한다.
        allowNull: false,
      },
    },
    {
      // Post Module에 대한 셋팅
      charset: "utf8mb4", // 한글 + 이모티콘
      collate: "utf8mb4_general_ci", // 한글 + 이모티콘 저장
    }
  );

  // belongsTo 단수, hasMany 복수 (뒤에 s)
  Post.associate = (db) => {
    // 어떤게시글은 어떤사람(작성자)에게 속해있는다.
    db.Post.belongsTo(db.User); // post.addUser post.getUser
    // 어떤 게시글에 여러개의 해시태그 (또, 하나의 해시태그에 여러개의 게시글) M:N의 관계 (다수대다수)
    db.Post.belongsToMany(db.Hashtag, { through: "PostHashtag" }); // post.addHashtags
    // 하나의 게시글에 댓글 여러개. 그 댓글에 게시글은 하난 1:1
    db.Post.hasMany(db.Comment); // post.addComments post.getComments
    // 하나의 게시글에 이미지는 여러개 1:N
    db.Post.hasMany(db.Image); // post.addImages post.getImages
    // 하나의 게시글에 좋아요를 누른 여러사람 (중간테이블이름 정해줄 수 있다.) Post, User 모두 작성해줘야한다. (한 곳만 작성하면 작성하지 않은 한 곳에 중간테이블이름이 UserPost라고 생기는데 그게 좋아요 수인지 알 수 없으니, 해줘야한다.)
    db.Post.belongsToMany(db.User, { through: "Like", as: "Likers" }); // post.addLikers post.removeLikers

    // Retweet (Post = Post) 1:N 관계 (하나의 게시글을 퍼가요~를 해 여러개의 게시글이 생성(하나의 게시글을 바라본다.))
    db.Post.belongsTo(db.Post, { as: "Retweet" }); // post.Retweete
  };

  return Post;
};
