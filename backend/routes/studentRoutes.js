const express = require("express");
const {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
} = require("../controllers/studentController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").get(protect, getStudents).post(protect, createStudent);
router
  .route("/:id")
  .get(protect, getStudentById)
  .put(protect, updateStudent)
  .delete(protect, adminOnly, deleteStudent);

module.exports = router;
