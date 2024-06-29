const express = require('express');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables
const db = require('./db'); // Ensure this path is correct based on your project structure

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
const authRoutes = require('./routes/authRoutes');
const preferencesRoutes = require('./routes/preferencesRoutes');
app.use('/api/auth', authRoutes);
app.use('/api/preferences', preferencesRoutes);

// Server listening
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
