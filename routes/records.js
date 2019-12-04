const express = require("express");
const router = express.Router();
const recordDB = require("../models/records");
const { authenticated } = require("../config/auth");

router.post("/", (req, res) => {
  const { name, category, amount, date, merchant } = req.body;
  let errors = [];
  if (!name || !category || !amount || !date) {
    errors.push({
      message: "Please input the necessary information"
    });
  }
  if (!amount == NaN) {
    errors.push({
      message: "Please input number to amount"
    });
  }
  if (errors.length > 0) {
    res.render("new", {
      errors
    });
  } else {
    const records = recordDB({
      name: name,
      category: String(category),
      amount: amount,
      date: date,
      userId: req.user._id
    });
    if (merchant) {
      records.merchant = merchant;
    }
    records.save(err => {
      if (err) return console.log(err);
      return res.redirect("/");
    });
  }
});
router.get("/new", authenticated, (req, res) => {
  res.render("new");
});

router.get("/:id", (req, res) => {
  recordDB.findOne(
    { _id: req.params.id, userId: req.user._id },
    (err, records) => {
      if (err) return console.log(err);
      res.render("detail", { records: records });
    }
  );
});

router.get("/:id/edit", authenticated, (req, res) => {
  recordDB.findOne(
    { _id: req.params.id, userId: req.user._id },
    (err, records) => {
      if (err) return console.log(err);
      console.log(records);
      res.render("edit", { records: records });
    }
  );
});
router.put("/:id/edit", (req, res) => {
  recordDB.findOne(
    { _id: req.params.id, userId: req.user._id },
    (err, records) => {
      records.name = req.body.name;
      records.price = req.body.price;
      records.category = req.body.category;
      records.date = req.body.date;

      records.save(err => {
        if (err) return console.log(err);
        return res.redirect(`/records/${records.id}`);
      });
    }
  );
});
router.delete("/:id/delete", (req, res) => {
  recordDB.findOne(
    { _id: req.params.id, userId: req.user._id },
    (err, records) => {
      records.remove(err => {
        if (err) return console.log(err);
        return res.redirect(`/`);
      });
    }
  );
});

module.exports = router;
