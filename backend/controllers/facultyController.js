const { Faculty } = require('../models');

exports.getAllFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.find();
    res.json(faculty);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.searchFaculty = async (req, res) => {
  try {
    const { query } = req.query;
    const faculty = await Faculty.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { department: { $regex: query, $options: 'i' } }
      ]
    });
    res.json(faculty);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const faculty = await Faculty.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(faculty);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.addFaculty = async (req, res) => {
  try {
    const faculty = new Faculty(req.body);
    await faculty.save();
    res.status(201).json(faculty);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteFaculty = async (req, res) => {
  try {
    await Faculty.findByIdAndDelete(req.params.id);
    res.json({ message: "Faculty removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
