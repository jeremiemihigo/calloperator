const mongoose = require("mongoose");

const coordonne = new mongoose.Schema({
  latitude: { type: String, required: false },
  longitude: { type: String, required: false },
  altitude: { type: String, required: false },
});
const double = new mongoose.Schema({
  codeAgent: { type: String, required: true },
  valeur: { type: String, required: true },
  _id: false,
});

const schema = new mongoose.Schema(
  {
    valide: { type: Boolean, required: true, default: false },
    idDemande: { type: String, required: true, unique: true },
    commune: { type: String, required: true },
    numero: { type: String, required: false },
    idShop: { type: String, required: false },
    dateSave: { type: Date, required: true },
    codeAgent: {
      type: String,
      required: [true, "Le code agent est obligatoire"],
      ref: "Agent",
    },
    codeZone: { type: String, required: true },
    typeImage: {
      type: String,
      default: "photo",
      required: [true, "Veuillez renseigner le type d'image"],
    },
    coordonnes: { type: coordonne, required: false },
    statut: {
      type: String,
      required: [true, "Le statut du client svp!"],
      enum: ["allumer", "eteint"],
    },
    raison: { type: String, required: true },
    codeclient: { type: String, required: false },
    file: { type: String, required: [true, "Envoies la capture svp !"] },
    sector: { type: String, required: true },
    cell: { type: String, required: true },
    reference: { type: String, required: true },
    sat: { type: String, required: true },
    lot: { type: String, required: true },
    itemswap: { type: String, required: false },
    jours: { type: Number, required: false },
    concerne: { type: String, required: false, enum: ["agent", "rs"] },
    feedbackrs: { type: String, required: false },
    typeVisit: {
      dateFollowup: { type: Date, required: false },
      //ID de la premiere visite
      visiteFollowup: { type: String, required: false },
    },
    //Pour les doublons
    double: { type: double, required: false },
    feedback: {
      type: String,
      required: true,
      default: "new",
      //Chat ou non conforme
      enum: ["new", "chat", "doublon", "followup"],
    },
  },
  {
    timestamps: true,
  }
);
schema.index({ idDemande: 1 });
schema.index({ valide: 1 });
schema.index({ codeAgent: 1 });
const model = mongoose.model("Demande", schema);
module.exports = model;
