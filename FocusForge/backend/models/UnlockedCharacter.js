const mongoose = require('mongoose');

const unlockedCharacterSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  character: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Character',
    required: true,
  },
  unlockedAt: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true });

// A user can only unlock a specific character once
unlockedCharacterSchema.index({ user: 1, character: 1 }, { unique: true });

const UnlockedCharacter = mongoose.model('UnlockedCharacter', unlockedCharacterSchema);
module.exports = UnlockedCharacter;
