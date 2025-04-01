const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    account_id: { type: String, requird: true },
    shop_name: { type: String, required: true },
    month: { type: String, required: true },
    savedBy: { type: String, required: true },
    codeAgent: { type: String, required: true },
    dateSave: { type: Number, required: true },
    amount: { type: Number, required: true },
  },
  { timestamps: true }
);

const model = mongoose.model("reactivation", schema);
module.exports = model;
