import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { LayoutDashboard, CheckSquare, LogOut, Code2, Users, Trophy } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  const NavLink = ({ to, icon: Icon, label }) => {
    const isActive = location.pathname === to;
    return (
      <Link 
        to={to} 
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
          isActive 
            ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20 shadow-[0_0_15px_rgba(34,197,94,0.1)]' 
            : 'text-gray-400 hover:bg-[#1f2937]/50 hover:text-gray-200'
        }`}
      >
        <Icon className={`w-5 h-5 ${isActive ? 'drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]' : ''}`} />
        {label}
      </Link>
    );
  };

  return (
    <nav className="fixed w-64 h-screen bg-[#111827]/80 backdrop-blur-xl border-r border-[#1F2937] p-6 flex flex-col shadow-2xl z-50">
      <div className="flex items-center gap-2 mb-10 pl-2">
        <Code2 className="text-primary-500 w-8 h-8 drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
        <span className="text-2xl font-bold tracking-tight text-white drop-shadow-md">
          Focus<span className="text-primary-500">Forge</span>
        </span>
      </div>

      <div className="flex-1 space-y-3">
        <NavLink to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
        <NavLink to="/planner" icon={CheckSquare} label="Daily Planner" />
        
        <div className="pt-4 pb-1">
          <p className="px-4 text-xs font-bold uppercase tracking-wider text-gray-500">Pirate Rank</p>
        </div>
        <NavLink to="/collection" icon={Users} label="Crew Collection" />
        <NavLink to="/leaderboard" icon={Trophy} label="Power Ranking" />
        <NavLink to="/crew-leaderboard" icon={Users} label="Crew Leaderboard" />
      </div>

      <div className="mt-auto border-t border-[#1F2937] pt-6">
        <div className="flex items-center gap-3 mb-6 px-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-lg shadow-[0_0_10px_rgba(34,197,94,0.3)] ring-2 ring-[#1F2937]">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-gray-100 truncate">{user.name}</p>
            <p className="text-xs text-primary-400 font-medium">
              Bounty: <span className="font-mono text-gold drop-shadow-[0_0_5px_rgba(250,204,21,0.5)]">฿{user.bounty?.toLocaleString() || 0}</span>
            </p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-all w-full font-medium"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
