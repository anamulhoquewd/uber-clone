import mongoose from "mongoose";

const rideSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    captain: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    pickup: {
      type: String,
      required: true,
    },
    dropoff: {
      type: String,
      required: true,
    },
    distance: {
      text: String,
      value: Number,
    }, // in meters
    duration: {
      text: String,
      value: Number,
    }, // in seconds
    fare: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "ongoing", "completed", "cancelled"],
      default: "pending",
    },

    paymentId: {
      type: String,
    },
    orderId: {
      type: String,
    },
    signature: {
      type: String,
    },

    otp: {
      type: Number,
      required: true,
      select: false,
    },
  },
  { timestamps: true },
);

export const Ride = mongoose.model("Ride", rideSchema);
