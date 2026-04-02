import React from 'react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const TrendLineChart = ({ data }) => {
  return (
    <div className="h-64 mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1F2937" />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#9CA3AF', fontSize: 12 }}
            tickFormatter={(val) => val.split('-').slice(1).join('/')} 
          />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#111827', borderRadius: '12px', borderColor: '#1F2937', color: '#E5E7EB', boxShadow: '0 0 15px rgba(139, 92, 246, 0.2)' }}
            itemStyle={{ color: '#22C55E' }}
          />
          <Line 
            type="monotone" 
            dataKey="completed" 
            stroke="#22C55E" 
            strokeWidth={4} 
            dot={{ r: 4, fill: '#111827', stroke: '#22C55E', strokeWidth: 2 }} 
            activeDot={{ r: 8, fill: '#22C55E', stroke: '#8B5CF6', strokeWidth: 2 }} 
            style={{ filter: 'drop-shadow(0 0 8px rgba(34,197,94,0.5))' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export const CompletionPieChart = ({ data }) => {
  // Theme: Green for complete, Dark Gray/Purple for pending
  const COLORS = ['#22C55E', '#1F2937'];

  return (
    <div className="h-48 flex items-center justify-center relative">
      <div className="absolute inset-0 bg-primary-500/5 blur-3xl pointer-events-none rounded-full" />
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={85}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} style={{ filter: index === 0 ? 'drop-shadow(0 0 5px rgba(34,197,94,0.5))' : 'none' }} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: '#111827', borderRadius: '12px', borderColor: '#1F2937', color: '#E5E7EB' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
