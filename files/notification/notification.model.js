const mongoose = require("mongoose")

const NotificationSchema = new mongoose.Schema(
  {
    userType: {
      type: String,
      enum: ["User", "Rider"],
    },
    userId: {
      type: mongoose.Types.ObjectId,
      refType: "userType",
    },
    recipientId: {
      type: mongoose.Types.ObjectId,
      refType: "userType",
    },
    title: {
      type: String,
    },
    message: {
      type: String,
    },
    status: {
      type: String,
      enum: ["new", "read"],
      default: "new",
    },
    recipient: {
      type: String,
      enum: ["admin"],
    },
  },
  { timestamps: true }
)

const notification = mongoose.model(
  "Notification",
  NotificationSchema,
  "notification"
)

module.exports = { Notification: notification }
