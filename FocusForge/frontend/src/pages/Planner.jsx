import React, { useState, useContext, useEffect } from 'react';
import TaskContext from '../context/TaskContext';
import AuthContext from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Check, ShieldAlert } from 'lucide-react';
import api from '../services/api';

const Planner = () => {
  const { tasks, fetchTasks, addTask, updateTask, deleteTask, loading } = useContext(TaskContext);
  const { updateUser } = useContext(AuthContext);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');

  // Gamification State
  const [unlockedCharacter, setUnlockedCharacter] = useState(null);
  const [rewardError, setRewardError] = useState('');

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    await addTask({ title, description, priority });
    setTitle('');
    setDescription('');
    setPriority('Medium');
  };

  const checkUnlockRecruit = async () => {
    try {
      const res = await api.post('/rewards/unlock');
      setUnlockedCharacter(res.data.character);
      // Update local bounty text
      updateUser({ bounty: res.data.totalBounty });
      // Clear error if any
      setRewardError('');
    } catch (error) {
      if(error.response?.data?.message) {
        setRewardError(error.response.data.message);
      }
    }
  };

  const toggleTask = async (task) => {
    const isCompleting = !task.completed;
    await updateTask(task._id, { completed: isCompleting });
    
    if (isCompleting) {
      const remainingTasks = tasks.filter(t => t._id !== task._id && !t.completed);
      if (remainingTasks.length === 0 && tasks.length > 0) {
        checkUnlockRecruit();
      }
    }
  };

  const getPriorityColor = (p) => {
    if (p === 'High') return 'text-red-400 bg-red-400/10 border-red-400/20';
    if (p === 'Medium') return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
    return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const progressPercent = tasks.length === 0 ? 0 : Math.round((completedCount / tasks.length) * 100);

  if (loading && tasks.length === 0) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 flex flex-col min-h-screen relative">
      
      {/* 100% Completion Unlock Modal */}
      <AnimatePresence>
        {unlockedCharacter && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              className={`bg-[#111827] border ${unlockedCharacter.rarity === 'Legendary' ? 'border-gold shadow-[0_0_50px_rgba(250,204,21,0.3)]' : 'border-[#1F2937]'} p-8 rounded-2xl max-w-sm w-full text-center relative overflow-hidden`}
            >
              {unlockedCharacter.rarity === 'Legendary' && (
                <div className="absolute inset-0 bg-gradient-to-tr from-gold/10 to-transparent pointer-events-none" />
              )}
              <h2 className="text-3xl font-bold text-white tracking-wider mb-2 drop-shadow-md">New Crew Member Joined!</h2>
              <p className="text-primary-400 font-mono mb-6">Bounty increased!</p>
              
              <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden border-4 border-[#1F2937] shadow-2xl">
                <img src={unlockedCharacter.image} alt={unlockedCharacter.name} className="w-full h-full object-cover bg-gray-800" />
              </div>

              <h3 className={`text-2xl font-bold mb-1 ${unlockedCharacter.rarity === 'Legendary' ? 'text-gold drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]' : 'text-white'}`}>
                {unlockedCharacter.name}
              </h3>
              <p className="text-gray-400 text-sm mb-4">Power Level: <span className="text-white font-mono">{unlockedCharacter.powerLevel}</span></p>

              <button 
                onClick={() => setUnlockedCharacter(null)}
                className="w-full py-3 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(34,197,94,0.4)]"
              >
                Set Sail!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="flex items-end justify-between mb-2">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight drop-shadow-sm">Daily Planner</h1>
          <p className="text-gray-400 mt-1">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-500 mb-1 uppercase tracking-wider">Completion</p>
          <p className="text-2xl font-bold text-primary-500 drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]">{progressPercent}%</p>
        </div>
      </header>

      {/* Glowing Progress Bar */}
      <div className="w-full bg-[#1F2937] rounded-full h-3 mb-8 overflow-hidden shadow-inner border border-[#374151]">
        <motion.div 
          className="bg-primary-500 h-3 rounded-full relative" 
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="absolute inset-0 bg-white/20 blur-sm" />
        </motion.div>
      </div>

      {rewardError && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-medium">{rewardError}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Task List - LeetCode Style Dark */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#111827] rounded-2xl shadow-xl border border-[#1F2937] overflow-hidden">
            <div className="px-6 py-4 border-b border-[#1F2937] bg-[#0f172a] flex items-center justify-between">
              <h2 className="font-semibold text-gray-200">Quest Log ({completedCount}/{tasks.length})</h2>
              {progressPercent === 100 && tasks.length > 0 && (
                <span className="text-sm font-bold text-primary-400 flex items-center gap-1 drop-shadow-[0_0_5px_rgba(34,197,94,0.5)]">
                  All Quests Cleared!
                </span>
              )}
            </div>

            <div className="divide-y divide-[#1F2937] max-h-[60vh] overflow-y-auto">
              {tasks.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No quests assigned. Add a task to begin your journey!
                </div>
              ) : (
                <AnimatePresence>
                  {tasks.map((task) => (
                    <motion.div 
                      key={task._id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className={`p-4 hover:bg-[#1f2937]/50 transition-colors flex items-center justify-between group ${task.completed ? 'bg-[#0f172a]/50' : ''}`}
                    >
                      <div className="flex items-start gap-4 flex-1">
                        <button 
                          onClick={() => toggleTask(task)}
                          className="mt-1 flex-shrink-0 focus:outline-none relative"
                        >
                          {task.completed ? (
                            <div className="w-6 h-6 rounded bg-primary-500 flex items-center justify-center shadow-[0_0_10px_rgba(34,197,94,0.5)]">
                              <Check className="w-4 h-4 text-[#020617] font-bold" />
                            </div>
                          ) : (
                            <div className="w-6 h-6 rounded bg-[#1F2937] border border-[#374151] hover:border-primary-500 transition-colors" />
                          )}
                        </button>
                        
                        <div className="flex-1 min-w-0">
                          <p className={`text-lg transition-all font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-200'}`}>
                            {task.title}
                          </p>
                          {task.description && (
                            <p className="text-sm text-gray-400 mt-0.5 truncate">{task.description}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 ml-4">
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                        
                        <button 
                          onClick={() => deleteTask(task._id)}
                          className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all focus:outline-none focus:opacity-100"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>

        {/* Add Task Form - Dark Theme */}
        <div className="lg:col-span-1">
          <div className="bg-[#111827] p-6 rounded-2xl shadow-xl border border-[#1F2937] top-6 sticky">
            <h3 className="font-semibold text-gray-200 mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary-500" />
              New Quest
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="What needs to be done?"
                  className="w-full px-3 py-2 bg-[#0f172a] border border-[#1F2937] text-gray-200 rounded-lg focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all placeholder-gray-600"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-1">Description <span className="text-xs text-gray-600">(Optional)</span></label>
                <textarea 
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Add details..."
                  className="w-full px-3 py-2 bg-[#0f172a] border border-[#1F2937] text-gray-200 rounded-lg focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all resize-none h-24 placeholder-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Priority</label>
                <div className="flex gap-2">
                  {['Low', 'Medium', 'High'].map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`flex-1 py-1.5 text-sm font-medium rounded-lg border transition-all ${
                        priority === p 
                          ? getPriorityColor(p) + ' bg-opacity-20' 
                          : 'bg-[#0f172a] text-gray-400 border-[#1F2937] hover:bg-[#1f2937]'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-2.5 mt-2 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-bold rounded-lg shadow-[0_0_10px_rgba(34,197,94,0.3)] transition-all flex items-center justify-center gap-2"
              >
                Accept Quest
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Planner;
