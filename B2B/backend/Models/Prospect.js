const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    projet: { type: String, required: false },
    id: { type: String, required: true, unique: true },
    description: { type: String, required: false },
    next_step: { type: String, required: true },
    savedBy: { type: String, required: true },

    email: { type: String, required: false },
    adresse: { type: String, required: false },
    contact: { type: String, required: false },
    suivi_par: { type: [String], required: true },

    statut: {
      type: String,
      required: true,
      enum: ["En cours", "abandonner", "En retard"],
      default: "En cours",
    },
  },
  { timestamps: true }
);
const model = mongoose.model("prospect", schema);
module.exports = model;
