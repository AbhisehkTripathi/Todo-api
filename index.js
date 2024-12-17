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
mongoose.connect("mongodb+srv://mohittripathi2096a:<db_password>@cluster0.oqi2n.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);  
});

// Routes
app.post('/tasks', async (req, res) => {
    try {
        const task = new Task({ task: req.body.task });
        const savedTask = await task.save();
        res.status(201).json(savedTask);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.status(200).json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ error: 'Task not found' });
        res.status(200).json(task);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/tasks/:id', async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            { task: req.body.task },
            { new: true } 
        );
        if (!updatedTask) return res.status(404).json({ error: 'Task not found' });
        res.status(200).json(updatedTask);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/tasks/:id', async (req, res) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id);
        if (!deletedTask) return res.status(404).json({ error: 'Task not found' });
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.get('/tasks/active', async (req, res) => {
    try {
        const activeTasks = await Task.find({ is_active: true });
        res.status(200).json(activeTasks);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching active tasks', details: err.message });
    }
});


app.post('/tasks/complete-expired', async (req, res) => {
    try {
        const now = new Date();
        const result = await Task.updateMany(
            { timestamp: { $lt: now }, is_active: true }, 
            { $set: { is_active: false } } 
        );
        res.status(200).json({
            message: 'Expired tasks marked as complete',
            modifiedCount: result.modifiedCount
        });
    } catch (err) {
        res.status(500).json({ error: 'Error marking tasks as complete', details: err.message });
    }
});

app.patch('/tasks/:id/activate', async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            { is_active: true },
            { new: true } 
        );
        if (!updatedTask) return res.status(404).json({ error: 'Task not found' });
        res.status(200).json({
            message: 'Task activated successfully',
            task: updatedTask
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/tasks/completed', async (req, res) => {
    try {
        const { date } = req.query; 
        if (!date) return res.status(400).json({ error: 'Date query parameter is required' });
        
        const specifiedDate = new Date(date);
        const completedTasks = await Task.find({
            timestamp: { $lt: specifiedDate }, 
            is_active: false 
        });

        res.status(200).json(completedTasks);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching completed tasks', details: err.message });
    }
});
// app.use('/api', taskRoutes);

// Wrap the app with serverless-http
module.exports.handler = serverless(app);  // Export handler as serverless function
