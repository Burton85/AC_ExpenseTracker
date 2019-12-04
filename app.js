const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const recordDB = require("./models/records.js");
const session = require("express-session");
const passport = require("passport");
const flash = require("connect-flash");

//DISTINGUISH THE ENVIRONMENT
require("dotenv").config();
//body parser
app.use(bodyParser.urlencoded({ extended: true }));
//import method override
app.use(methodOverride("_method"));
//connect with view
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.use(express.static("public"));

//connect with model
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost/books", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
  })
  .then(() => console.log("DB Connected!"))
  .catch(err => {
    console.log(mongoose.connection);
  });
db = mongoose.connection;

db.on("error", () => {
  console.log("mongodb error");
});
db.once("open", () => {
  console.log("mongodb connected");
});

app.use(
  session({
    secret: "SSH",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1200000,
      sameSite: true,
      secure: false
    }
  })
);
//initial passport
app.use(passport.initialize());
app.use(passport.session());
require("./config/passport.js")(passport);

//use connect flash
app.use(flash());

app.use((req, res, next) => {
  app.locals.layout = "/views/layouts/main.handlebars";
  res.locals.user = req.user;
  res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.success_msg = req.flash("success_msg").toString();
  res.locals.warning_msg = req.flash("warning_msg").toString();
  next();
});
//routes
app.use("/records", require("./routes/records"));
app.use("/", require("./routes/home"));
app.use("/users", require("./routes/users"));
app.use("/auth", require("./routes/auth"));

app.listen(process.env.PORT || 3000, () => {
  console.log("App is running");
});
