const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    idFeedback: { type: String, required: true, unique: true },
    title: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    idRole: { type: [String], required: true },
    plateforme: {
      type: [String],
      required: true,
      enum: ["vm", "dt", "portofolio"],
    },
    savedby: { type: String, required: true },
  },
  { timestamps: true }
);
schema.index({ id: 1 });
const model = mongoose.model("tfeedbacks", schema);
module.exports = model;
