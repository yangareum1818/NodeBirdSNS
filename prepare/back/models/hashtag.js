const { DataTypes } = require("sequelize");
const { sequelize } = require(".");

module.exports = (sequelize, DataTypes) => {
  const Hashtag = sequelize.define(
    "Hashtag",
    {
      // id: {}, MySQL에서 id가 자동으로 생성된다.
      name: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
    },
    {
      // Hashtag Module에 대한 셋팅
      charset: "utf8mb4", // 한글 + 이모티콘
      collate: "uft8mb4_general_ci", // 한글 + 이모티콘 저장
    }
  );

  Hashtag.associate = (db) => {};

  return Hashtag;
};
