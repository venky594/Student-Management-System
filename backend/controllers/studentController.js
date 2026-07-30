const asyncHandler = require("express-async-handler");
const Student = require("../models/Student");

// @desc Get all students (search, filter by course/status, pagination)
// @route GET /api/students
const getStudents = asyncHandler(async (req, res) => {
  const { search = "", course, status, page = 1, limit = 10 } = req.query;

  const query = {};
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { rollNo: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }
  if (course) query.course = course;
  if (status) query.status = status;

  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const limitNum = Math.max(parseInt(limit, 10) || 10, 1);

  const [students, total] = await Promise.all([
    Student.find(query)
      .populate("course", "name code department")
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Student.countDocuments(query),
  ]);

  res.json({
    students,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum) || 1,
  });
});

// @desc Get single student
// @route GET /api/students/:id
const getStudentById = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id).populate("course");
  if (!student) {
    res.status(404);
    throw new Error("Student not found");
  }
  res.json(student);
});

// @desc Create student
// @route POST /api/students
const createStudent = asyncHandler(async (req, res) => {
  const student = await Student.create(req.body);
  res.status(201).json(student);
});

// @desc Update student
// @route PUT /api/students/:id
const updateStudent = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (!student) {
    res.status(404);
    throw new Error("Student not found");
  }
  Object.assign(student, req.body);
  const updated = await student.save();
  res.json(updated);
});

// @desc Delete student
// @route DELETE /api/students/:id
const deleteStudent = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (!student) {
    res.status(404);
    throw new Error("Student not found");
  }
  await student.deleteOne();
  res.json({ message: "Student removed" });
});

module.exports = {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
};
