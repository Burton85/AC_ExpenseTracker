const express = require("express");
const router = express.Router();
const recordDB = require("../models/records");
const { authenticated } = require("../config/auth");
const dateFormat = require("dateformat");

//home page
router.get("/", authenticated, (req, res) => {
  var now = new Date();
  let category = req.query.category;
  let totalAmount = 0;
  if (category != null) {
    recordDB
      .find({ userId: req.user._id, category: category })
      .exec((err, records) => {
        if (err) return console.error(err);
        records.forEach(item => {
          item.formated_date = dateFormat(item.date, "isoDate");
          totalAmount += Number(item.amount);
          if (item.category == "家居物業") item.home = true;
          else if (item.category == "交通出行") item.bus = true;
          else if (item.category == "休閒娛樂") item.smile = true;
          else if (item.category == "餐飲食品") item.food = true;
          else item.pen = true;
        });
        return res.render("index", {
          records: records,
          category: category,
          totalAmount: totalAmount
        });
      });
  } else {
    recordDB.find({ userId: req.user._id }).exec((err, records) => {
      if (err) return console.error(err);
      records.forEach(item => {
        item.formated_date = dateFormat(item.date, "isoDate");
        totalAmount += Number(item.amount);
        if (item.category == "家居物業") item.home = true;
        else if (item.category == "交通出行") item.bus = true;
        else if (item.category == "休閒娛樂") item.smile = true;
        else if (item.category == "餐飲食品") item.food = true;
        else item.pen = true;
      });
      return res.render("index", {
        records: records,
        totalAmount: totalAmount
      });
    });
  }
});
module.exports = router;
