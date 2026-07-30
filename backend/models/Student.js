const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    rollNo: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    dob: { type: Date },
    gender: { type: String, enum: ["male", "female", "other"], default: "other" },
    address: { type: String, trim: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    semester: { type: Number, default: 1, min: 1, max: 12 },
    status: { type: String, enum: ["active", "inactive", "graduated"], default: "active" },
    guardianName: { type: String, trim: true },
    guardianPhone: { type: String, trim: true },
  },
  { timestamps: true }
);

studentSchema.index({ name: "text", rollNo: "text", email: "text" });

module.exports = mongoose.model("Student", studentSchema);
