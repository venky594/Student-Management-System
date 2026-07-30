const asyncHandler = require("express-async-handler");
const Result = require("../models/Result");

const computeGrade = (percentage) => {
  if (percentage >= 90) return "A+";
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B";
  if (percentage >= 60) return "C";
  if (percentage >= 50) return "D";
  return "F";
};

// @desc Add a result entry
// @route POST /api/results
const addResult = asyncHandler(async (req, res) => {
  const { student, subject, semester, marksObtained, maxMarks = 100 } = req.body;
  const percentage = (marksObtained / maxMarks) * 100;

  const result = await Result.create({
    student,
    subject,
    semester,
    marksObtained,
    maxMarks,
    grade: computeGrade(percentage),
  });

  res.status(201).json(result);
});

// @desc Get results for a student
// @route GET /api/results/student/:studentId
const getStudentResults = asyncHandler(async (req, res) => {
  const results = await Result.find({ student: req.params.studentId }).sort({ semester: 1 });
  res.json(results);
});

module.exports = { addResult, getStudentResults };
