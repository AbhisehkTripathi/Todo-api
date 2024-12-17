const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const taskRoutes = require('../Todo-api/taskRoutes');
const serverless = require('serverless-http'); // Import serverless-http

const app = express();

// Middleware
app.use(bodyParser.json());
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/crudDB';  // Fallback to local DB for local testing

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/crudDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB:', err);
});

// Routes
app.use('/api', taskRoutes);

// Wrap the app with serverless-http
module.exports.handler = serverless(app);  // Export handler as serverless function
