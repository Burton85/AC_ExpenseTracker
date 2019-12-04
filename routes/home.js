const express = require("express");
const router = express.Router();
const recordDB = require("../models/records");
const { authenticated } = require("../config/auth");
const dateFormat = require("dateformat");

//home page
router.get("/", authenticated, (req, res) => {
  var now = new Date();
  let category = req.query.category;
  let month = req.query.month;
  let recordResult = [];
  let totalAmount = 0;

  if (category != null) {
    recordDB
      .find({ userId: req.user._id, category: category })
      .exec((err, records) => {
        if (err) return console.error(err);

        //過濾月份
        if (month != null) {
          recordResult = records.filter(
            item => dateFormat(item.date, "mm") === month
          );
        } else {
          recordResult = records;
        }

        recordResult.forEach(item => {
          //轉換日期
          item.formated_date = dateFormat(item.date, "isoDate");
          //計算總金額
          totalAmount += Number(item.amount);
          //判斷icon
          if (item.category == "家居物業") item.home = true;
          else if (item.category == "交通出行") item.bus = true;
          else if (item.category == "休閒娛樂") item.smile = true;
          else if (item.category == "餐飲食品") item.food = true;
          else item.pen = true;
        });

        return res.render("index", {
          records: recordResult,
          category: category,
          totalAmount: totalAmount,
          month: month
        });
      });
  } else {
    recordDB.find({ userId: req.user._id }).exec((err, records) => {
      if (err) return console.error(err);

      //過濾月份
      if (month != null) {
        recordResult = records.filter(
          item => dateFormat(item.date, "mm") === month
        );
      } else {
        recordResult = records;
      }
      recordResult.forEach(item => {
        //轉換日期
        item.formated_date = dateFormat(item.date, "isoDate");
        //計算總金額
        totalAmount += Number(item.amount);
        //判斷icon
        if (item.category == "家居物業") item.home = true;
        else if (item.category == "交通出行") item.bus = true;
        else if (item.category == "休閒娛樂") item.smile = true;
        else if (item.category == "餐飲食品") item.food = true;
        else item.pen = true;
      });

      return res.render("index", {
        records: recordResult,
        totalAmount: totalAmount,
        month: month
      });
    });
  }
});
module.exports = router;
