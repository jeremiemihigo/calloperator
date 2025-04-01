const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    account_id: { type: String, required: true, uppercase: true },
    shop_name: { type: String, required: true },
    amount: { type: Number, required: true },
    month: { type: String, required: true },
    considerer: { type: Boolean, required: true, default: false },
    id: { type: String, required: true },
  },
  { timestamps: true }
);
const model = mongoose.model("payement", schema);
module.exports = model;
