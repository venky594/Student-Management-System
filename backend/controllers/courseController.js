const asyncHandler = require("express-async-handler");
const Course = require("../models/Course");
const Student = require("../models/Student");

// @desc Get all courses
// @route GET /api/courses
const getCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find().sort({ name: 1 });
  res.json(courses);
});

// @desc Create course
// @route POST /api/courses
const createCourse = asyncHandler(async (req, res) => {
  const course = await Course.create(req.body);
  res.status(201).json(course);
});

// @desc Update course
// @route PUT /api/courses/:id
const updateCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    res.status(404);
    throw new Error("Course not found");
  }
  Object.assign(course, req.body);
  const updated = await course.save();
  res.json(updated);
});

// @desc Delete course (blocked if students are enrolled)
// @route DELETE /api/courses/:id
const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    res.status(404);
    throw new Error("Course not found");
  }
  const enrolledCount = await Student.countDocuments({ course: course._id });
  if (enrolledCount > 0) {
    res.status(400);
    throw new Error(`Cannot delete: ${enrolledCount} student(s) enrolled in this course`);
  }
  await course.deleteOne();
  res.json({ message: "Course removed" });
});

module.exports = { getCourses, createCourse, updateCourse, deleteCourse };
