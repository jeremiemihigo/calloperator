const mongoose = require("mongoose");
const modelDemande = require("./Demande");

const schema = new mongoose.Schema(
  {
    codeclient: {
      type: String,
      required: true,
      trim: true,
      maxlength: 12,
      minlength: 12,
      uppercase: true,
    }, // BDRC
    codeCu: { type: String, required: true },
    clientStatut: { type: String, required: true },
    PayementStatut: { type: String, required: true },
    consExpDays: { type: Number, required: true },
    idDemande: { type: String, required: true, unique: true },
    dateSave: { type: Date, required: true },
    codeAgent: { type: String, required: true },
    nomClient: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    idZone: { type: String, required: true },
    idShop: { type: String, required: true },

    // Ajout
    adresschange: {
      type: String,
      required: true,
      enum: ["Identique", "N'est pas identique"],
    },

    agentSave: {
      nom: { type: String },
    },

    confirmeAdresse: {
      idPlainte: { type: String },
      value: { type: String },
    },

    demandeur: {
      nom: { type: String },
      codeAgent: { type: String },
      fonction: { type: String },
    },

    demande: {
      typeImage: { type: String },
      createdAt: { type: Date },
      numero: { type: String },
      commune: { type: String },
      updatedAt: { type: Date },
      statut: { type: String },
      sector: { type: String },
      lot: { type: String },
      cell: { type: String },
      reference: { type: String },
      itemswap: { type: String },
      sat: { type: String },
      raison: { type: String },
      jours: { type: Number },
      file: { type: String },
    },

    used: { type: Boolean, default: false, required: true },
    paid: { type: Boolean, required: false },

    coordonnee: {
      longitude: { type: String },
      latitude: { type: String },
      altitude: { type: String },
    },
  },
  { timestamps: true }
);

// Indexes
schema.index({ idDemande: 1 });
schema.index({ dateSave: 1 });
schema.index({ "demandeur.codeAgent": 1 });
schema.index(
  { codeclient: 1, "demande.lot": 1, "demandeur.fonction": 1 },
  { unique: true }
);

// Post-save hook
schema.post("save", function (doc, next) {
  modelDemande
    .findOneAndUpdate({ idDemande: doc.idDemande }, { $set: { valide: true } })
    .then(() => next())
    .catch((err) => {
      console.error("Erreur post-save:", err);
      next(err); // Mieux de passer l'erreur
    });
});

const model = mongoose.model("Rapport", schema);
module.exports = model;
