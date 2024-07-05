const mongoose = require("mongoose");

const ReferSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    course: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const ReferralModel = mongoose.model("referral", ReferSchema);

module.exports = ReferralModel;
