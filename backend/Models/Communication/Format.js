const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  idFormat: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  data: { type: [String], required: true },
});

const model = mongoose.model("message_format", schema);
module.exports = model;
