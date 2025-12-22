
import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIconLucide, 
  Edit2, 
  Coffee,
  Zap,
  ChevronDown,
  Settings,
  Circle,
  Edit3
} from 'lucide-react';
import { ACTIVITY_ICONS, ACTIVITY_COLORS } from '../constants';
import { ActivityType, PlanDay, TargetUnit } from '../types';

interface Props {
  plan: PlanDay[];
  setPlan: (p: PlanDay[]) => void;
  year: number;
  setYear: (y: number) => void;
  month: number;
  setMonth: (m: number) => void;
}

const SprintPlan: React.FC<Props> = ({ plan, setPlan, year, setYear, month, setMonth }) => {
  const [planTitle, setPlanTitle] = useState('部署计划记录');
  const [planSubtitle, setPlanSubtitle] = useState('配置您的周度 Sprint 模板，持续迭代身体素质');

  const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y: number, m: number) => new Date(y, m, 1).getDay();
  const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];

  const daysCount = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const handleUpdateDay = (index: number, updates: Partial<PlanDay>) => {
    const newPlan = [...plan];
    newPlan[index] = { ...newPlan[index], ...updates };
    setPlan(newPlan);
  };

  return (
    <div className="space-y-6 pb-6 animate-in slide-in-from-right-4 duration-500">
      <header className="px-1">
        <div className="flex items-center gap-2 group">
          <input 
            className="text-3xl font-black text-slate-800 uppercase tracking-tighter bg-transparent border-none outline-none focus:ring-2 focus:ring-indigo-100 rounded-lg w-full transition-all" 
            value={planTitle} 
            onChange={e => setPlanTitle(e.target.value)}
          />
          <span className="text-indigo-600 text-2xl shrink-0">🗓️</span>
          <Edit3 size={16} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
        </div>
        <div className="flex items-center gap-2 group mt-1">
          <input 
            className="text-slate-400 text-sm font-medium bg-transparent border-none outline-none focus:ring-2 focus:ring-indigo-100 rounded-lg w-full transition-all" 
            value={planSubtitle} 
            onChange={e => setPlanSubtitle(e.target.value)}
          />
          <Edit3 size={14} className="text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
        </div>
      </header>

      {/* Calendar Module */}
      <div className="bg-white rounded-[2.5rem] p-7 shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-[1.25rem] flex items-center justify-center shadow-xl shadow-indigo-100">
              <CalendarIconLucide size={24} className="text-white" />
            </div>
            <div>
              <div className="font-black text-slate-800 text-lg">{year}年 {monthNames[month]}</div>
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Deployment Timeline</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => month === 0 ? (setMonth(11), setYear(year-1)) : setMonth(month-1)} className="p-3 bg-slate-50 hover:bg-indigo-50 rounded-xl text-slate-400 hover:text-indigo-600 transition-all">
              <ChevronLeft size={20} />
            </button>
            <button onClick={() => month === 11 ? (setMonth(0), setYear(year+1)) : setMonth(month+1)} className="p-3 bg-slate-50 hover:bg-indigo-50 rounded-xl text-slate-400 hover:text-indigo-600 transition-all">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-y-6 text-center">
          {['日', '一', '二', '三', '四', '五', '六'].map(d => (
            <span key={d} className="text-[11px] font-black text-slate-300 uppercase tracking-widest">{d}</span>
          ))}
          {Array.from({ length: firstDay }).map((_, i) => <div key={`off-${i}`} />)}
          {Array.from({ length: daysCount }).map((_, i) => {
            const dayNum = i + 1;
            const weekDayIndex = new Date(year, month, dayNum).getDay();
            const actualPlanIndex = weekDayIndex === 0 ? 6 : weekDayIndex - 1;
            const dayPlan = plan[actualPlanIndex];
            const isToday = dayNum === new Date().getDate() && month === new Date().getMonth();

            return (
              <div key={dayNum} className="flex flex-col items-center gap-2 group cursor-pointer">
                <span className={`text-[11px] font-black w-7 h-7 flex items-center justify-center rounded-xl transition-all ${isToday ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 group-hover:bg-slate-50'}`}>
                  {dayNum}
                </span>
                <div className="h-6 flex items-center justify-center">
                  {dayPlan.isRest ? <Coffee size={14} className="text-slate-200" /> : dayPlan.task !== 'REST' && React.cloneElement(ACTIVITY_ICONS[dayPlan.task as ActivityType] as React.ReactElement<any>, { size: 16 })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Weekly Configuration List (Replacing Table for better visibility) */}
      <div className="space-y-4">
        <div className="flex items-center gap-4 px-2">
          <div className="w-10 h-10 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
            <Settings size={20} />
          </div>
          <div>
            <h3 className="font-black text-slate-800 uppercase tracking-tighter">周度配置模板</h3>
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Weekly Configuration</p>
          </div>
        </div>

        <div className="space-y-3">
          {plan.map((dayPlan, idx) => (
            <div 
              key={dayPlan.day} 
              className={`bg-white rounded-[1.5rem] p-4 shadow-sm border border-slate-50 transition-all ${dayPlan.isRest ? 'opacity-60 bg-slate-50/50' : 'hover:border-indigo-100 hover:shadow-md'}`}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 text-center">
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest block">{dayPlan.day}</span>
                    <div className={`w-2 h-2 rounded-full mx-auto mt-1 ${dayPlan.isRest ? 'bg-slate-200' : 'bg-indigo-600 animate-pulse'}`}></div>
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <select 
                      disabled={dayPlan.isRest} 
                      className="bg-transparent outline-none font-black text-sm text-slate-800 disabled:text-slate-400 cursor-pointer" 
                      value={dayPlan.task} 
                      onChange={e => handleUpdateDay(idx, { task: e.target.value as ActivityType })}
                    >
                      {Object.values(ActivityType).map(t => <option key={t} value={t}>{t}</option>)}
                      <option value="REST">休整中</option>
                    </select>
                    
                    {!dayPlan.isRest && (
                      <div className="flex items-center gap-2">
                        <input 
                          type="text" 
                          className="w-12 bg-slate-50 rounded-lg px-2 py-1 text-[10px] font-black text-slate-700 outline-none focus:ring-1 focus:ring-indigo-200" 
                          value={dayPlan.targetValue} 
                          onChange={e => handleUpdateDay(idx, { targetValue: e.target.value })} 
                        />
                        <select 
                          className="text-[10px] font-black text-indigo-400 outline-none bg-transparent" 
                          value={dayPlan.targetUnit} 
                          onChange={e => handleUpdateDay(idx, { targetUnit: e.target.value as TargetUnit })}
                        >
                          <option value="min">MIN</option>
                          <option value="km">KM</option>
                          <option value="m">M</option>
                          <option value="次">次</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>

                <button 
                  onClick={() => handleUpdateDay(idx, { isRest: !dayPlan.isRest })} 
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all whitespace-nowrap ${dayPlan.isRest ? 'bg-slate-100 text-slate-400' : 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'}`}
                >
                  {dayPlan.isRest ? '休整日' : '部署日'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SprintPlan;
