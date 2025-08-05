const mongoose = require("mongoose");

const historique = new mongoose.Schema(
  {
    id: { type: String, required: true },
    lastfeedback: { type: String, required: true }, //L'ancien feedback
    sla: { type: String, required: true, enum: ["IN SLA", "OUT SLA"] },
    nextfeedback: { type: String, required: true }, //Le nouveau feedback;
    submitedBy: { type: String, required: true }, //L'agent qui soumet le nextfeedback
    poste: { type: String, required: true }, //Le poste de l'agent qui soumet le feedback
    departement: { type: String, required: true }, //Le departement de l'agent qui soumet le feedback
    commentaire: { type: String, required: false },
  },
  { timestamps: true }
);
const schema = new mongoose.Schema(
  {
    codeclient: {
      type: String,
      required: true,
      min: 12,
      max: 12,
      uppercase: true,
      trim: true,
    },
    nomclient: { type: String, required: true, uppercase: true, trim: true },
    month: { type: String, required: true },
    shop: { type: String, required: true },
    par: { type: String, required: true },
    region: { type: String, required: true },
    actif: { type: Boolean, required: true, default: true },
    dateupdate: { type: Date, required: true },
    currentFeedback: {
      type: String,
      required: true,
      default: "Categorisation",
    },
    appel: { type: String, required: false },
    fullDate: { type: Date, required: true, default: new Date() },
    //changeto contient le nouveau statut
    feedback: {
      type: String,
      required: true,
      enum: ["PENDING", "REJECTED", "APPROVED", "SUCCESS"],
      default: "SUCCESS",
      uppercase: true,
    },
    changeto: { type: String, required: false },
    submitedBy: { type: String, required: true },
    action: {
      type: String,
      required: true,
      enum: ["NO_ACTION", "REACTIVATION", "REPOSSESSION"],
      default: "NO_ACTION",
      uppercase: true,
    },
    visite: { type: String, required: false },
    //Decision
    statut_decision: {
      type: String,
      required: true,
      enum: ["WRITE_OFF", "OPT_OUT", "A_RECONDUIRE", "TRACKING_ONGOING"],
      default: "TRACKING_ONGOING",
      uppercase: true,
    },

    historique: { type: [historique], required: false },
    sat: { type: String, required: true },
    cashattendu: { type: Number, required: true },
    cashPayer: { type: Number, required: true },
  },
  { timestamps: true }
);
schema.index({ codeclient: 1, month: -1 }, { unique: true });
schema.index({ shop: 1 });
schema.index({ region: 1 });
schema.index({ currentFeedback: 1 });
const model = mongoose.model("tClient", schema);
module.exports = model;
