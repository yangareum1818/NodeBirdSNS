const passport = require("passport");
const { Strategy: LocalStrategy } = require("passport-local");
const { User } = require("../models");
const bcrypt = require("bcrypt");

module.exports = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "passsword",
      },
      async (email, password, done) => {
        // findOne함수는 비동기.
        // 비동기일땐, 예외처리 해준다.
        try {
          const user = await User.findOne({
            // db에 있는 정보를 시퀄라이즈를 이용해 해당 email을 찾는다.
            where: { email },
          });
          // 사용자의 이메일이 없다면?
          if (!user)
            return done(null, false, { reason: "존재하지 않는 이메일입니다." });

          const result = bcrypt.compare(password, user.password); // 입력한 비번, db의 비번을 비교한 것을 변수에 담는다.
          if (result) return done(null, user);

          // 비번이 일치하지 않다면 ?
          return done(null, false, { reason: "비밀번호가 일치하지 않습니다." });
        } catch (err) {
          // 서버 에러
          console.error(err);
          return done(err);
        }
      }
    )
  );
};
