const mongoose = require("mongoose");

const Message = new mongoose.Schema({
  codeAgent: { type: String, required: true },
  data: { type },
});

const schema = new mongoose.Schema(
  {
    categorie: {
      type: String,
      required: true,
      enum: ["staff", "agent_terrain"],
    },
    message: { type: [Message], required: true },
    savedby: { type: String, required: true },
    vu_par: { type: [String], required: false },
    idMessage: { type: String, required: true },
    title: { type: String, required: true },
  },
  { timestamps: true }
);
const model = mongoose.model("message_column", schema);
module.exports = model;
