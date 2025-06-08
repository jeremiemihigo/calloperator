const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    commentaire: { type: String, required: true, trim: true },
    id: { type: String, required: true },
    concerne: { type: String, required: true },
    doby: { type: String, required: true },
    vu: { type: [String], required: false },
  },
  { timestamps: true }
);
schema.index({ id: 1 });
schema.index({ concerne: 1 });
const model = mongoose.model("commentaire", schema);
module.exports = model;
