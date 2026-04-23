import React, { useContext, useEffect, useState } from 'react';
import TaskContext from '../context/TaskContext';
import AuthContext from '../context/AuthContext';
import Heatmap from '../components/Heatmap';
import { TrendLineChart, CompletionPieChart } from '../components/AnalyticsCharts';
import { motion, useAnimation } from 'framer-motion';
import { Sparkles, TrendingUp, Target, Swords, Skull } from 'lucide-react';

// Animated Counter Component
const AnimatedCounter = ({ value }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = displayValue;
    const end = value;
    if (start === end) return;
    
    const duration = 1000;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (easeOutExpo)
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      const current = Math.floor(start + (end - start) * easeProgress);
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(end);
      }
    };

    requestAnimationFrame(animate);
  }, [value]);

  return <span>{displayValue.toLocaleString()}</span>;
};

const Dashboard = () => {
  const { analytics, fetchAnalytics, loading } = useContext(TaskContext);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (loading || !analytics || !user) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  // Use heatmap data for the past 7 days for the trend chart
  const weekTrendData = analytics.heatmapData ? analytics.heatmapData.slice(-7) : [];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-end">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight drop-shadow-sm">Pirate Dashboard</h1>
          <p className="text-gray-400 mt-1">Track your crew's progress and bounty.</p>
        </div>
        
        {/* Animated Bounty Header Card */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-[#111827] border border-gold/30 px-4 sm:px-6 py-3 rounded-2xl shadow-[0_0_20px_rgba(250,204,21,0.15)] flex flex-col items-start sm:items-end relative overflow-hidden w-full sm:w-auto"
        >
          <div className="absolute inset-0 bg-linear-to-r from-transparent to-gold/5 pointer-events-none" />
          <span className="text-xs uppercase font-bold tracking-widest text-gold/80 mb-1 flex items-center gap-2">
            <Skull className="w-3 h-3" /> Total Bounty
          </span>
          <span className="text-3xl font-mono font-bold text-gold drop-shadow-[0_0_5px_rgba(250,204,21,0.5)]">
            ฿<AnimatedCounter value={user.bounty || 0} />
          </span>
        </motion.div>
      </header>

      {/* AI Suggestions Card */}
      <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-48 h-48 bg-secondary-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="text-secondary-500 w-6 h-6 drop-shadow-[0_0_8px_rgba(139,92,246,0.6)]" />
          <h2 className="text-xl font-bold text-gray-200">Navigator's Logbook</h2>
        </div>
        <ul className="space-y-3">
          {analytics.aiSuggestions?.map((suggestion, idx) => (
            <li key={idx} className="flex items-start gap-3 text-gray-300 bg-[#0f172a] p-3 rounded-xl border border-[#1F2937]">
              <span className="text-secondary-400 mt-0.5 animate-pulse">✦</span>
              <span className="leading-relaxed">{suggestion}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Score Card */}
        <div className="bg-[#111827] p-6 rounded-2xl shadow-xl border border-[#1F2937] flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary-500/10 rounded-full blur-2xl" />
          <div>
            <div className="flex items-center justify-between mb-2 relative z-10">
              <h3 className="font-semibold text-gray-400 uppercase tracking-wider text-sm">Completion Rate</h3>
              <Target className="text-primary-500 w-5 h-5 drop-shadow-[0_0_5px_rgba(34,197,94,0.5)]" />
            </div>
            <div className="text-5xl font-bold mt-4 text-white drop-shadow-md relative z-10">
              <AnimatedCounter value={analytics.completionScore} />%
            </div>
          </div>
          <div className="mt-6 w-full bg-[#1F2937] h-3 rounded-full overflow-hidden shadow-inner relative z-10">
            <div 
              className="bg-primary-500 h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(34,197,94,0.8)] relative" 
              style={{ width: `${analytics.completionScore}%` }}
            >
               <div className="absolute inset-0 bg-white/20 blur-[2px]" />
            </div>
          </div>
        </div>

        {/* Task Stats Card */}
        <div className="bg-[#111827] p-6 rounded-2xl shadow-xl border border-[#1F2937] flex flex-col justify-center">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-gray-400 uppercase tracking-wider text-sm">Quests</h3>
            <Swords className="text-blue-500 w-5 h-5 drop-shadow-[0_0_5px_rgba(59,130,246,0.5)]" />
          </div>
          <div className="flex justify-between items-end bg-[#0f172a] p-4 rounded-xl border border-[#1F2937]">
            <div>
              <p className="text-4xl font-bold text-white drop-shadow-md"><AnimatedCounter value={analytics.completedTasks} /></p>
              <p className="text-xs font-bold uppercase tracking-wider text-primary-500 mt-1">Cleared</p>
            </div>
            <div className="w-px h-12 bg-[#1F2937]"></div>
            <div className="text-right">
              <p className="text-4xl font-bold text-gray-300"><AnimatedCounter value={analytics.pendingTasks} /></p>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mt-1">Active</p>
            </div>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-[#111827] p-6 rounded-2xl shadow-xl border border-[#1F2937] flex flex-col items-center justify-center">
          <h3 className="font-semibold text-gray-400 uppercase tracking-wider text-sm w-full text-left mb-2">Quest Status</h3>
          <CompletionPieChart data={analytics.pieChartData} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#111827] p-6 rounded-2xl shadow-xl border border-[#1F2937] relative overflow-hidden">
          <div className="flex items-center justify-between mb-4 z-10 relative">
            <h3 className="text-lg font-bold text-white tracking-tight">Weekly Conquest Trend</h3>
            <TrendingUp className="text-gray-500 w-5 h-5" />
          </div>
          {weekTrendData.length > 0 ? (
            <div className="relative z-10">
              <TrendLineChart data={weekTrendData} />
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-600 relative z-10 font-medium">Not enough voyage data...</div>
          )}
        </div>
        
        <div className="lg:col-span-1">
          <Heatmap data={analytics.heatmapData} />
        </div>
      </div>

    </motion.div>
  );
};

export default Dashboard;
