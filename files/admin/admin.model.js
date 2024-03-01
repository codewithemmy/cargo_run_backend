const mongoose = require("mongoose")

const AdminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: String,
    isDeleted: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      default: "admin",
    },
    type: {
      type: String,
      required: true,
      enum: ["super-admin", "regular"],
      default: "regular",
    },
  },
  { timestamps: true }
)

const admin = mongoose.model("Admin", AdminSchema, "admin")

module.exports = { Admin: admin }
