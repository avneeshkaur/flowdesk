const Request = require("../models/request.model");

// ✅ Submit new request
exports.submitRequest = async (req, res) => {
  try {
    const { title, description, type, startDate, endDate } = req.body;

    const slaDeadline = new Date();
    slaDeadline.setHours(slaDeadline.getHours() + 48);

    const request = await Request.create({
      title,
      description,
      type,
      requestedBy: req.user.id,
      startDate,
      endDate,
      slaDeadline,
    });

    res.status(201).json({
      message: "Request submitted successfully",
      request,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get my requests
exports.getMyRequests = async (req, res) => {
  try {
    const requests = await Request.find({ requestedBy: req.user.id })
      .sort({ createdAt: -1 });

    res.json({ requests });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get all requests (manager/hr/admin)
exports.getAllRequests = async (req, res) => {
  try {
    const requests = await Request.find()
      .populate("requestedBy", "name email role")
      .sort({ createdAt: -1 });

    res.json({ requests });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Approve or Reject request
exports.actionOnRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, comment } = req.body;
    const userRole = req.user.role;

    const request = await Request.findById(id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.status === "approved" || request.status === "rejected") {
      return res.status(400).json({ message: "Request already finalized" });
    }

    // Role to level mapping
    const roleLevel = { manager: 1, hr: 2, admin: 3 };
    const userLevel = roleLevel[userRole];

    if (!userLevel) {
      return res.status(403).json({ message: "Not authorized to take action" });
    }

    if (userLevel !== request.currentLevel) {
      return res.status(403).json({ message: `Not your turn. Current level: ${request.currentLevel}` });
    }

    // Get IP address
    const ipAddress = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    // Push to approval matrix (audit trail)
    request.approvalMatrix.push({
      level: userLevel,
      role: userRole,
      approvedBy: req.user.id,
      action,
      comment,
      actionAt: new Date(),
      ipAddress,
    });

    if (action === "rejected") {
      request.status = "rejected";
    } else if (action === "approved") {
      if (userLevel === 1) {
        request.status = "approved_by_manager";
        request.currentLevel = 2;
        // Reset SLA for next level
        const newSla = new Date();
        newSla.setHours(newSla.getHours() + 48);
        request.slaDeadline = newSla;
      } else if (userLevel === 2) {
        request.status = "approved_by_hr";
        request.currentLevel = 3;
        const newSla = new Date();
        newSla.setHours(newSla.getHours() + 48);
        request.slaDeadline = newSla;
      } else if (userLevel === 3) {
        request.status = "approved";
      }
    }

    await request.save();

    res.json({
      message: `Request ${action} successfully`,
      request,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get single request with full timeline
exports.getRequestById = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate("requestedBy", "name email role")
      .populate("approvalMatrix.approvedBy", "name email role");

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.json({ request });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Dashboard analytics
exports.getDashboard = async (req, res) => {
  try {
    const total = await Request.countDocuments();
    const pending = await Request.countDocuments({ status: "pending" });
    const approved = await Request.countDocuments({ status: "approved" });
    const rejected = await Request.countDocuments({ status: "rejected" });
    const escalated = await Request.countDocuments({ isEscalated: true });

    res.json({
      dashboard: { total, pending, approved, rejected, escalated },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};