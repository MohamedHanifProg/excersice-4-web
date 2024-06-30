const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const authRoutes = require('./routes/authRoutes');
const preferencesRoutes = require('./routes/preferencesRoutes');
const vacationRoutes = require('./routes/vacationRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/preferences', preferencesRoutes);
app.use('/api/vacation', vacationRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
