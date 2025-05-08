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
const model = mongoose.model("payementclient", schema);
schema.index({ month: 1, considerer: 1 });
schema.index({ account_id: 1 });
module.exports = model;
