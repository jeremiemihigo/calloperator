const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    categorie: {
      type: String,
      required: true,
      enum: ["staff", "agent_terrain"],
    },
    destinateur: { type: [String], required: true },
    message: { type: String, required: true, trim: true },
    savedby: { type: String, required: true },
    vu_par: { type: [String], required: true },
    idMessage: { type: String, required: true },
  },
  { timestamps: true }
);

const model = mongoose.model("message_texte", schema);
module.exports = model;
