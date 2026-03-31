const { Order } = require('../models');

exports.getOrders = async (req, res) => {
  const orders = await Order.find().populate('userId', 'name email').populate('items.productId');
  res.json(orders);
};

exports.getMyOrders = async (req, res) => {
  const orders = await Order.find({ userId: req.user._id }).populate('items.productId').sort({ createdAt: -1 });
  res.json(orders);
};

exports.placeOrder = async (req, res) => {
  const { items } = req.body;
  const order = new Order({ userId: req.user._id, items });
  await order.save();
  req.io.emit('new-order', order);
  res.status(201).json(order);
};

exports.updateStatus = async (req, res) => {
  const { status } = req.body;
  const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
  req.io.emit('order-status-update', { orderId: order._id, status });
  res.json(order);
};
