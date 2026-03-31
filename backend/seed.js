const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const { Faculty, Product, Event } = require('./models');

dotenv.config();

const facultyData = [
  { name: "Sunitha BJ", department: "Computer Science", cabin: "LGW34", location: "L Block Ground Floor Workstation 34", status: "Available", image: "https://x-sg-file.oss-cn-hongkong.aliyuncs.com/file/2026/03/31/6f9d7f6b-1b2c-4e5f-8e4a-5d6c7b8a9d0e.png" },
  { name: "Bikram Sarkar", department: "Information Science", cabin: "LGW10", location: "L Block Workstation 10", status: "In Class", image: "https://x-sg-file.oss-cn-hongkong.aliyuncs.com/file/2026/03/31/6f9d7f6b-1b2c-4e5f-8e4a-5d6c7b8a9d0e.png" },
  { name: "Mohideen", department: "Electronics", cabin: "S12", location: "S Block Workstation 12", status: "Busy", image: "https://x-sg-file.oss-cn-hongkong.aliyuncs.com/file/2026/03/31/6f9d7f6b-1b2c-4e5f-8e4a-5d6c7b8a9d0e.png" },
  { name: "Ananya Rao", department: "AI & ML", cabin: "L201", location: "L Block 2nd Floor Room 201", status: "Available", image: "https://x-sg-file.oss-cn-hongkong.aliyuncs.com/file/2026/03/31/6f9d7f6b-1b2c-4e5f-8e4a-5d6c7b8a9d0e.png" },
  { name: "Rahul Verma", department: "Mechanical", cabin: "M105", location: "M Block Room 105", status: "In Class", image: "https://x-sg-file.oss-cn-hongkong.aliyuncs.com/file/2026/03/31/6f9d7f6b-1b2c-4e5f-8e4a-5d6c7b8a9d0e.png" },
  { name: "Priya Nair", department: "Civil", cabin: "C210", location: "C Block Room 210", status: "Available", image: "https://x-sg-file.oss-cn-hongkong.aliyuncs.com/file/2026/03/31/6f9d7f6b-1b2c-4e5f-8e4a-5d6c7b8a9d0e.png" },
  { name: "Karthik Reddy", department: "Electrical", cabin: "E115", location: "E Block Room 115", status: "Busy", image: "https://x-sg-file.oss-cn-hongkong.aliyuncs.com/file/2026/03/31/6f9d7f6b-1b2c-4e5f-8e4a-5d6c7b8a9d0e.png" },
  { name: "Sneha Iyer", department: "Mathematics", cabin: "MATH12", location: "Math Block Room 12", status: "Available", image: "https://x-sg-file.oss-cn-hongkong.aliyuncs.com/file/2026/03/31/6f9d7f6b-1b2c-4e5f-8e4a-5d6c7b8a9d0e.png" },
  { name: "Arjun Singh", department: "Physics", cabin: "PHY08", location: "Physics Lab Room 8", status: "In Class", image: "https://x-sg-file.oss-cn-hongkong.aliyuncs.com/file/2026/03/31/6f9d7f6b-1b2c-4e5f-8e4a-5d6c7b8a9d0e.png" },
  { name: "Neha Sharma", department: "Chemistry", cabin: "CHEM05", location: "Chemistry Lab Room 5", status: "Available", image: "https://x-sg-file.oss-cn-hongkong.aliyuncs.com/file/2026/03/31/6f9d7f6b-1b2c-4e5f-8e4a-5d6c7b8a9d0e.png" },
  { name: "Vivek Kumar", department: "Data Science", cabin: "DS101", location: "Data Science Lab 1", status: "Busy", image: "https://x-sg-file.oss-cn-hongkong.aliyuncs.com/file/2026/03/31/6f9d7f6b-1b2c-4e5f-8e4a-5d6c7b8a9d0e.png" },
  { name: "Kavya Shetty", department: "Biotechnology", cabin: "BIO07", location: "Bio Lab Room 7", status: "Available", image: "https://x-sg-file.oss-cn-hongkong.aliyuncs.com/file/2026/03/31/6f9d7f6b-1b2c-4e5f-8e4a-5d6c7b8a9d0e.png" }
];

const productsData = [
  { name: "Double Cheese Burger", category: "Food", price: 120, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500" },
  { name: "Masala Dosa", category: "Food", price: 60, image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500" },
  { name: "Cold Coffee", category: "Food", price: 80, image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500" },
  { name: "A4 Paper Pack (100)", category: "Stationery", price: 150, image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=500" },
  { name: "Blue Ball Point Pen", category: "Stationery", price: 10, image: "https://images.unsplash.com/photo-1585336139118-132f70e456ef?w=500" },
  { name: "Spiral Notebook", category: "Stationery", price: 75, image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=500" }
];

const eventsData = [
  { title: "Hackathon 2024", date: new Date("2024-05-15"), description: "24-hour coding marathon", venue: "Computer Lab 1" },
  { title: "Music Fest", date: new Date("2024-06-20"), description: "Annual campus music festival", venue: "Open Amphitheatre" },
  { title: "AI Workshop", date: new Date("2024-04-10"), description: "Hands-on Generative AI workshop", venue: "Seminar Hall 2" }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/easycampus');
    
    // Clear existing data
    await User.deleteMany({});
    await Faculty.deleteMany({});
    await Product.deleteMany({});
    await Event.deleteMany({});

    // Add Admin
    const admin = new User({
      name: "Admin User",
      email: "admin@easycampus.com",
      password: "adminpassword123",
      role: "admin"
    });
    await admin.save();

    // Add Student
    const student = new User({
      name: "Kishore Student",
      email: "student@easycampus.com",
      password: "studentpassword123",
      role: "student"
    });
    await student.save();

    // Add Faculty
    await Faculty.insertMany(facultyData);

    // Add Products
    await Product.insertMany(productsData);

    // Add Events
    await Event.insertMany(eventsData);

    console.log("Database Seeded Successfully!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();
