const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

router.get('/', verifyToken, verifyAdmin, orderController.getOrders);
router.get('/my-orders', verifyToken, orderController.getMyOrders);
router.post('/', verifyToken, orderController.placeOrder);
router.put('/:id/status', verifyToken, verifyAdmin, orderController.updateStatus);

module.exports = router;
