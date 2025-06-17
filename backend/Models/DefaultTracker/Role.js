const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    idRole: { type: String, unique: true, required: true },
    title: { type: String, required: true },
  },
  { timestamps: true }
);
schema.index({ idRole: 1 });
const model = mongoose.model("role", schema);
module.exports = model;
