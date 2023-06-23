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
    },
    {
      // Comment Module에 대한 셋팅
      charset: "utf8mb4", // 한글 + 이모티콘
      collate: "uft8mb4_general_ci", // 한글 + 이모티콘 저장
    }
  );

  Comment.associate = (db) => {};

  return Comment;
};
