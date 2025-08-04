const { upperCase } = require("lodash");
const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    account_id: { type: String, required: true, trim: true, uppercase: true },
    shop_name: { type: String, required: true },
    month: { type: String, required: true },
    dateSave: { type: Number, required: true },
    transaction_time: { type: String, required: false },
    amount: { type: Number, required: true, min: 0 },
    processed_date: { type: String, required: false },
    payment_status: { type: String, required: false },
    provider_transact_reference: { type: String, required: true },
    provider: { type: String, required: true },
    savedBy: { type: String, required: true },
  },
  { timestamps: true }
);
const model = mongoose.model("tpayement", schema);
module.exports = model;
