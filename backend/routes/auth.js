const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

// 1. REGISTER (Updated to accept currency)
router.post('/signup', async (req, res) => {
  const { name, email, password, currency } = req.body; // Added currency
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Save currency to database (default to '$' if missing)
    user = new User({ 
      name, 
      email, 
      password: hashedPassword,
      currency: currency || '$' 
    });
    
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    // Return user data including currency
    res.json({ 
      token, 
      user: { id: user._id, name: user.name, email: user.email, currency: user.currency } 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. LOGIN (Updated to return currency)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    // Return user data including currency
    res.json({ 
      token, 
      user: { id: user._id, name: user.name, email: user.email, currency: user.currency } 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. GET ALL USERS
router.get('/users', auth, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. GET CURRENT USER (New helper to get my own currency if needed)
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;