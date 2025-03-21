const mongoose = require("mongoose");

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
  idProjet: { type: String, required: true },
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
});
const model = mongoose.model("pdatabase", schema);
module.exports = model;
