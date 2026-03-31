const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

router.get('/', eventController.getEvents);
router.post('/', verifyToken, verifyAdmin, eventController.createEvent);
router.put('/:id', verifyToken, verifyAdmin, eventController.updateEvent);
router.delete('/:id', verifyToken, verifyAdmin, eventController.deleteEvent);
router.post('/:id/register', verifyToken, eventController.register);

module.exports = router;
