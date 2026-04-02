import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { motion } from 'framer-motion';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await signup(name, email, password);
    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#020617] text-gray-100 overflow-hidden relative">
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none flex items-center justify-center">
        {/* Cinematic Grand Line background */}
        <motion.img 
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5 }}
          src="https://images.unsplash.com/photo-1500534314209-a25dfb31bcce?q=80&w=2000&auto=format&fit=crop" 
          alt="Grand Line Ocean" 
          className="w-full h-full object-cover filter contrast-125 brightness-50 sepia-[.3]"
          style={{ mixBlendMode: 'luminosity' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/80 to-transparent" />
      </div>

      <div className="flex-1 flex items-center justify-center z-10 px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md p-8 bg-[#111827]/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-[#1F2937] relative"
        >
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-secondary-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="text-center mb-8 relative z-10">
            <h1 className="text-4xl font-bold tracking-tighter text-white drop-shadow-md">
              Focus<span className="text-primary-500 drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]">Forge</span>
            </h1>
            <p className="text-gray-400 mt-2 font-medium tracking-wide">Begin your Grand Line journey</p>
          </div>

          {error && (
            <div className="mb-6 p-3 text-sm font-medium text-red-400 bg-red-500/10 rounded-xl border border-red-500/20 flex items-center gap-2">
              <span className="animate-pulse">⚠</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            <div>
              <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Alias / Name</label>
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-[#0f172a] border border-[#1F2937] text-white rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none placeholder-gray-600"
                placeholder="Straw Hat"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Transponder Snail (Email)</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-[#0f172a] border border-[#1F2937] text-white rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none placeholder-gray-600"
                placeholder="pirate@grandline.com"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Secret Code</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[#0f172a] border border-[#1F2937] text-white rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none placeholder-gray-600"
                placeholder="••••••••"
              />
            </div>
            <button 
              type="submit"
              className="w-full py-3.5 px-4 mt-4 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-bold tracking-wide rounded-xl shadow-[0_0_15px_rgba(34,197,94,0.3)] transition-all duration-200 transform hover:-translate-y-0.5"
            >
              Raise the Flag
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500 relative z-10">
            Already have a bounty? <Link to="/login" className="text-primary-400 hover:text-primary-300 font-bold hover:underline drop-shadow-sm">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
