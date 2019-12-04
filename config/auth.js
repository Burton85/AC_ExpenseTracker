module.exports = {
  authenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash("warning_msg", "Please Login");
    res.redirect("/users/login");
  }
};
