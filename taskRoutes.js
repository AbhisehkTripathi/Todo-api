const express = require('express');
const router = express.Router(); 
const Task = require('../Todo-api/models/Task');


router.post('/tasks', async (req, res) => {
    try {
        const task = new Task({ task: req.body.task });
        const savedTask = await task.save();
        res.status(201).json(savedTask);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.status(200).json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ error: 'Task not found' });
        res.status(200).json(task);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/tasks/:id', async (req, res) => {
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

router.delete('/tasks/:id', async (req, res) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id);
        if (!deletedTask) return res.status(404).json({ error: 'Task not found' });
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.get('/tasks/active', async (req, res) => {
    try {
        const activeTasks = await Task.find({ is_active: true });
        res.status(200).json(activeTasks);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching active tasks', details: err.message });
    }
});


router.post('/tasks/complete-expired', async (req, res) => {
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

router.patch('/tasks/:id/activate', async (req, res) => {
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

router.get('/tasks/completed', async (req, res) => {
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

module.exports = router; 
