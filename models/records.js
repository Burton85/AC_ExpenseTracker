const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const recordSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  amount: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "users",
    index: true,
    require: true
  },
  date: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model("RecordDB", recordSchema);
