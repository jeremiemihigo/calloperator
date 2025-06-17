const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  idDepartement: { type: String, required: true },
  id: { type: String, required: true, unique: true },
  filterby: {
    type: String,
    required: true,
    enum: ["shop", "region", "overall"],
  },
  title: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
  },
});
schema.index({ id: 1 });
const model = mongoose.model("poste", schema);
module.exports = model;
