const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    concerne: { type: String, required: true },
    message: { type: String, required: true, trim: true },
    vu: { type: Boolean, required: true, default: false },
    savedby: { type: String, required: true },
  },
  { timestamps: true }
);
const model = mongoose.model("message_agent", schema);
module.exports = model;
