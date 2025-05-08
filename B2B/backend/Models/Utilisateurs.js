const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true, uppercase: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    permission: { type: [String], required: true },
    active: { type: Boolean, required: true, default: true },
    first: { type: Boolean, required: true, default: true },
  },
  { timestamps: true }
);
schema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

schema.methods.matchPasswords = async function (password) {
  return await bcrypt.compare(password, this.password);
};

schema.methods.getSignedToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};
const model = mongoose.model("utilisateur", schema);
module.exports = model;
