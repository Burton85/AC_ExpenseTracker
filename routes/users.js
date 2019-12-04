const express = require("express");
const router = express.Router();
const Users = require("../models/users.js");
const passport = require("passport");
const bcrypt = require("bcryptjs");

//login
router.get("/login", (req, res) => {
  // req.flash("warning_msg", message);
  res.render("login");
});
//login submit
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/",
    failureFlash: true,
    failureRedirect: "/users/login"
  })(req, res, next);
});
//register
router.get("/register", (req, res) => {
  res.render("register");
});
//register submit
router.post("/register", (req, res) => {
  const { name, email, password, password2 } = req.body;
  //Add error messages
  let errors = [];
  if (!name || !email || !password || !password2) {
    errors.push({ message: "Please fill all the field up" });
  }
  if (password != password2) {
    errors.push({
      message: "Confirm password must to be some with your password"
    });
  }
  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    Users.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ message: "This email has been used" });
        res.render("register", {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        const newUser = new Users({
          name,
          email,
          password
        });
        //generate salt
        bcrypt.genSalt(10, (err, salt) =>
          //hash password
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            //save new user
            newUser
              .save()
              .then(user => {
                res.redirect("/");
              })
              .catch(err => console.log(err));
          })
        );
      }
    });
  }
});
//logout
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "Logout!");
  res.redirect("/users/login");
});

module.exports = router;
