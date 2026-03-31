const express = require('express');
const router = express.Router();
const facultyController = require('../controllers/facultyController');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

router.get('/', facultyController.getAllFaculty);
router.get('/search', facultyController.searchFaculty);
router.put('/:id/status', verifyToken, verifyAdmin, facultyController.updateStatus);
router.post('/', verifyToken, verifyAdmin, facultyController.addFaculty);
router.delete('/:id', verifyToken, verifyAdmin, facultyController.deleteFaculty);

module.exports = router;
