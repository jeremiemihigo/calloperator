const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  idPlainte: { type: String, required: true },
  title: { type: String, required: true },
  id: { type: String, required: true },
});
const model = mongoose.model("typeplainte", schema);
module.exports = model;
