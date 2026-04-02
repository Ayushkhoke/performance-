import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { motion } from 'framer-motion';
import { Trophy, Swords, Shield, Skull } from 'lucide-react';

const Leaderboard = () => {
  const [data, setData] = useState({ topPirates: [], myCrewRanking: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await api.get('/rewards/leaderboard');
        setData(res.data);
      } catch (error) {
        console.error("Failed to load leaderboard", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
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
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <Trophy className="w-8 h-8 text-gold drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" />
            Power Rankings
          </h1>
          <p className="text-gray-400 mt-2">
            The most feared pirates and their legendary crews.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Global Pirate Bounty Rankings */}
        <div className="bg-[#111827] rounded-3xl shadow-2xl border border-[#1F2937] overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl" />
          
          <div className="px-8 py-6 border-b border-[#1F2937] bg-[#0f172a]/50 flex items-center gap-3 relative z-10">
            <Skull className="w-6 h-6 text-gray-400" />
            <h2 className="text-xl font-bold text-white tracking-wide">Most Wanted Pirates</h2>
          </div>

          <div className="p-6 relative z-10">
            <div className="space-y-4">
              {data.topPirates.map((pirate, index) => (
                <motion.div 
                  key={pirate._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                    index === 0 
                      ? 'bg-gradient-to-r from-gold/20 to-transparent border-gold/50 shadow-[0_0_15px_rgba(250,204,21,0.2)]'
                      : index === 1
                        ? 'bg-gradient-to-r from-gray-300/20 to-transparent border-gray-300/50'
                        : index === 2
                          ? 'bg-gradient-to-r from-amber-700/20 to-transparent border-amber-700/50'
                          : 'bg-[#0f172a] border-[#1F2937] hover:border-gray-600'
                  }`}
                >
                  <div className={`w-10 h-10 flex items-center justify-center rounded-full font-bold text-lg ${
                    index === 0 ? 'bg-gold text-black shadow-[0_0_10px_rgba(250,204,21,0.8)]' :
                    index === 1 ? 'bg-gray-300 text-black shadow-[0_0_10px_rgba(209,213,219,0.8)]' :
                    index === 2 ? 'bg-amber-700 text-white shadow-[0_0_10px_rgba(180,83,9,0.8)]' :
                    'bg-[#1F2937] text-gray-400'
                  }`}>
                    #{index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-bold text-lg ${index === 0 ? 'text-gold' : 'text-gray-100'}`}>{pirate.name}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 font-bold tracking-widest uppercase mb-1">Bounty</p>
                    <p className="font-mono text-xl font-bold text-primary-400 drop-shadow-[0_0_5px_rgba(34,197,94,0.5)]">
                      ฿{pirate.bounty.toLocaleString()}
                    </p>
                  </div>
                </motion.div>
              ))}
              
              {data.topPirates.length === 0 && (
                <div className="text-center py-10 text-gray-500">
                  No bounties recorded yet.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* User's Highest Power Characters */}
        <div className="bg-[#111827] rounded-3xl shadow-2xl border border-[#1F2937] overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary-500/5 rounded-full blur-3xl" />
          
          <div className="px-8 py-6 border-b border-[#1F2937] bg-[#0f172a]/50 flex items-center gap-3 relative z-10">
            <Swords className="w-6 h-6 text-gray-400" />
            <h2 className="text-xl font-bold text-white tracking-wide">Your Strongest Crew</h2>
          </div>

          <div className="p-6 relative z-10 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            <div className="space-y-4">
              {data.myCrewRanking.map((char, index) => (
                <motion.div 
                  key={char._id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex items-center gap-4 p-3 rounded-xl border transition-all ${
                    char.rarity === 'Legendary' 
                      ? 'bg-gradient-to-r from-gold/10 to-[#0f172a] border-gold/30 hover:border-gold/60'
                      : char.rarity === 'Epic'
                        ? 'bg-gradient-to-r from-secondary-500/10 to-[#0f172a] border-secondary-500/30 hover:border-secondary-500/60'
                        : 'bg-[#0f172a] border-[#1F2937] hover:border-gray-600'
                  }`}
                >
                  <div className={`w-8 h-8 flex items-center justify-center rounded-lg font-bold text-sm bg-black/50 ${
                    char.rarity === 'Legendary' ? 'text-gold' : 'text-gray-400'
                  }`}>
                    {index + 1}
                  </div>
                  
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#1F2937]">
                     {/* Use placeholder if image is default */}
                     <img src={'https://via.placeholder.com/150/111827/374151?text=' + char.name.split(' ')[0]} alt={char.name} className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className={`font-bold truncate ${char.rarity === 'Legendary' ? 'text-gold drop-shadow-sm' : 'text-gray-200'}`}>
                      {char.name}
                    </h3>
                    <p className={`text-[10px] uppercase font-bold tracking-widest ${
                      char.rarity === 'Legendary' ? 'text-gold/80' : 
                      char.rarity === 'Epic' ? 'text-secondary-400' :
                      char.rarity === 'Rare' ? 'text-blue-400' : 'text-gray-500'
                    }`}>
                      {char.rarity}
                    </p>
                  </div>

                  <div className="text-right pr-2">
                    <div className="flex items-center justify-end gap-1 text-xs text-gray-500 uppercase tracking-widest mb-1">
                      <Shield className="w-3 h-3" /> PWR
                    </div>
                    <p className="font-mono text-lg font-bold text-white">
                      {char.powerLevel.toLocaleString()}
                    </p>
                  </div>
                </motion.div>
              ))}

              {data.myCrewRanking.length === 0 && (
                <div className="text-center py-10 text-gray-500">
                  Complete tasks to recruit your first crew member!
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default Leaderboard;
