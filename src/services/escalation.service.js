const Request = require("../models/request.model");

const checkAndEscalate = async () => {
  try {
    const now = new Date();

    // Find all pending requests where SLA has passed
    const overdueRequests = await Request.find({
      status: { $in: ["pending", "approved_by_manager", "approved_by_hr"] },
      slaDeadline: { $lt: now },
      isEscalated: false,
    });

    for (const request of overdueRequests) {
      request.isEscalated = true;
      request.status = "escalated";

      request.approvalMatrix.push({
        level: request.currentLevel,
        role: "system",
        action: "escalated",
        comment: "Auto-escalated due to SLA breach (48hrs)",
        actionAt: now,
        ipAddress: "system",
      });

      await request.save();
      console.log(`⚠️ Request ${request._id} escalated due to SLA breach`);
    }

  } catch (error) {
    console.error("Escalation error:", error.message);
  }
};

module.exports = { checkAndEscalate };