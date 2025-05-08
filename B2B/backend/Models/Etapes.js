const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    id: { type: String, required: true, unique: true },
    deedline: { type: Number, required: true },
    concerne: { type: String, required: true, enum: ["projet", "prospect"] },
  },
  { timestamps: true }
);
const model = mongoose.model("etape", schema);
module.exports = model;
