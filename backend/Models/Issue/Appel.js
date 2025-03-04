const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  openBy: { type: String, required: true },
  codeclient: {
    type: String,
    required: false,
    trim: false,
    max: 12,
    min: 12,
    uppercase: false,
  },
  nomClient: { type: String, required: false },
  typePlainte: { type: String, required: false },
  plainteSelect: { type: String, required: false },
  dateSave: { type: Date, required: true },
  fullDateSave: { type: Date, required: true },
  recommandation: { type: String, required: false },
  dateClose: { type: Date, required: false },
  statut: {
    type: String,
    required: true,
    default: "open",
    enum: ["resolved", "open"],
  },
  delai: { type: String, enum: ["IN SLA", "OUT SLA"], required: false },
  idPlainte: { type: String, required: true },
});
const model = mongoose.model("Appel", schema);
module.exports = model;
