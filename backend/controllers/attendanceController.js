const asyncHandler = require("express-async-handler");
const Attendance = require("../models/Attendance");

// @desc Mark attendance for a student on a date (upsert)
// @route POST /api/attendance
const markAttendance = asyncHandler(async (req, res) => {
  const { student, date, status, remarks } = req.body;

  const record = await Attendance.findOneAndUpdate(
    { student, date },
    { student, date, status, remarks },
    { new: true, upsert: true, runValidators: true }
  );

  res.status(201).json(record);
});

// @desc Get attendance records for a student
// @route GET /api/attendance/student/:studentId
const getStudentAttendance = asyncHandler(async (req, res) => {
  const records = await Attendance.find({ student: req.params.studentId }).sort({ date: -1 });
  res.json(records);
});

// @desc Get attendance for a given date across all students
// @route GET /api/attendance/date/:date
const getAttendanceByDate = asyncHandler(async (req, res) => {
  const date = new Date(req.params.date);
  const records = await Attendance.find({ date }).populate("student", "name rollNo");
  res.json(records);
});

module.exports = { markAttendance, getStudentAttendance, getAttendanceByDate };
