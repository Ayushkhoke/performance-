const Task = require('../models/Task');

// Get user tasks
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user._id }).sort({ date: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a task
const createTask = async (req, res) => {
  const { title, description, priority, date } = req.body;

  try {
    const task = new Task({
      userId: req.user._id,
      title,
      description,
      priority,
      date: date || new Date()
    });

    const createdTask = await task.save();
    res.status(201).json(createdTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update task 
const updateTask = async (req, res) => {
  const { title, description, priority, date, completed } = req.body;

  try {
    const task = await Task.findById(req.params.id);

    if (task) {
      if (task.userId.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized' });
      }

      task.title = title !== undefined ? title : task.title;
      task.description = description !== undefined ? description : task.description;
      task.priority = priority !== undefined ? priority : task.priority;
      task.date = date !== undefined ? date : task.date;
      
      if (completed !== undefined) {
        task.completed = completed;
        if (completed) {
          task.completedAt = new Date();
        } else {
          task.completedAt = null;
        }
      }

      const updatedTask = await task.save();
      res.json(updatedTask);
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete task
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (task) {
      if (task.userId.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized' });
      }

      await task.deleteOne();
      res.json({ message: 'Task removed' });
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };
