const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const requestController = require("../controllers/request.controller");

// Employee routes
router.post("/submit", authMiddleware, requestController.submitRequest);
router.get("/my", authMiddleware, requestController.getMyRequests);
router.get("/:id", authMiddleware, requestController.getRequestById);

// Manager/HR/Admin routes
router.get("/", authMiddleware, roleMiddleware("manager", "hr", "admin"), requestController.getAllRequests);
router.patch("/:id/action", authMiddleware, roleMiddleware("manager", "hr", "admin"), requestController.actionOnRequest);

// Admin/HR dashboard
router.get("/dashboard/stats", authMiddleware, roleMiddleware("hr", "admin"), requestController.getDashboard);

module.exports = router;