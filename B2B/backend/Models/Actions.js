const mongoose = require("mongoose");
const ModelProjet = require("./Projet");

const schema = new mongoose.Schema({
  action: { type: String, required: true },
  id: { type: String, required: true },
  concerne: { type: String, required: true },
  dateSave: { type: Date, required: true },
  next_step: { type: String, required: true },
  statut_actuel: { type: String, required: true },
  savedBy: { type: String, required: true },
  deedline: { type: String, required: false, enum: ["IN SLA", "OUT SLA"] },
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
