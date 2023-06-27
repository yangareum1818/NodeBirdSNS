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
      collate: "utf8_general_ci", // 한글저장
    }
  );

  User.associate = (db) => {
    db.User.hasMany(db.Post); // 유저와 게시글은 1:N의 관계
    db.User.hasMany(db.Comment); // 한 사용자가 댓글을 여러개 사용 1:N 관계
    db.User.belongsToMany(db.Post, { through: "Like", as: "Liked" }); // 사용자의 게시글에 좋아요 관계, 중간테이블의 이름을 정해줄 수 있다.
    db.User.belongsToMany(db.User, {
      through: "Follow",
      as: "Followers",
      foreignKey: "FollowingId",
    });
    db.User.belongsToMany(db.User, {
      through: "Follow",
      as: "Followings",
      foreignKey: "FollowerId",
    });
  };

  return User;
};
