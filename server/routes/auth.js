const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify JWT token
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, 'your_jwt_secret');
    const user = await User.findById(decoded.userId);
    
    if (!user) throw new Error();
    
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Please authenticate' });
  }
};

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { 
      name, 
      email, 
      password, 
      phoneNumber,
      address
    } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Validate required fields
    if (!phoneNumber || !address) {
      return res.status(400).json({ message: 'Phone number and address are required' });
    }

    // Validate address fields
    const requiredAddressFields = ['country', 'state', 'district', 'street', 'pincode'];
    const missingFields = requiredAddressFields.filter(field => !address[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Missing required address fields: ${missingFields.join(', ')}`
      });
    }

    // Create new user with all fields
    const user = new User({
      name,
      email,
      password,
      phoneNumber,
      address: {
        country: address.country,
        state: address.state,
        district: address.district,
        street: address.street,
        pincode: address.pincode
      }
    });

    await user.save();
    
    const token = jwt.sign({ userId: user._id }, 'your_jwt_secret');
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid login credentials' });
    }
    
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid login credentials' });
    }
    
    const token = jwt.sign({ userId: user._id }, 'your_jwt_secret');
    res.json({ user, token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get current user profile
router.get('/profile', auth, async (req, res) => {
  res.json(req.user);
});

module.exports = {
  auth,
  router
};