const express = require("express");
const { addResult, getStudentResults } = require("../controllers/resultController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, addResult);
router.get("/student/:studentId", protect, getStudentResults);

module.exports = router;
