const { Complaint } = require('../models');

exports.submit = async (req, res) => {
  const { category, description } = req.body;
  const complaint = new Complaint({
    userId: req.user._id,
    category,
    description,
    image: req.file ? `/uploads/${req.file.filename}` : null
  });
  await complaint.save();
  res.status(201).json(complaint);
};

exports.getAll = async (req, res) => {
  const complaints = await Complaint.find().populate('userId', 'name email').sort({ createdAt: -1 });
  res.json(complaints);
};

exports.updateStatus = async (req, res) => {
  const { status } = req.body;
  const complaint = await Complaint.findByIdAndUpdate(req.params.id, { status }, { new: true });
  res.json(complaint);
};

exports.getMyComplaints = async (req, res) => {
  const complaints = await Complaint.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json(complaints);
};
