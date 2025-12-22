
import React, { useState } from 'react';
import { 
  Flame, 
  Calendar, 
  Navigation,
  BarChart2,
  TrendingDown,
  Moon,
  Edit3,
  CalendarDays
} from 'lucide-react';
import { 
  ComposedChart,
  // Add BarChart to fix the missing import error
  BarChart,
  Line, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  Legend
} from 'recharts';
import { CommitRecord } from '../types';

interface Props {
  commits: CommitRecord[];
  currentWeight: number;
}

const Stats: React.FC<Props> = ({ commits, currentWeight }) => {
  const [statsTitle, setStatsTitle] = useState('数据统计');
  const [statsSubtitle, setStatsSubtitle] = useState('身体好不好，运动数据说了算');
  const [range, setRange] = useState<7 | 30>(7);

  // 根据选定的 range (7或30) 提取数据
  const displayCommits = [...commits].reverse().slice(-range);
  
  const chartData = displayCommits.length > 0 
    ? displayCommits.map(c => ({
        name: c.date.split('/')[2] + '日', // 格式化日期显示
        weight: c.weight || currentWeight,
        duration: c.duration,
      }))
    : [];

  const sleepData = displayCommits.length > 0
    ? displayCommits.map(c => ({
        name: c.date.split('/')[2] + '日',
        hours: c.sleepDuration || 0,
      }))
    : [];

  // 计算占比数据
  const typeCounts: Record<string, number> = {};
  commits.forEach(c => {
    typeCounts[c.type] = (typeCounts[c.type] || 0) + 1;
  });
  
  const totalCommits = commits.length || 1;
  const typeDistribution = Object.entries(typeCounts).map(([name, count]) => ({
    name,
    count,
    value: Math.round((count / totalCommits) * 100),
  })).sort((a, b) => b.count - a.count);

  const totalCalories = commits.reduce((sum, c) => sum + c.calories, 0);
  const totalDistance = commits.reduce((sum, c) => sum + (c.distance || 0), 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <header className="px-1 flex justify-between items-end">
        <div className="flex-1">
          <div className="flex items-center gap-2 group">
            <input 
              className="text-2xl font-black text-slate-800 uppercase tracking-tighter bg-transparent border-none outline-none focus:ring-0 w-full" 
              value={statsTitle} 
              onChange={e => setStatsTitle(e.target.value)}
            />
            <Edit3 size={16} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
          </div>
          <div className="flex items-center gap-2 group mt-1">
            <input 
              className="text-slate-400 text-sm font-medium bg-transparent border-none outline-none focus:ring-0 w-full" 
              value={statsSubtitle} 
              onChange={e => setStatsSubtitle(e.target.value)}
            />
            <Edit3 size={14} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
          </div>
        </div>

        {/* 范围选择 Toggle */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner">
          <button 
            onClick={() => setRange(7)}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${range === 7 ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}
          >
            7D
          </button>
          <button 
            onClick={() => setRange(30)}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${range === 30 ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}
          >
            30D
          </button>
        </div>
      </header>

      {/* 顶部指标卡片 */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard icon={<Flame size={18} className="text-orange-500" />} label="累计热量" value={`${totalCalories}`} color="bg-orange-50" />
        <StatCard icon={<Calendar size={18} className="text-indigo-500" />} label="打卡天数" value={`${commits.length}`} color="bg-indigo-50" />
        <StatCard icon={<Navigation size={18} className="text-sky-500" />} label="累计距离" value={`${totalDistance.toFixed(1)}`} color="bg-sky-50" />
      </div>

      {/* 复合身体性能曲线 */}
      <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-6 px-1">
          <div className="flex items-center gap-2 font-black uppercase tracking-tighter text-slate-800">
            <TrendingDown size={18} className="text-indigo-600" /> 身体性能综合看板
          </div>
          <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-lg">
            {range === 7 ? 'Weekly Sprint' : 'Monthly Analysis'}
          </span>
        </div>

        <div className="h-72 w-full px-1">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#cbd5e1', fontWeight: 'bold' }} 
              />
              <YAxis 
                yAxisId="left"
                orientation="left"
                stroke="#94a3b8"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 9, fontWeight: 'bold' }}
                domain={['dataMin - 5', 'dataMax + 5']}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                stroke="#6366f1"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 9, fontWeight: 'bold' }}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', fontSize: '11px' }} 
              />
              <Legend 
                verticalAlign="top" 
                align="right" 
                iconType="circle"
                wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', paddingBottom: '20px', textTransform: 'uppercase' }}
              />
              <Bar 
                yAxisId="left" 
                dataKey="weight" 
                name="体重(KG)" 
                fill="#e2e8f0" 
                radius={[6, 6, 0, 0]} 
                barSize={range === 7 ? 20 : 8}
              />
              <Line 
                yAxisId="right" 
                type="monotone" 
                dataKey="duration" 
                name="时长(MIN)" 
                stroke="#6366f1" 
                strokeWidth={3} 
                dot={{ r: 3, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 5, strokeWidth: 0 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <p className="text-center text-[10px] text-slate-300 font-bold mt-4 italic uppercase tracking-widest">
          Integrated Performance Metrics ({range} Records)
        </p>
      </div>

      {/* 睡眠时长图表 */}
      <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100">
        <div className="flex items-center gap-2 font-black mb-6 px-1">
          <div className="w-8 h-8 bg-indigo-50 rounded-xl flex items-center justify-center">
            <Moon size={16} className="text-indigo-600" />
          </div>
          <span className="uppercase tracking-tighter text-slate-800">睡眠质量监测 (h)</span>
        </div>
        <div className="h-48 w-full px-1">
           <ResponsiveContainer width="100%" height="100%">
            {/* BarChart is correctly used here and now properly imported */}
            <BarChart data={sleepData}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#cbd5e1', fontWeight: 'bold' }} 
              />
              <Bar dataKey="hours" radius={[8, 8, 0, 0]}>
                {sleepData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === sleepData.length - 1 ? '#6366f1' : '#f1f5f9'} />
                ))}
              </Bar>
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 运动模块占比 */}
      <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100 space-y-6 pb-8">
        <div className="flex items-center gap-2 font-black uppercase tracking-tighter px-1 text-slate-800">
          <BarChart2 size={18} className="text-indigo-600" /> 核心负载分布
        </div>

        <div className="space-y-6 px-1">
          {typeDistribution.length > 0 ? typeDistribution.map(item => (
            <div key={item.name} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-black text-slate-700 uppercase tracking-tight">{item.name}</span>
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{item.value}% ({item.count}次)</span>
              </div>
              <div className="w-full h-2.5 bg-slate-50 rounded-full overflow-hidden border border-slate-100 p-[1px]">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-1000" style={{ width: `${item.value}%` }}></div>
              </div>
            </div>
          )) : (
            <div className="text-center py-10 text-slate-300 text-[10px] font-black uppercase tracking-[0.2em]">尚无运动占比数据</div>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode, label: string, value: string, color: string }> = ({ icon, label, value, color }) => (
  <div className="bg-white rounded-[2rem] p-4 shadow-sm border border-slate-100 flex flex-col items-center text-center transition-transform hover:scale-[1.02]">
    <div className={`w-10 h-10 ${color} rounded-2xl flex items-center justify-center mb-3 shadow-inner`}>
      {icon}
    </div>
    <span className="text-xl font-black text-slate-800 tracking-tighter">{value}</span>
    <span className="text-[8px] text-slate-300 font-black uppercase tracking-[0.15em] mt-1">{label}</span>
  </div>
);

export default Stats;
