const mongoose = require('mongoose');

const characterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    type: String,
    default: "/characters/placeholder.png", // The frontend can handle this or use avatars
  },
  powerLevel: {
    type: Number,
    required: true,
  },
  rarity: {
    type: String,
    enum: ['Common', 'Rare', 'Epic', 'Legendary'],
    required: true,
  }
}, { timestamps: true });

const Character = mongoose.model('Character', characterSchema);
module.exports = Character;
