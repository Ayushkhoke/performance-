const Task = require('../models/Task');

const getAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get all tasks for the user
    const tasks = await Task.find({ userId });

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const pendingTasks = totalTasks - completedTasks;

    const completionScore = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    // Group tasks by date for bar/line charts and streak heatmap
    const tasksByDate = {};
    tasks.forEach(task => {
      // YYYY-MM-DD string
      const dateStr = new Date(task.date).toISOString().split('T')[0];
      if (!tasksByDate[dateStr]) {
        tasksByDate[dateStr] = { total: 0, completed: 0 };
      }
      tasksByDate[dateStr].total += 1;
      if (task.completed) {
        tasksByDate[dateStr].completed += 1;
      }
    });

    const heatmapData = Object.keys(tasksByDate).map(dateStr => {
      const stats = tasksByDate[dateStr];
      const completionRate = stats.total === 0 ? 0 : stats.completed / stats.total;
      let level = 0; // white
      if (completionRate > 0 && completionRate <= 0.33) level = 1; // light green
      else if (completionRate > 0.33 && completionRate <= 0.66) level = 2; // med green
      else if (completionRate > 0.66) level = 3; // dark green

      return {
        date: dateStr,
        level,
        completed: stats.completed,
        total: stats.total
      };
    });

    // Mock AI Suggestions based on simple heuristics
    let aiSuggestions = [];
    if (completionScore < 50 && totalTasks > 5) {
      aiSuggestions.push("You seem overwhelmed. Try to reduce task overload today.");
    }
    if (completionScore > 80 && totalTasks >= 3) {
      aiSuggestions.push("Great job! You are highly productive.");
    }
    if (tasksByDate[new Date().toISOString().split('T')[0]]?.total === 0) {
      aiSuggestions.push("Plan your day! Add some tasks to get started.");
    }
    if (aiSuggestions.length === 0) {
      aiSuggestions.push("Keep tracking your tasks to receive more AI insights.");
    }

    res.json({
      completionScore,
      totalTasks,
      completedTasks,
      pendingTasks,
      heatmapData,
      aiSuggestions,
      pieChartData: [
        { name: 'Completed', value: completedTasks },
        { name: 'Pending', value: pendingTasks }
      ],
      // Weekly trend can be extracted from heatmapData on frontend
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAnalytics };
