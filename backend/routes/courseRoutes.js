const express = require("express");
const {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").get(protect, getCourses).post(protect, adminOnly, createCourse);
router
  .route("/:id")
  .put(protect, adminOnly, updateCourse)
  .delete(protect, adminOnly, deleteCourse);

module.exports = router;
