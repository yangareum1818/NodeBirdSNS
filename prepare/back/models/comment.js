const { DataTypes } = require("sequelize");
const { sequelize } = require(".");

module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    "Comment",
    {
      // id: {}, MySQL에서 id가 자동으로 생성된다.
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      // UserId: {}
      // PostId: {}
    },
    {
      // Comment Module에 대한 셋팅
      charset: "utf8mb4", // 한글 + 이모티콘
      collate: "uft8mb4_general_ci", // 한글 + 이모티콘 저장
    }
  );

  Comment.associate = (db) => {
    db.Comment.belongsTo(db.User); // 어떤 댓글에 사용자 한명이 속해있다. 1:1관계
    db.Comment.belongsTo(db.Post); // 어떤 댓글에 게시글이 한개 속해있다. 1:1관계
  };

  return Comment;
};
