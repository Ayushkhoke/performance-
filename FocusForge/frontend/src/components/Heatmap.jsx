import React from 'react';

const Heatmap = ({ data }) => {
  if (!data || data.length === 0) return <div className="text-gray-500 text-sm">No recorded activity yet.</div>;
  
  // Create an array of 365 days or just the past 30 days based on data
  const today = new Date();
  const daysArray = Array.from({ length: 30 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (29 - i));
    const dateStr = d.toISOString().split('T')[0];
    
    // Find if data exists
    const dayData = data.find(item => item.date === dateStr);
    return {
      date: dateStr,
      level: dayData ? dayData.level : 0,
      completed: dayData ? dayData.completed : 0
    };
  });

  const getDayColor = (level) => {
    switch(level) {
      case 1: return 'bg-primary-900 shadow-[0_0_5px_rgba(34,197,94,0.2)]';
      case 2: return 'bg-primary-700 shadow-[0_0_8px_rgba(34,197,94,0.4)]';
      case 3: return 'bg-primary-500 shadow-[0_0_12px_rgba(34,197,94,0.6)]';
      default: return 'bg-[#1F2937]'; // level 0 (Dark mode)
    }
  };

  return (
    <div className="p-6 bg-[#111827] rounded-2xl shadow-xl border border-[#1F2937] relative overflow-hidden">
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl" />
      <h3 className="text-lg font-semibold text-gray-200 mb-4 z-10 relative">Quests Completed (30 Days)</h3>
      <div className="flex gap-1.5 flex-wrap z-10 relative">
        {daysArray.map((day, idx) => (
          <div 
            key={idx} 
            title={`${day.date}: ${day.completed} quests`}
            className={`w-4 h-4 rounded-[3px] ${getDayColor(day.level)} hover:ring-2 ring-primary-400 transition-all cursor-pointer`}
          />
        ))}
      </div>
      <div className="flex gap-2 items-center mt-6 text-xs text-gray-500 z-10 relative">
        <span>Less</span>
        <div className="w-3 h-3 bg-[#1F2937] rounded-[3px]"></div>
        <div className="w-3 h-3 bg-primary-900 rounded-[3px]"></div>
        <div className="w-3 h-3 bg-primary-700 rounded-[3px]"></div>
        <div className="w-3 h-3 bg-primary-500 rounded-[3px] shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
        <span>More</span>
      </div>
    </div>
  );
};

export default Heatmap;
