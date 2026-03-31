const express = require('express');
const router = express.Router();
const { LostFound } = require('../models');
const { verifyToken } = require('../middleware/auth');
const upload = require('../utils/upload');

// Get all lost/found items
router.get('/', async (req, res) => {
  try {
    const items = await LostFound.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Upload a new item
router.post('/', verifyToken, upload.single('image'), async (req, res) => {
  try {
    const { title, description, location, status } = req.body;
    const item = new LostFound({
      title,
      description,
      location,
      status,
      image: req.file ? `/uploads/${req.file.filename}` : 'https://placehold.co/400x300?text=LostFound'
    });
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
