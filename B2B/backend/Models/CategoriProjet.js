const mongoose = require("mongoose");
const schema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    id: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);
const model = mongoose.model("categorisation", schema);
module.exports = model;
