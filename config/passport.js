const LocalStrategy = require("passport-local").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const mongoose = require("mongoose");
const userDB = require("../models/users");
const bcrypt = require("bcryptjs");
// require("dotenv").config();
module.exports = passport => {
  passport.use(
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      userDB.findOne({ email, email }).then(user => {
        if (!user) {
          return done(null, false, { message: "User is not exist" });
        }
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          else if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, {
              message: "Incorrect username or password"
            });
          }
        });
      });
    })
  );
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_ID,
        clientSecret: process.env.FACEBOOK_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK,
        profileFields: ["email", "displayName"]
      },
      (accessToke, refreshToken, profile, done) => {
        userDB.findOne({ email: profile._json.email }).then(user => {
          if (!user) {
            const randomPassword = Math.random()
              .toString(36)
              .slice(-8);
            bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(randomPassword, salt, (err, hash) => {
                const newUser = userDB({
                  name: profile._json.name,
                  email: profile._json.email,
                  password: hash
                });
                newUser
                  .save()
                  .then(user => {
                    return done(null, user);
                  })
                  .catch(err => {
                    console.log(err);
                  });
              });
            });
          } else {
            return done(null, user);
          }
        });
      }
    )
  );
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    userDB.findById(id, (err, user) => {
      done(err, user);
    });
  });
};
