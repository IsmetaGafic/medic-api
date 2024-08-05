const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Fetch all users
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fetch user details
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Block user
router.post('/block/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      user.status = 'blocked';
      await user.save();
      res.json({ message: 'User blocked' });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { name, username, password, orders, image, dateOfBirth } = req.body;
    const user = await User.create({ name, username, password, orders, image, dateOfBirth });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.post('/register', async (req, res) => {
  const { username, password, name, orders, image, dateOfBirth, role } = req.body;

  try {
      const newUser = await User.create({
          username,
          password,
          name,
          orders,
          image,
          dateOfBirth,
          role, // dodajemo ulogu
          lastLogin: new Date(),
      });

      res.status(201).json(newUser);
  } catch (error) {
      res.status(500).json({ error: 'Database error: ' + error.message });
  }
});
router.post('/logout', (req, res) => {
  // Typically, you would invalidate the token client-side
  res.json({ message: 'Logged out successfully' });
});



module.exports = router;
 
