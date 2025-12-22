
import React, { useState } from 'react';
import { 
  Home as HomeIcon, 
  Calendar, 
  ClipboardCheck, 
  BarChart3 
} from 'lucide-react';
import { ViewType, CommitRecord, ActivityType, PlanDay } from './types';
import Dashboard from './pages/Dashboard';
import SprintPlan from './pages/SprintPlan';
import CheckIn from './pages/CheckIn';
import Stats from './pages/Stats';

const INITIAL_PLAN: PlanDay[] = [
  { day: 'Mon', task: ActivityType.RUNNING, targetValue: '5', targetUnit: 'km', isRest: false },
  { day: 'Tue', task: ActivityType.STRENGTH, targetValue: '45', targetUnit: 'min', isRest: false },
  { day: 'Wed', task: 'REST', targetValue: '10000', targetUnit: 'm', isRest: true },
  { day: 'Thu', task: ActivityType.WEIGHTED_WALK, targetValue: '60', targetUnit: 'min', isRest: false },
  { day: 'Fri', task: ActivityType.STRENGTH, targetValue: '45', targetUnit: 'min', isRest: false },
  { day: 'Sat', task: ActivityType.HIKING, targetValue: '10', targetUnit: 'km', isRest: false },
  { day: 'Sun', task: ActivityType.SWIMMING, targetValue: '1000', targetUnit: 'm', isRest: false },
];

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('HOME');
  
  // User Profile States
  const [userName, setUserName] = useState('DevCoder');
  const [systemStatus, setSystemStatus] = useState('保持自律，代码与身材齐飞');
  const [avatar, setAvatar] = useState<string>('');
  
  // Goal States
  const [weeklyGoal, setWeeklyGoal] = useState(4);
  const [monthlyGoal, setMonthlyGoal] = useState(16);
  
  // Health & Metric States
  const [weight, setWeight] = useState(82.1);
  const [targetWeight, setTargetWeight] = useState(76.0);

  // Plan States
  const [weeklyPlan, setWeeklyPlan] = useState<PlanDay[]>(INITIAL_PLAN);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  // 计算当前当天的计划
  const getTodayPlan = () => {
    const today = new Date().getDay(); // 0 是周日, 1 是周一
    const index = today === 0 ? 6 : today - 1; // 转换为 0=周一, 6=周日
    return weeklyPlan[index];
  };

  const [commits, setCommits] = useState<CommitRecord[]>([
    {
      id: '1',
      date: new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }),
      type: ActivityType.SWIMMING,
      duration: 30,
      distance: 1,
      calories: 225,
      note: 'Initial commit: 系统初始化成功，第一行代码已跑通。',
    }
  ]);

  const addCommit = (commit: Omit<CommitRecord, 'id' | 'calories'>) => {
    const calories = commit.duration * 7.5; 
    const newCommit: CommitRecord = {
      ...commit,
      id: Date.now().toString(),
      calories: Math.round(calories)
    };
    setCommits([newCommit, ...commits]);
    if (commit.weight) setWeight(commit.weight);
    setActiveView('HOME');
  };

  const deleteCommit = (id: string) => {
    setCommits(prev => prev.filter(c => c.id !== id));
  };

  const updateCommit = (id: string, updates: Partial<CommitRecord>) => {
    setCommits(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const renderView = () => {
    switch (activeView) {
      case 'HOME': return (
        <Dashboard 
          commits={commits} 
          currentWeight={weight} 
          targetWeight={targetWeight} 
          userName={userName}
          systemStatus={systemStatus}
          avatar={avatar}
          weeklyGoal={weeklyGoal}
          monthlyGoal={monthlyGoal}
          currentDayPlan={getTodayPlan()}
          setUserName={setUserName}
          setSystemStatus={setSystemStatus}
          setAvatar={setAvatar}
          setWeight={setWeight}
          setTargetWeight={setTargetWeight}
          setWeeklyGoal={setWeeklyGoal}
          setMonthlyGoal={setMonthlyGoal}
          onDeleteCommit={deleteCommit}
          onUpdateCommit={updateCommit}
          onCheckIn={() => setActiveView('CHECKIN')} 
          onViewPlan={() => setActiveView('PLAN')}
        />
      );
      case 'PLAN': return (
        <SprintPlan 
          plan={weeklyPlan} 
          setPlan={setWeeklyPlan} 
          year={selectedYear} 
          setYear={setSelectedYear}
          month={selectedMonth}
          setMonth={setSelectedMonth}
        />
      );
      case 'CHECKIN': return <CheckIn onCommit={addCommit} />;
      case 'STATS': return <Stats commits={commits} currentWeight={weight} />;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-slate-50 relative overflow-hidden shadow-2xl border-x border-slate-200">
      <div className="flex-1 overflow-y-auto no-scrollbar pb-24 px-4 pt-6">
        {renderView()}
      </div>

      <nav className="absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-100 flex justify-around items-center py-3 safe-area-bottom shadow-[0_-4px_15px_rgba(0,0,0,0.06)] z-50">
        <NavItem icon={<HomeIcon />} label="首页" active={activeView === 'HOME'} onClick={() => setActiveView('HOME')} />
        <NavItem icon={<Calendar />} label="计划" active={activeView === 'PLAN'} onClick={() => setActiveView('PLAN')} />
        <NavItem icon={<ClipboardCheck />} label="打卡" active={activeView === 'CHECKIN'} onClick={() => setActiveView('CHECKIN')} />
        <NavItem icon={<BarChart3 />} label="统计" active={activeView === 'STATS'} onClick={() => setActiveView('STATS')} />
      </nav>
    </div>
  );
};

const NavItem: React.FC<{ icon: React.ReactNode, label: string, active: boolean, onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1 transition-all duration-300 ${active ? 'text-indigo-600 scale-110' : 'text-slate-400'}`}>
    <div className="transition-transform">
      {React.cloneElement(icon as React.ReactElement<any>, { size: 22 })}
    </div>
    <span className="text-[10px] font-bold tracking-tight">{label}</span>
  </button>
);

export default App;
