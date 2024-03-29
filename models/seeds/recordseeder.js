const mongoose = require("mongoose");
const recordDB = require("../records.js");
const userDB = require("../users");
const recordsList = require("../records.json").results;
const usersList = require("../users.json").results;
const bcrypt = require("bcryptjs");

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

const db = mongoose.connection;

db.on("error", () => {
  console.log("db error");
});

db.once("open", () => {
  console.log("mongodb connected!");

  usersList.forEach((item, USER) => {
    const newUser = userDB(item);

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

    Array(3)
      .fill()
      .forEach((_, RECORD) => {
        if (RECORD + USER * 3 < 5) {
          recordDB.create({
            ...recordsList[RECORD + USER * 3],
            userId: newUser._id
          });
        }
      });
  });

  console.log("Seeder done");
});
