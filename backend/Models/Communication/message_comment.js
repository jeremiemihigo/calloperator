const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    idMessage: { type: String, required: true }, //si l'agent veut laisser un comment sur un autre commentaire
    texte: { type: String, required: true, trim: true },
    codeAgent: { type: String, required: true, trim: true }, //Editeur
    idComment: { type: String, required: true },
  },
  { timestamps: true }
);
const model = mongoose.model("message_commentaire", schema);
module.exports = model;
