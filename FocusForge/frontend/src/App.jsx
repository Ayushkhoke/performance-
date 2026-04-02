import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Planner from './pages/Planner';
import Collection from './pages/Collection';
import Leaderboard from './pages/Leaderboard';
import CrewLeaderboard from './pages/CrewLeaderboard';
import Layout from './components/Layout';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TaskProvider>
          <div className="min-h-screen font-sans text-gray-100 bg-transparent selection:bg-primary-500/30">
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              
              <Route element={<Layout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/planner" element={<Planner />} />
                <Route path="/collection" element={<Collection />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/crew-leaderboard" element={<CrewLeaderboard />} />
              </Route>
            </Routes>
          </div>
        </TaskProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
