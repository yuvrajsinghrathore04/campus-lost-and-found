const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const User = require("./models/User");

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("MongoDB Connected");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: "yuvrajsinghrathore0406@gmail.com" });

    if (existingAdmin) {
      console.log("Admin user already exists!");
      console.log("Email: rathoreyuvraj293@gmail.com");
      console.log("Password: yuvraj0011");
      process.exit(0);
    }

    // Create admin user
    const adminUser = await User.create({
      name: "Yuvi",
      email: "yuvrajsinghrathore0406@gmail.com",
      password: "yuvraj0420",
      role: "admin",
      phone: "8209559068",
    });

    console.log("========================================");
    console.log("  Admin user created successfully!");
    console.log("========================================");
    console.log("  Email:    yuvrajsinghrathore0406@gmail.com");
    console.log("  Password: yuvraj0420");
    console.log("  Role:     admin");
    console.log("========================================");

    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error.message);
    process.exit(1);
  }
};

seedAdmin();