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
      collate: "uft8mb4_general_ci", // 한글 + 이모티콘 저장
    }
  );

  Post.associate = (db) => {};

  return Post;
};
