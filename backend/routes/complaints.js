const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaintController');
const { verifyToken, verifyAdmin } = require('../middleware/auth');
const upload = require('../utils/upload');

router.post('/', verifyToken, upload.single('image'), complaintController.submit);
router.get('/', verifyToken, verifyAdmin, complaintController.getAll);
router.put('/:id/status', verifyToken, verifyAdmin, complaintController.updateStatus);
router.get('/my-complaints', verifyToken, complaintController.getMyComplaints);

module.exports = router;
