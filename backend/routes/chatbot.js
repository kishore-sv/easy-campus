const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// The new AI-powered endpoint supporting streaming
router.post('/query', chatController.chat);

module.exports = router;

