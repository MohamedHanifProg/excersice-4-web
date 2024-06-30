const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/userModel');

// Register a new user
exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;
        const results = await User.findByUsername(username);

        if (results.length > 0) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        const hashedPassword = bcrypt.hashSync(password, 8); // Hash the password
        await User.create({ username, password: hashedPassword });
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// authController.js

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const results = await User.findByUsername(username);

        if (results.length === 0) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const user = results[0];
        const isMatch = bcrypt.compareSync(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = crypto.randomBytes(8).toString('hex'); // Generate a 16-character (8-byte) token

        // Update the user's access code in the database
        await User.updateAccessCode(user.id, token);
        console.log(`Access code updated for user ${user.id}: ${token}`); // Add this line for debugging

        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

