const mongoose = require("mongoose");
const ModelDataBase = require("./PDataBase");

const schema = new mongoose.Schema({
  sioui_texte: { type: String, required: false },
  sioui_date: { type: Number, required: false },
  sinon_date: { type: Number, required: false },
  sinon_texte: { type: String, required: false },
  fonctionne: {
    type: String,
    enum: ["OUI", "NON", ""],
    default: "",
  },
  codeclient: {
    type: String,
    required: true,
    min: 12,
    max: 12,
    trim: true,
    uppercase: true,
  },
  month: { type: String, required: true },
  agent: { type: String, required: false },
  shop: { required: true, type: String },
  region: { required: true, type: String },
  dateSave: { type: Number, required: true },
  raison_rappel: { type: String, required: false },
  unreachable_feedback: { type: String, required: false },
  type: {
    type: String,
    required: true,
    enum: ["Reachable", "Unreachable", "Remind"],
  },
  status: { type: String, required: true, lowercase: true }, //Default or late
  date_to_recall: { type: Number, required: true, default: 0 },
  contact: { type: String, required: true },
});
schema.post("save", function (docs, next) {
  try {
    let remind =
      docs.sioui_texte === "Promesse de paiement"
        ? docs.sioui_date
        : docs.date_to_recall;
    ModelDataBase.findOneAndUpdate(
      {
        month: docs.month,
        codeclient: docs.codeclient,
      },
      {
        $set: {
          remindDate: remind,
          etat: docs.type,
        },
      }
    ).then(() => {
      next();
    });
  } catch (error) {
    console.log(error);
  }
});
schema.index({ dateSave: 1 });
schema.index({ codeclient: 1, month: 1, type: 1 });
const model = mongoose.model("pfeedback_call", schema);
module.exports = model;
