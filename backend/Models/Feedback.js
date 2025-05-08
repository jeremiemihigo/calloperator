const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, uppercase: true },
    nextFeedback: { type: String, required: false },
    title: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      unique: true,
    },
    plateforme: { type: [String], required: true, enum: ["vm", "portofolio"] },
    savedby: { type: String, required: true },
  },
  { timestamps: true }
);
schema.index({ plateforme: 1 });
const model = mongoose.model("feedback", schema);
module.exports = model;
