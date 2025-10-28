require("dotenv").config();
const mongoose = require("mongoose");
const seedData = require("./seedData");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGO_URL || "mongodb://localhost:27017/doctor_appointment"
    );
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error("Database connection error:", error.message);
    process.exit(1);
  }
};

const runSeed = async () => {
  await connectDB();
  await seedData();
  process.exit(0);
};

runSeed();
