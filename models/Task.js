const mongoose = require('mongoose');

// Define the schema
const TaskSchema = new mongoose.Schema({
  task: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    required: true
  },
  is_active: {
    type: Boolean,
    default: false // Default value is true
  }
});

// Create the model
const Task = mongoose.model('Task', TaskSchema);

module.exports = Task;
