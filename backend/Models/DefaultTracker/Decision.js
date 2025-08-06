const mongoose = require("mongoose");
const ModelClient = require("./TableClient");

const schemaComment = new mongoose.Schema(
  {
    commentaire: { type: String, required: true, trim: true },
    sendby: { type: String, required: true },
  },
  { timestamps: true }
);

const schema = new mongoose.Schema(
  {
    decision: { type: String, required: true },
    createdBy: { type: String, required: true },
    codeclient: { type: String, required: true },
    region: { type: String, required: true },
    id: { type: mongoose.Schema.Types.ObjectId, required: true },
    shop: { type: String, required: true },
    comment: { type: String, required: false },
    month: { type: String, required: true },
    statut: {
      type: String,
      required: true,
      enum: ["PENDING", "APPROVED", "REJECTED", "VERIFICATION"],
      default: "PENDING",
      uppercase: true,
    },
    commentaire: { type: [schemaComment], required: false },
    idDepartement: { type: String, required: true },
    verifiedby: { type: String, required: false },
  },
  { timestamps: true }
);
schema.post("save", function (docs, next) {
  ModelClient.findOneAndUpdate(
    {
      codeclient: docs.codeclient,
      month: docs.month,
    },
    { $set: { idDecision: docs.id } }
  ).then(() => {
    next();
  });
});
schema.index({ shop: 1 });
schema.index({ region: 1 });
schema.index({ month: 1, codeclient: 1 }, { unique: true });

const model = mongoose.model("decision", schema);
module.exports = model;
