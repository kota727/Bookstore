const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Book = require('../models/Book');
const { auth } = require('./auth');

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }
  next();
};

// Protect all order routes with authentication
router.use(auth);

// Get all orders (Admin sees all, users see their own)
router.get('/', async (req, res) => {
  try {
    const query = req.user.isAdmin ? {} : { user: req.user._id };
    const orders = await Order.find(query)
      .populate('user', 'name email')
      .populate('items.book', 'title author price')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single order
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.book', 'title author price');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if user is authorized to view this order
    if (!req.user.isAdmin && order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new order
router.post('/', async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;
    
    // Calculate total amount and verify stock
    let totalAmount = 0;
    for (let item of items) {
      const book = await Book.findById(item.book);
      if (!book) {
        return res.status(404).json({ message: `Book not found: ${item.book}` });
      }
      if (book.stockQuantity < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for: ${book.title}` });
      }
      item.price = book.price;
      totalAmount += book.price * item.quantity;
      
      // Update stock quantity
      book.stockQuantity -= item.quantity;
      await book.save();
    }
    
    const order = new Order({
      user: req.user._id,
      items,
      totalAmount,
      shippingAddress
    });
    
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update order status (Admin only)
router.patch('/:id/status', isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Cancel order
router.patch('/:id/cancel', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if user is authorized to cancel this order
    if (!req.user.isAdmin && order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // Only allow cancellation of pending orders
    if (order.status !== 'pending') {
      return res.status(400).json({ message: 'Cannot cancel order at current status' });
    }
    
    // Restore stock quantities
    for (let item of order.items) {
      const book = await Book.findById(item.book);
      if (book) {
        book.stockQuantity += item.quantity;
        await book.save();
      }
    }
    
    order.status = 'cancelled';
    await order.save();
    
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;