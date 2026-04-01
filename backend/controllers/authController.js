const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // Force role to student for all registrations
    const user = new User({ name, email, password, role: 'student' });
    await user.save();
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check for hardcoded admin credentials first
    if (email === "admin@gmail.com" && password === "admin@123") {
      // Find if admin user exists, or create a mock one for token generation
      let admin = await User.findOne({ email: "admin@gmail.com", role: "admin" });
      if (!admin) {
        // Create admin if not exists (one-time setup)
        admin = new User({ name: "Admin User", email: "admin@gmail.com", password: "admin@123", role: "admin" });
        await admin.save();
      }
      
      const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
      return res.json({ token, user: { id: admin._id, name: admin.name, email: admin.email, role: admin.role } });
    }

    // Standard student login
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    
    // Ensure only student can use standard login (except for the hardcoded check above)
    if (user.role === 'admin' && email !== "admin@gmail.com") {
        return res.status(403).json({ message: "Access denied" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMe = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(401).json({ message: "Invalid session" });
  }
};
