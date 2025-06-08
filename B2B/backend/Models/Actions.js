const mongoose = require("mongoose");
const ModelProjet = require("./Projet");

const filename = new mongoose.Schema({
  originalname: { type: String, required: true },
  namedb: { type: String, required: true },
});
const schema = new mongoose.Schema({
  action: { type: String, required: true },
  id: { type: String, required: true },
  concerne: { type: String, required: true },
  dateSave: { type: Date, required: true },
  next_step: { type: String, required: true },
  statut_actuel: { type: String, required: true },
  savedBy: { type: String, required: true },
  deedline: { type: Date, required: true },
  commentaire: { type: String, required: false },
  sla: { type: String, required: false, enum: ["IN SLA", "OUT SLA"] },
  filename: { type: [filename], required: false },
  type: {
    type: String,
    required: true,
    enum: ["OPEN", "CLOSE"],
    default: "OPEN",
  },
});
schema.post("save", function (docs, next) {
  try {
    ModelProjet.findOneAndUpdate(
      { id: docs.concerne },
      {
        $set: {
          next_step: docs.next_step,
        },
      }
    ).then(() => {
      next();
    });
  } catch (error) {
    console.log(error);
  }
});
const model = mongoose.model("action", schema);
module.exports = model;
