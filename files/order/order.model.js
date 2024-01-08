const mongoose = require("mongoose")

const OrderSchema = new mongoose.Schema(
  {
    orderId: { type: String },
    trackingId: { type: String },
    amount: { type: Number },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    riderId: {
      type: mongoose.Types.ObjectId,
      ref: "Rider",
    },
    addressDetails: {
      houseNumber: Number,
      landMark: String,
      contactNumber: String,
    },
    receiverDetails: {
      name: String,
      phone: String,
      address: String,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "cancelled",
        "on-going",
        "successful",
        "accepted",
        "rejected",
      ],
      default: "pending",
    },
    deliveryService: {
      type: String,
      enum: ["standard", "bulk", "neutral"],
      default: "neutral",
    },
    deliveryOption: {
      type: String,
      enum: ["express", "normal"],
      default: "normal",
    },
    orderRating: {
      rate: Number,
      comment: String,
    },
    isDelete: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

const order = mongoose.model("Order", OrderSchema, "order")

module.exports = { Order: order }
