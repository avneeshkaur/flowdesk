const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["leave", "expense", "wfh", "overtime"],
      required: true,
    },
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved_by_manager", "approved_by_hr", "approved", "rejected", "escalated"],
      default: "pending",
    },
    currentLevel: {
      type: Number,
      default: 1, // 1=Manager, 2=HR, 3=Admin
    },
    approvalMatrix: [
      {
        level: Number,
        role: String,
        approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        action: { type: String, enum: ["approved", "rejected", "escalated"] },
        comment: String,
        actionAt: Date,
        ipAddress: String,
      },
    ],
    slaDeadline: {
      type: Date, // 48hrs se auto set hoga
    },
    isEscalated: {
      type: Boolean,
      default: false,
    },
    startDate: Date, // leave ke liye
    endDate: Date,   // leave ke liye
  },
  { timestamps: true }
);

module.exports = mongoose.model("Request", requestSchema);
