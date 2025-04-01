const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    codeAgent: { type: String, required: true },
    month: { type: String, required: true },
    amount: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);
const model = mongoose.model("actionagent", schema);
module.exports = model;
