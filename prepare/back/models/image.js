const { DataTypes } = require("sequelize");
const { sequelize } = require(".");

module.exports = (sequelize, DataTypes) => {
  const Image = sequelize.define(
    "Image",
    {
      // id: {}, MySQL에서 id가 자동으로 생성된다.
      src: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
    },
    {
      // Image Module에 대한 셋팅
      charset: "utf8", // 한글 + 이모티콘
      collate: "utf8_general_ci", // 한글 + 이모티콘 저장
    }
  );

  Image.associate = (db) => {
    db.Image.belongsTo(db.Post); // 이미지들은 게시글의 소유자가 정해져있다. 1(게시글):N(이미지)관계
  };

  return Image;
};
