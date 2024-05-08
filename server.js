// Load environment variables from .env file
require('dotenv').config();

// Import necessary modules
const path = require('path');
const express = require('express');
const cors = require('cors');
const corsOptions = require('./config/corsOptions'); // CORS configuration
const app = express(); // Create Express application instance
const { logger } = require('./middleware/logEvents'); // Custom request logger middleware
const errorHandler = require('./middleware/errorHandler'); // Custom error handler middleware
const mongoose = require('mongoose'); // MongoDB ODM
const connectDB = require('./config/dbConn'); // MongoDB connection function

// Define port, use environment variable or default to 3500
const PORT = process.env.PORT || 3500;

// Connect to MongoDB
connectDB();

// Middleware setup

// Custom request logger middleware
app.use(logger);

// CORS middleware to handle Cross-Origin Resource Sharing
app.use(cors(corsOptions));

// Middleware to parse URL-encoded data (e.g., form data)
app.use(express.urlencoded({ extended: false }));

// Middleware to parse JSON data
app.use(express.json());

// Middleware to serve static files from the 'public' directory
app.use('/', express.static(path.join(__dirname, '/public')));

// Routes

// Root route
app.use('/', require('./routes/root'));

// Route for handling states data
app.use('/states', require('./routes/api/states'));

// Catch-all route for handling 404 errors
app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        // Serve HTML file for 404 error
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        // Respond with JSON for 404 error
        res.json({ error: "404 not found"});
    } else {
        // Respond with plain text for 404 error
        res.type('txt').send("404 not found");
    }
});

// Error handling middleware
app.use(errorHandler);

// Start server and listen on defined port
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`)); 
});
