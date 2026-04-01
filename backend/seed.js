const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const { Faculty, Product, Event } = require('./models');

dotenv.config();

const facultyData = [
  {
    name: "Sunitha BJ", department: "Computer Science", cabin: "LGW34", location: "L Block Ground Floor Workstation 34", status: "Available",
    image: "https://x-sg-file.oss-cn-hongkong.aliyuncs.com/file/2026/03/31/6f9d7f6b-1b2c-4e5f-8e4a-5d6c7b8a9d0e.png",
    email: "sunitha.bj@easycampus.edu", phone: "+91 98765 43210", specialization: "Cloud Computing & AI", experience: "12+ Years", officeHours: "10:00 AM - 12:00 PM"
  },
  {
    name: "Bikram Sarkar", department: "Information Science", cabin: "LGW10", location: "L Block Workstation 10", status: "In Class",
    image: "https://x-sg-file.oss-cn-hongkong.aliyuncs.com/file/2026/03/31/6f9d7f6b-1b2c-4e5f-8e4a-5d6c7b8a9d0e.png",
    email: "bikram.sarkar@easycampus.edu", phone: "+91 98765 43211", specialization: "Web Technologies", experience: "15+ Years", officeHours: "02:00 PM - 04:00 PM"
  },
  {
    name: "Mohideen", department: "Electronics", cabin: "S12", location: "S Block Workstation 12", status: "Busy",
    image: "https://x-sg-file.oss-cn-hongkong.aliyuncs.com/file/2026/03/31/6f9d7f6b-1b2c-4e5f-8e4a-5d6c7b8a9d0e.png",
    email: "mohideen@easycampus.edu", phone: "+91 98765 43212", specialization: "Embedded Systems", experience: "20+ Years", officeHours: "11:00 AM - 01:00 PM"
  },
  {
    name: "Ananya Rao", department: "AI & ML", cabin: "L201", location: "L Block 2nd Floor Room 201", status: "Available",
    image: "https://x-sg-file.oss-cn-hongkong.aliyuncs.com/file/2026/03/31/6f9d7f6b-1b2c-4e5f-8e4a-5d6c7b8a9d0e.png",
    email: "ananya.rao@easycampus.edu", phone: "+91 98765 43213", specialization: "Deep Learning", experience: "8+ Years", officeHours: "09:00 AM - 11:00 AM"
  },
  {
    name: "Rahul Verma", department: "Mechanical", cabin: "M105", location: "M Block Room 105", status: "In Class",
    image: "https://x-sg-file.oss-cn-hongkong.aliyuncs.com/file/2026/03/31/6f9d7f6b-1b2c-4e5f-8e4a-5d6c7b8a9d0e.png",
    email: "rahul.verma@easycampus.edu", phone: "+91 98765 43214", specialization: "Thermodynamics", experience: "10+ Years", officeHours: "03:00 PM - 05:00 PM"
  },
  {
    name: "Priya Nair", department: "Civil", cabin: "C210", location: "C Block Room 210", status: "Available",
    image: "https://x-sg-file.oss-cn-hongkong.aliyuncs.com/file/2026/03/31/6f9d7f6b-1b2c-4e5f-8e4a-5d6c7b8a9d0e.png",
    email: "priya.nair@easycampus.edu", phone: "+91 98765 43215", specialization: "Structural Engineering", experience: "9+ Years", officeHours: "10:30 AM - 12:30 PM"
  },
  {
    name: "Karthik Reddy", department: "Electrical", cabin: "E115", location: "E Block Room 115", status: "Busy",
    image: "https://x-sg-file.oss-cn-hongkong.aliyuncs.com/file/2026/03/31/6f9d7f6b-1b2c-4e5f-8e4a-5d6c7b8a9d0e.png",
    email: "karthik.reddy@easycampus.edu", phone: "+91 98765 43216", specialization: "Power Systems", experience: "14+ Years", officeHours: "01:00 PM - 03:00 PM"
  },
  {
    name: "Sneha Iyer", department: "Mathematics", cabin: "MATH12", location: "Math Block Room 12", status: "Available",
    image: "https://x-sg-file.oss-cn-hongkong.aliyuncs.com/file/2026/03/31/6f9d7f6b-1b2c-4e5f-8e4a-5d6c7b8a9d0e.png",
    email: "sneha.iyer@easycampus.edu", phone: "+91 98765 43217", specialization: "Applied Mathematics", experience: "11+ Years", officeHours: "11:00 AM - 01:00 PM"
  },
  {
    name: "Arjun Singh", department: "Physics", cabin: "PHY08", location: "Physics Lab Room 8", status: "In Class",
    image: "https://x-sg-file.oss-cn-hongkong.aliyuncs.com/file/2026/03/31/6f9d7f6b-1b2c-4e5f-8e4a-5d6c7b8a9d0e.png",
    email: "arjun.singh@easycampus.edu", phone: "+91 98765 43218", specialization: "Quantum Physics", experience: "13+ Years", officeHours: "02:30 PM - 04:30 PM"
  },
  {
    name: "Neha Sharma", department: "Chemistry", cabin: "CHEM05", location: "Chemistry Lab Room 5", status: "Available",
    image: "https://x-sg-file.oss-cn-hongkong.aliyuncs.com/file/2026/03/31/6f9d7f6b-1b2c-4e5f-8e4a-5d6c7b8a9d0e.png",
    email: "neha.sharma@easycampus.edu", phone: "+91 98765 43219", specialization: "Organic Chemistry", experience: "7+ Years", officeHours: "09:30 AM - 11:30 AM"
  },
  {
    name: "Vivek Kumar", department: "Data Science", cabin: "DS101", location: "Data Science Lab 1", status: "Busy",
    image: "https://x-sg-file.oss-cn-hongkong.aliyuncs.com/file/2026/03/31/6f9d7f6b-1b2c-4e5f-8e4a-5d6c7b8a9d0e.png",
    email: "vivek.kumar@easycampus.edu", phone: "+91 98765 43220", specialization: "Machine Learning", experience: "16+ Years", officeHours: "03:30 PM - 05:30 PM"
  },
  {
    name: "Kavya Shetty", department: "Biotechnology", cabin: "BIO07", location: "Bio Lab Room 7", status: "Available",
    image: "https://x-sg-file.oss-cn-hongkong.aliyuncs.com/file/2026/03/31/6f9d7f6b-1b2c-4e5f-8e4a-5d6c7b8a9d0e.png",
    email: "kavya.shetty@easycampus.edu", phone: "+91 98765 43221", specialization: "Genetics", experience: "10+ Years", officeHours: "10:00 AM - 12:00 PM"
  }
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
      name: "Campus Administrator",
      email: "admin@gmail.com",
      password: "admin@123",
      role: "admin"
    });
    await admin.save();

    // Add Students (10)
    const students = [
      { name: "Aarav Sharma", email: "aarav.2024cs001@presidencyuniversity.in", dob: "12-05-2003" },
      { name: "Kishore", email: "kishore.20231cse0260@presidencyuniversity.in", dob: "07-03-2005" },
      { name: "Ananya Iyer", email: "ananya.2024cs002@presidencyuniversity.in", dob: "24-08-2003" },
      { name: "Bikram Das", email: "bikram.2024is001@presidencyuniversity.in", dob: "05-11-2002" },
      { name: "Chetan Reddy", email: "chetan.2024me005@presidencyuniversity.in", dob: "15-02-2003" },
      { name: "Divya Nair", email: "divya.2024ai008@presidencyuniversity.in", dob: "30-09-2003" },
      { name: "Eshan Gupta", email: "eshan.2023ec012@presidencyuniversity.in", dob: "11-01-2002" },
      { name: "Farhan Khan", email: "farhan.2024ds003@presidencyuniversity.in", dob: "18-06-2003" },
      { name: "Gauri Patil", email: "gauri.2024cv009@presidencyuniversity.in", dob: "09-03-2003" },
      { name: "Harsh Vardhan", email: "harsh.2024ee015@presidencyuniversity.in", dob: "21-07-2002" },
      { name: "Ishani Bose", email: "ishani.2024bt004@presidencyuniversity.in", dob: "03-12-2003" }
    ];

    for (const s of students) {
      await User.create({
        name: s.name,
        email: s.email,
        password: s.dob, // Using DOB as default password
        role: "student"
      });
    }
    console.log("Admin and Students seeded.");

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
