const mongoose = require("mongoose");

const valueSelect = new mongoose.Schema({
  question: { type: String, required: true, trim: true },
  required: { type: Boolean, required: true, default: false },
  id: { type: String, required: true, unique: true },
  allItems: { type: Array, required: false },
  type: {
    type: String,
    required: true,
    default: "text",
    enum: ["select_one", "select_many", "text", "date"],
  },
});

const schema = new mongoose.Schema(
  {
    question: { type: String, required: true, trim: true },
    required: { type: Boolean, required: true, default: false },
    idFormulaire: { type: String, required: true },
    id: { type: String, required: true, unique: true },
    type: {
      type: String,
      required: true,
      enum: ["select_one", "select_many", "text", "date"],
    },
    valueSelect: { type: [valueSelect], required: false },
    editedBy: { type: String, required: false },
    savedBy: { type: String, required: true },
  },
  { timestamps: true }
);
const model = mongoose.model("pquestion", schema);
module.exports = model;
