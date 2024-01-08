const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
    },
    phone: {
      type: String,
    },
    wallet: {
      type: Number,
      default: 0,
    },
    email: {
      type: String,
      unique: true,
    },
    password: { type: String },
    profileImage: { type: String },
    isDelete: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    passwordToken: {
      type: String,
    },
    verificationOtp: {
      type: String,
    },
    passwordTokenExpirationDate: {
      type: Date,
    },
    verified: { type: Date, default: Date.now() },
  },
  { timestamps: true }
)

const user = mongoose.model("User", userSchema, "user")

module.exports = { User: user }
