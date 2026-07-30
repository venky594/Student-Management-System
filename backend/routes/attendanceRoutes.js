const express = require("express");
const {
  markAttendance,
  getStudentAttendance,
  getAttendanceByDate,
} = require("../controllers/attendanceController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, markAttendance);
router.get("/student/:studentId", protect, getStudentAttendance);
router.get("/date/:date", protect, getAttendanceByDate);

module.exports = router;
