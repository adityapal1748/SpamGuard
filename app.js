const express = require("express");
const bodyParser = require('body-parser');
const sequelize = require("./models");
const authRoutes = require("./routes/authRoutes");
const spamRoutes = require("./routes/spamRoutes");
const searchRoutes = require('./routes/searchRoutes');
require('dotenv').config();

const app = express();

// Middleware
app.use(bodyParser.json()); // Body parsing middleware

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/spam',spamRoutes );
app.use('/api/search', searchRoutes);

const PORT = process.env.PORT || 8000;

// Start server
sequelize.authenticate()
    .then(() => {
        console.log("Database connected");
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT} ${process.env.NODE_ENV}`);
        });
    })
    .catch(error => {
        console.error('Unable to connect to the database:', error);
    });
