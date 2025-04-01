const mongoose = require("mongoose");
const { all_par } = require("../../utils/par");

const schema = new mongoose.Schema({
  codeclient: { type: String, required: true, trim: true, max: 12, min: 12 },
  customer_name: { type: String, required: true, trim: true },
  region: { type: String, required: true },
  shop: { type: String, required: true },
  status: {
    type: String,
    lowecase: true,
    required: true,
    enum: ["default", "late", "normal"],
  },
  month: { type: String, required: true },
  remindDate: { type: Number, required: true, default: 0 },
  first_number: { type: String, required: false },
  second_number: { type: String, required: false },
  payment_number: { type: String, required: false },
  etat: {
    type: String,
    required: true,
    default: "Pending",
    enum: ["Reachable", "Pending", "Unreachable", "Remind"],
  },
  dailyrate: { type: Number, required: false, default: 0 },
  weeklyrate: { type: Number, required: false, default: 0 },
  monthlyrate: { type: Number, required: false, default: 0 },
  par: { type: String, required: true, enum: all_par },
});
schema.index({ month: 1, codeclient: 1 }, { unique: true });
schema.index({ etat: 1, status: 1 });
const model = mongoose.model("pdatabase", schema);
module.exports = model;
