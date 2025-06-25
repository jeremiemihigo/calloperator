const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    codeclient: { type: String, required: true, trim: true, uppercase: true },
    customer_name: { type: String, required: true },
    region: { type: String, required: true },
    shop: { type: String, required: true },
    status: {
      type: String,
      required: true,
      default: "Awaiting_verification",
      enum: ["Awaiting_verification", "Confirmed"],
    },
    change_by: { type: String, required: false },
  },
  { timestamps: true }
);
