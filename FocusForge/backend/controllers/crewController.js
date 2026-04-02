const Crew = require('../models/Crew');
const UnlockedCharacter = require('../models/UnlockedCharacter');
const User = require('../models/User');

// Create a new crew
const createCrew = async (req, res) => {
  try {
    const { name } = req.body;
    // Crew starts with no members and lowest bounty
    const crew = await Crew.create({
      name,
      owner: req.user._id,
      members: [],
      bounty: 0
    });
    res.status(201).json({ crew });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all crews sorted by bounty
const getCrewsLeaderboard = async (req, res) => {
  try {
    const crews = await Crew.find().sort({ bounty: 1 }).populate('owner', 'name').populate('members');
    // User's crew
    const myCrew = await Crew.findOne({ owner: req.user._id }).populate('members');
    res.json({ crews, myCrew });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createCrew, getCrewsLeaderboard };