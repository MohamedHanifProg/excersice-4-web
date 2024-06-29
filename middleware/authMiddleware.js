const tokens = new Map(); // Use an in-memory map to store the tokens for simplicity

module.exports = (req, res, next) => {
    const token = req.query.token || req.body.token;
    if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

    // Verify the token from the map
    if (!tokens.has(token)) {
        return res.status(400).json({ error: 'Invalid token.' });
    }

    req.user = tokens.get(token); // Get the user data from the token map
    next();
};

// Add a function to store tokens
module.exports.storeToken = (token, user) => {
    tokens.set(token, user);
};
