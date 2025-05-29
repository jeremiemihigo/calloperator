const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    concerne: { type: String, required: true },
    idAction: { type: String, required: true },
    depense: { type: String, trim: true, required: true },
    cout: { type: Number, required: true },
    savedby: { type: String, required: true },
  },
  { timestamps: true }
);
const model = mongoose.model("cout", schema);
module.exports = model;
