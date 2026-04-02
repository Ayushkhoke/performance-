import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { motion } from 'framer-motion';
import { Lock, Users } from 'lucide-react';

const Collection = () => {
  const [characters, setCharacters] = useState([]);
  const [unlockedIds, setUnlockedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const res = await api.get('/rewards/collection');
        setCharacters(res.data.allCharacters);
        setUnlockedIds(new Set(res.data.unlockedIds));
      } catch (error) {
        console.error("Failed to load collection", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCollection();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
          <Users className="w-8 h-8 text-primary-500 drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
          Crew Collection
        </h1>
        <p className="text-gray-400 mt-2">
          You have recruited <span className="font-bold text-white">{unlockedIds.size}</span> of <span className="font-bold text-white">{characters.length}</span> legendary pirates.
        </p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {characters.map((char) => {
          const isUnlocked = unlockedIds.has(char._id);
          const isLegendary = char.rarity === 'Legendary';
          
          return (
            <motion.div 
              key={char._id}
              whileHover={{ scale: 1.05 }}
              className={`relative rounded-2xl overflow-hidden aspect-[3/4] border-2 transition-all duration-300
                ${isUnlocked 
                  ? isLegendary 
                    ? 'border-gold shadow-[0_0_15px_rgba(250,204,21,0.3)] bg-gradient-to-b from-[#111827] to-gold/10' 
                    : 'border-[#374151] shadow-lg bg-[#111827]'
                  : 'border-[#1F2937] bg-[#0f172a] grayscale opacity-70'}
              `}
            >
              {isUnlocked && isLegendary && (
                <div className="absolute inset-0 bg-gradient-to-t from-gold/20 via-transparent to-transparent pointer-events-none z-10" />
              )}
              
              <div className="absolute inset-0 p-3 flex flex-col items-center justify-end z-20 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                <h3 className={`font-bold text-center text-sm mb-1 line-clamp-2 ${isUnlocked && isLegendary ? 'text-gold drop-shadow-[0_0_5px_rgba(250,204,21,0.5)]' : 'text-gray-200'}`}>
                  {char.name}
                </h3>
                {isUnlocked ? (
                  <div className="flex flex-col items-center">
                    <span className={`text-[10px] uppercase font-bold tracking-widest ${isLegendary ? 'text-gold/80' : 'text-primary-500'}`}>
                      {char.rarity}
                    </span>
                    <span className="text-xs font-mono text-gray-400">PWR: {char.powerLevel.toLocaleString()}</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center mt-2 group">
                    <Lock className="w-5 h-5 text-gray-500 mb-1" />
                    <span className="text-[10px] text-gray-500 text-center px-2">Complete all quests to unlock</span>
                  </div>
                )}
              </div>

              {/* Character Image */}
              <img 
                src={char.image || 'https://via.placeholder.com/300x400/111827/374151?text=' + char.name.split(' ')[0]} 
                alt={char.name}
                className={`w-full h-full object-cover transition-all duration-500 ${isUnlocked ? (isLegendary ? 'contrast-125 saturate-150' : '') : 'blur-md'}`}
              />

              {!isUnlocked && (
                <div className="absolute top-2 right-2 z-30 opacity-50">
                  <span className="text-xs font-mono font-bold text-gray-600 bg-black/50 px-2 py-0.5 rounded uppercase">{char.rarity}</span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default Collection;
