const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Character = require('./models/Character');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/focusforge';

// Common: 1000 - 3000
// Rare: 3000 - 6000
// Epic: 6000 - 9000
// Legendary: 9000+

const characters = [
  // Legendary
  { name: "Gol D. Roger", powerLevel: 12000, rarity: "Legendary" },
  { name: "Whitebeard", powerLevel: 11500, rarity: "Legendary" },
  { name: "Shanks", powerLevel: 11000, rarity: "Legendary" },
  { name: "Kaido", powerLevel: 10500, rarity: "Legendary" },
  { name: "Monkey D. Luffy (Gear 5)", powerLevel: 10000, rarity: "Legendary" },
  { name: "Big Mom", powerLevel: 10200, rarity: "Legendary" },
  { name: "Blackbeard", powerLevel: 10100, rarity: "Legendary" },
  { name: "Dracule Mihawk", powerLevel: 9800, rarity: "Legendary" },
  { name: "Silvers Rayleigh", powerLevel: 9500, rarity: "Legendary" },
  { name: "Kozuki Oden", powerLevel: 9300, rarity: "Legendary" },
  { name: "Akainu", powerLevel: 9700, rarity: "Legendary" },
  { name: "Aokiji", powerLevel: 9600, rarity: "Legendary" },
  { name: "Kizaru", powerLevel: 9500, rarity: "Legendary" },
  { name: "Monkey D. Dragon", powerLevel: 10000, rarity: "Legendary" },
  
  // Epic
  { name: "Roronoa Zoro", powerLevel: 8500, rarity: "Epic" },
  { name: "Sanji", powerLevel: 8300, rarity: "Epic" },
  { name: "Portgas D. Ace", powerLevel: 8000, rarity: "Epic" },
  { name: "Sabo", powerLevel: 8200, rarity: "Epic" },
  { name: "Trafalgar D. Water Law", powerLevel: 8100, rarity: "Epic" },
  { name: "Eustass Kid", powerLevel: 8000, rarity: "Epic" },
  { name: "Jinbe", powerLevel: 7500, rarity: "Epic" },
  { name: "Charlotte Katakuri", powerLevel: 8800, rarity: "Epic" },
  { name: "Yamato", powerLevel: 8900, rarity: "Epic" },
  { name: "Bartholomew Kuma", powerLevel: 7200, rarity: "Epic" },
  { name: "Boa Hancock", powerLevel: 7800, rarity: "Epic" },
  { name: "Donquixote Doflamingo", powerLevel: 7600, rarity: "Epic" },
  { name: "Crocodile", powerLevel: 7000, rarity: "Epic" },
  { name: "Marco", powerLevel: 8400, rarity: "Epic" },
  { name: "King", powerLevel: 8500, rarity: "Epic" },
  { name: "Queen", powerLevel: 7800, rarity: "Epic" },
  { name: "Cracker", powerLevel: 7400, rarity: "Epic" },
  { name: "Rob Lucci", powerLevel: 7500, rarity: "Epic" },
  { name: "Enel", powerLevel: 7300, rarity: "Epic" },

  // Rare
  { name: "Nico Robin", powerLevel: 5500, rarity: "Rare" },
  { name: "Franky", powerLevel: 5200, rarity: "Rare" },
  { name: "Brook", powerLevel: 4800, rarity: "Rare" },
  { name: "Tony Tony Chopper (Monster Point)", powerLevel: 5900, rarity: "Rare" },
  { name: "Capone Bege", powerLevel: 5000, rarity: "Rare" },
  { name: "X Drake", powerLevel: 5500, rarity: "Rare" },
  { name: "Urouge", powerLevel: 4900, rarity: "Rare" },
  { name: "Basil Hawkins", powerLevel: 4800, rarity: "Rare" },
  { name: "Scratchmen Apoo", powerLevel: 4700, rarity: "Rare" },
  { name: "Killer", powerLevel: 5800, rarity: "Rare" },
  { name: "Jewelry Bonney", powerLevel: 4500, rarity: "Rare" },
  { name: "Smoker", powerLevel: 5200, rarity: "Rare" },
  { name: "Tashigi", powerLevel: 4000, rarity: "Rare" },
  { name: "Coby", powerLevel: 5500, rarity: "Rare" },
  { name: "Perona", powerLevel: 4200, rarity: "Rare" },
  { name: "Gecko Moria", powerLevel: 4900, rarity: "Rare" },
  { name: "Caesar Clown", powerLevel: 4500, rarity: "Rare" },
  { name: "Kin'emon", powerLevel: 5000, rarity: "Rare" },
  { name: "Denjiro", powerLevel: 5600, rarity: "Rare" },
  { name: "Kikunojo", powerLevel: 4900, rarity: "Rare" },
  { name: "Ashura Doji", powerLevel: 5700, rarity: "Rare" },
  { name: "Inuarashi", powerLevel: 5800, rarity: "Rare" },
  { name: "Nekomamushi", powerLevel: 5800, rarity: "Rare" },
  { name: "Carrot (Sulong)", powerLevel: 5500, rarity: "Rare" },

  // Common
  { name: "Nami", powerLevel: 2500, rarity: "Common" },
  { name: "Usopp", powerLevel: 2400, rarity: "Common" },
  { name: "Buggy", powerLevel: 1500, rarity: "Common" },
  { name: "Alvida", powerLevel: 1200, rarity: "Common" },
  { name: "Captain Kuro", powerLevel: 1800, rarity: "Common" },
  { name: "Don Krieg", powerLevel: 2100, rarity: "Common" },
  { name: "Arlong", powerLevel: 2800, rarity: "Common" },
  { name: "Hachi", powerLevel: 1500, rarity: "Common" },
  { name: "Wapol", powerLevel: 2000, rarity: "Common" },
  { name: "Vivi", powerLevel: 1100, rarity: "Common" },
  { name: "Karoo", powerLevel: 1000, rarity: "Common" },
  { name: "Mr. 2 Bon Clay", powerLevel: 2900, rarity: "Common" },
  { name: "Mr. 3 Galdino", powerLevel: 2500, rarity: "Common" },
  { name: "Foxy", powerLevel: 1900, rarity: "Common" },
  { name: "Spandam", powerLevel: 1000, rarity: "Common" },
  { name: "Helmeppo", powerLevel: 2200, rarity: "Common" },
  { name: "Bellamy", powerLevel: 2900, rarity: "Common" },
  { name: "Rebecca", powerLevel: 2400, rarity: "Common" },
  { name: "Leo", powerLevel: 2000, rarity: "Common" },
  { name: "Bartolomeo", powerLevel: 2900, rarity: "Common" },
  { name: "Cavendish", powerLevel: 2950, rarity: "Common" },
  { name: "Shirley", powerLevel: 1000, rarity: "Common" },
  { name: "Koby (Pre-timeskip)", powerLevel: 1200, rarity: "Common" },
  { name: "Axe-Hand Morgan", powerLevel: 1400, rarity: "Common" },
  { name: "Kuroobi", powerLevel: 2300, rarity: "Common" },
  { name: "Chew", powerLevel: 2100, rarity: "Common" },
  { name: "Pearl", powerLevel: 1700, rarity: "Common" },
  { name: "Chouchou", powerLevel: 1000, rarity: "Common" },
  { name: "Makino", powerLevel: 1000, rarity: "Common" },
  { name: "Mayor Boodle", powerLevel: 1000, rarity: "Common" },
  { name: "Zeff", powerLevel: 2800, rarity: "Common" },
  { name: "Patty", powerLevel: 1600, rarity: "Common" },
  { name: "Carne", powerLevel: 1600, rarity: "Common" },
  { name: "Gin", powerLevel: 2600, rarity: "Common" },
  { name: "Nojiko", powerLevel: 1100, rarity: "Common" },
  { name: "Genzo", powerLevel: 1200, rarity: "Common" },
  { name: "Johnny", powerLevel: 1300, rarity: "Common" },
  { name: "Yosaku", powerLevel: 1300, rarity: "Common" },
  { name: "Mohji", powerLevel: 1500, rarity: "Common" },
  { name: "Cabaji", powerLevel: 1700, rarity: "Common" },
  { name: "Jango", powerLevel: 1900, rarity: "Common" },
  { name: "Sham", powerLevel: 1800, rarity: "Common" },
  { name: "Buchi", powerLevel: 1800, rarity: "Common" },
  { name: "Dalton", powerLevel: 2500, rarity: "Common" },
  { name: "Dr. Kureha", powerLevel: 2000, rarity: "Common" },
  { name: "Igaram", powerLevel: 1800, rarity: "Common" },
  { name: "Pell", powerLevel: 2700, rarity: "Common" },
  { name: "Chaka", powerLevel: 2600, rarity: "Common" },
  { name: "Kohza", powerLevel: 2200, rarity: "Common" },
];

const seedDatabase = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    await Character.deleteMany(); // Clear existing
    console.log('Characters cleared');
    
    await Character.insertMany(characters);
    console.log('One Piece Characters Seeded Successfully!');
    
    process.exit();
  } catch (error) {
    console.error(`Error with data import: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
