const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    subject: { type: String, required: true, trim: true },
    semester: { type: Number, required: true },
    marksObtained: { type: Number, required: true, min: 0 },
    maxMarks: { type: Number, required: true, default: 100 },
    grade: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Result", resultSchema);
