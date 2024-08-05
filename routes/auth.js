const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Pretpostavljamo da se model korisnika nalazi u models folderu

// Endpoint za login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ where: { username, password, role: 'admin' } }); // Provjera za admina

        if (user && bcrypt.compareSync(password, user.password)) {
            const token = jwt.sign({ id: user.id, role: user.role }, 'your_jwt_secret');
            // Ažuriramo vrijeme zadnje prijave
            user.lastLogin = new Date();
            await user.save();

            res.json({ token });
        } else {
            res.status(401).json({ error: 'Invalid credentials or not an admin' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Database error: ' + error.message });
    }
});

module.exports = router;
 
