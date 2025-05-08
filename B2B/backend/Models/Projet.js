const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    designation: { type: String, required: true },
    id: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    next_step: { type: String, required: true },
    statut: {
      type: String,
      required: true,
      enum: ["En cours", "abandonner", "En retard"],
      default: "En cours",
    },
  },
  { timestamps: true }
);
const model = mongoose.model("project", schema);
module.exports = model;
