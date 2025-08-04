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
    typecharge: {
      type: String,
      required: true,
      enum: ["poste", "departement"],
    },
    verification: { type: Boolean, required: true, default: false },
    suivisuperuser: { type: Boolean, required: true, default: false },
    isAction: { type: Boolean, required: true, default: false },
    torefresh: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);
schema.index({ id: 1 });
const model = mongoose.model("tfeedbacks", schema);
module.exports = model;
