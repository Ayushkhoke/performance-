const User = require('../models/User');
const Task = require('../models/Task');
const Character = require('../models/Character');
const UnlockedCharacter = require('../models/UnlockedCharacter');

// Utility to get today's tasks
const getTodaysTasks = async (userId) => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  return await Task.find({
    userId,
    date: { $gte: startOfDay, $lte: endOfDay }
  });
};

const unlockCharacter = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const tasks = await getTodaysTasks(user._id);

    if (tasks.length === 0) {
      return res.status(400).json({ message: "No tasks created for today." });
    }

    const completedTasks = tasks.filter(t => t.completed);
    
    // Core Gamification Rule: ONLY 100% unlocks
    if (completedTasks.length !== tasks.length) {
      return res.status(400).json({ message: "Complete all tasks to recruit a new crew member!" });
    }

    // Check if user already unlocked a character today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const alreadyUnlocked = await UnlockedCharacter.findOne({
      user: user._id,
      unlockedAt: { $gte: startOfDay }
    });

    if (alreadyUnlocked) {
      return res.status(400).json({ message: "You have already recruited a crew member today!" });
    }
      // Only increment streak if all tasks completed
      user.streak = (user.streak || 0) + 1;
      await user.save();
  
      // Only unlock character if streak is 7
      if (user.streak < 7) {
        return res.status(200).json({ message: `Streak: ${user.streak}/7. Keep going to unlock a new crew member!` });
      }

    // Find all characters user already owns
    const ownedRelationships = await UnlockedCharacter.find({ user: user._id }).select('character');
    const ownedIds = ownedRelationships.map(rel => rel.character);

    // Get a random unowned character
    const availableCharacters = await Character.find({ _id: { $nin: ownedIds } });
    if (availableCharacters.length === 0) {
      return res.status(400).json({ message: "You have collected all characters!" });
    }

    // Weighted random selection based on rarity could be added here,
    // For MVP, picking uniformly random from available
    const randomIndex = Math.floor(Math.random() * availableCharacters.length);
    const newCharacter = availableCharacters[randomIndex];

    // Create unlock record
    await UnlockedCharacter.create({
      user: user._id,
      character: newCharacter._id
    });

    // Add Bounty
      let bountyIncrease = 50000; // Base weekly completion
    if (newCharacter.rarity === 'Legendary') {
      bountyIncrease += 500000;
    } else if (newCharacter.rarity === 'Epic') {
      bountyIncrease += 100000;
    }

    user.bounty += bountyIncrease;
    await user.save();

    res.json({
      message: "New Crew Member Joined!",
      character: newCharacter,
      bountyIncrease,
      totalBounty: user.bounty
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCollection = async (req, res) => {
  try {
    // Get all characters to show the full grid
    const allCharacters = await Character.find().sort({ powerLevel: -1 });
    
    // Get user's unlocked characters
    const unlocked = await UnlockedCharacter.find({ user: req.user._id }).populate('character');
    const unlockedIds = unlocked.map(u => u.character._id.toString());

    res.json({
      allCharacters,
      unlockedIds
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getLeaderboard = async (req, res) => {
  try {
    // Top users by bounty
    const topPirates = await User.find().sort({ bounty: -1 }).limit(10).select('name bounty');
    
    // Get the highest power unlocked characters globally (or just for the user, prompt asks for "All unlocked characters go to Power Ranking")
    const myCrew = await UnlockedCharacter.find({ user: req.user._id })
      .populate('character')
      .sort({ 'character.powerLevel': -1 });

    const sortedCrew = myCrew.map(c => c.character).sort((a,b) => b.powerLevel - a.powerLevel);

    res.json({
      topPirates,
      myCrewRanking: sortedCrew
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { unlockCharacter, getCollection, getLeaderboard };
