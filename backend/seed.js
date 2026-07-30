require("dotenv").config();
const connectDB = require("./config/db");
const User = require("./models/User");
const Course = require("./models/Course");

const run = async () => {
  await connectDB();

  const adminEmail = "admin@school.com";
  const existingAdmin = await User.findOne({ email: adminEmail });
  if (!existingAdmin) {
    await User.create({
      name: "Admin",
      email: adminEmail,
      password: "admin123",
      role: "admin",
    });
    console.log(`Created admin user: ${adminEmail} / admin123`);
  } else {
    console.log("Admin user already exists, skipping.");
  }

  const sampleCourses = [
    { name: "Computer Science", code: "CS101", department: "Engineering", durationYears: 4 },
    { name: "Business Administration", code: "BBA101", department: "Management", durationYears: 3 },
    { name: "Electronics Engineering", code: "EC101", department: "Engineering", durationYears: 4 },
  ];

  for (const c of sampleCourses) {
    const exists = await Course.findOne({ code: c.code });
    if (!exists) {
      await Course.create(c);
      console.log(`Created course: ${c.code}`);
    }
  }

  console.log("Seeding complete.");
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
