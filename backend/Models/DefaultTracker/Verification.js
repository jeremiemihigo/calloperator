const mongoose = require("mongoose");
const ModelClient = require("./TableClient");

const schema = new mongoose.Schema(
  {
    codeclient: { type: String, required: true, trim: true, uppercase: true },
    nomclient: { type: String, required: true },
    region: { type: String, required: true },
    shop: { type: String, required: true },
    month: { type: String, required: true },
    par: { type: String, required: true },
    status: {
      type: String,
      required: true,
      default: "Awaiting_verification",
      enum: ["Awaiting_verification", "Confirmed"],
    },
    confirmed_by: { type: String, required: false },
    feedback: { type: String, required: true },
    feedbackfield: { type: String, required: false },
    idvisite: { type: String, required: true },
  },
  { timestamps: true }
);
schema.index({ codeclient: 1, month: 1 }, { unique: true });
schema.index({ region: 1 });
schema.index({ shop: 1 });
schema.index({ status: 1 });

const model = mongoose.model("tverification", schema);
module.exports = model;
