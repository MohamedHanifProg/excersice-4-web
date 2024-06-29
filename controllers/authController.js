const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { storeToken } = require('../middleware/authMiddleware');

exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;
        const results = await User.findByUsername(username);

        if (results.length > 0) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        await User.create({ username, password });
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

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
        storeToken(token, user); // Store the token with the user data
        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
w