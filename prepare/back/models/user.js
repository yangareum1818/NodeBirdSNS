const { DataTypes } = require("sequelize");
const { sequelize } = require(".");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      // id: {}, MySQL에서 id가 자동으로 생성된다.
      email: {
        type: DataTypes.STRING(30),
        allowNull: false, // 필수
        unique: true, // 고유한 값 (다른 사람과 중복되면 안되기 때문)
      },
      nickname: {
        type: DataTypes.STRING(30),
        allowNull: false, // 필수
      },
      password: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
    },
    {
      // User Module에 대한 셋팅
      charset: "utf8",
      collate: "uft8_general_ci", // 한글저장
    }
  );

  User.associate = (db) => {};

  return User;
};
