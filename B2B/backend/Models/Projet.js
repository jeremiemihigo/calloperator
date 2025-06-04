const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    designation: { type: String, required: true },
    id: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    next_step: { type: String, required: true },

    responsable: { type: String, required: true },
    email: { type: String, required: false },
    adresse: { type: String, required: false },
    contact: { type: String, required: false },
    deedline: { type: Date, required: false },
    suivi_par: { type: [String], required: true },

    idCategorie: { type: String, required: true },
    statut: {
      type: String,
      required: true,
      enum: [
        "En cours",
        "abandonner",
        "En attente",
        "En retard",
        "En pause",
        "clorurer",
      ],
      default: "En cours",
    },
  },
  { timestamps: true }
);
const model = mongoose.model("project", schema);
module.exports = model;
