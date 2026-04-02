import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { motion } from 'framer-motion';
import { Trophy, Users } from 'lucide-react';

const CrewLeaderboard = () => {
  const [data, setData] = useState({ crews: [], myCrew: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCrews = async () => {
      try {
        const res = await api.get('/crews/leaderboard');
        setData(res.data);
      } catch (error) {
        console.error('Failed to load crew leaderboard', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCrews();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <Trophy className="w-8 h-8 text-gold" />
            Crew Rankings
          </h1>
          <p className="text-gray-400 mt-2">Compete with other crews and climb the leaderboard!</p>
        </div>
      </header>
      <div className="bg-[#111827] rounded-3xl shadow-2xl border border-[#1F2937] overflow-hidden">
        <div className="px-8 py-6 border-b border-[#1F2937] bg-[#0f172a]/50 flex items-center gap-3">
          <Users className="w-6 h-6 text-gray-400" />
          <h2 className="text-xl font-bold text-white tracking-wide">Crew Leaderboard</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {data.crews.map((crew, index) => (
              <motion.div
                key={crew._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                  data.myCrew && crew._id === data.myCrew._id
                    ? 'bg-gradient-to-r from-primary-500/20 to-transparent border-primary-500/50 shadow-[0_0_15px_rgba(34,197,94,0.2)]'
                    : 'bg-[#0f172a] border-[#1F2937] hover:border-gray-600'
                }`}
              >
                <div className="w-10 h-10 flex items-center justify-center rounded-full font-bold text-lg bg-[#1F2937] text-gray-400">
                  #{index + 1}
                </div>
                <div className="flex-1">
                  <h3 className={`font-bold text-lg ${data.myCrew && crew._id === data.myCrew._id ? 'text-primary-500' : 'text-gray-100'}`}>{crew.name}</h3>
                  <p className="text-xs text-gray-500">Owner: {crew.owner.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 font-bold tracking-widest uppercase mb-1">Bounty</p>
                  <p className="font-mono text-xl font-bold text-primary-400">฿{crew.bounty.toLocaleString()}</p>
                </div>
              </motion.div>
            ))}
            {data.crews.length === 0 && (
              <div className="text-center py-10 text-gray-500">No crews created yet.</div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CrewLeaderboard;
