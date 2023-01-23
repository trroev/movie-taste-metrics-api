const passport = require("passport");

module.exports = (passport) => {
  const JwtStrategy = require("passport-jwt").Strategy;
  const ExtractJwt = require("passport-jwt").ExtractJwt;
  const User = require("../models/user");

  const secret = process.env.SECRET_KEY;
  const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secret,
  };

  const strategy = new JwtStrategy(jwtOptions, (payload, done) => {
    // verify the payload and call the done callback with the user object
    User.findById(payload.userId, (err, user) => {
      if (err) return done(err);
      if (!user._id.equals(payload.userId))
        return done(null, false, { msg: "Invalid userId" });
      if (!user)
        return done(null, false, { msg: "Invalid Credentials" });
      done(null, user);
    });
  });

  passport.use(strategy);
};
