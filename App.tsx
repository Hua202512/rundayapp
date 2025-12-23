
import React, { useState, useMemo, useEffect } from 'react';
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

const STORAGE_KEYS = {
  COMMITS: 'devfitness_commits_v1',
  USER_CONFIG: 'devfitness_user_config_v1',
  PLAN: 'devfitness_plan_v1'
};

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('HOME');
  
  // 核心状态初始化（优先从本地存储读取）
  const [userName, setUserName] = useState(() => localStorage.getItem('userName') || 'DevCoder');
  const [systemStatus, setSystemStatus] = useState(() => localStorage.getItem('systemStatus') || '保持自律，系统性能最优解');
  const [avatar, setAvatar] = useState(() => localStorage.getItem('avatar') || '');
  const [initialWeight, setInitialWeight] = useState(() => Number(localStorage.getItem('initialWeight')) || 85.0);
  const [targetWeight, setTargetWeight] = useState(() => Number(localStorage.getItem('targetWeight')) || 75.0);
  const [weeklyGoal, setWeeklyGoal] = useState(() => Number(localStorage.getItem('weeklyGoal')) || 4);

  const [weeklyPlan, setWeeklyPlan] = useState<PlanDay[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PLAN);
    return saved ? JSON.parse(saved) : INITIAL_PLAN;
  });

  const [commits, setCommits] = useState<CommitRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COMMITS);
    return saved ? JSON.parse(saved) : [];
  });

  // 持久化副作用：监听状态变化并保存到 LocalStorage
  useEffect(() => {
    localStorage.setItem('userName', userName);
    localStorage.setItem('systemStatus', systemStatus);
    localStorage.setItem('avatar', avatar);
    localStorage.setItem('initialWeight', initialWeight.toString());
    localStorage.setItem('targetWeight', targetWeight.toString());
    localStorage.setItem('weeklyGoal', weeklyGoal.toString());
  }, [userName, systemStatus, avatar, initialWeight, targetWeight, weeklyGoal]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COMMITS, JSON.stringify(commits));
  }, [commits]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PLAN, JSON.stringify(weeklyPlan));
  }, [weeklyPlan]);

  // 计算当前“实时体重”
  const currentWeight = useMemo(() => {
    const lastWeightCommit = commits.find(c => c.weight !== undefined);
    return lastWeightCommit?.weight ?? initialWeight;
  }, [commits, initialWeight]);

  const getTodayPlan = () => {
    const today = new Date().getDay();
    const index = today === 0 ? 6 : today - 1;
    return weeklyPlan[index];
  };

  const addCommit = (commit: Omit<CommitRecord, 'id' | 'calories'>) => {
    const calories = commit.duration * 7.5; 
    const newCommit: CommitRecord = {
      ...commit,
      id: Date.now().toString(),
      calories: Math.round(calories)
    };
    setCommits(prev => [newCommit, ...prev]);
    setActiveView('HOME');
  };

  const deleteCommit = (id: string) => {
    setCommits(prevCommits => prevCommits.filter(c => c.id !== id));
  };

  const updateCommit = (id: string, updates: Partial<CommitRecord>) => {
    setCommits(prev => prev.map(c => {
      if (c.id === id) {
        const updated = { ...c, ...updates };
        // 如果时长变了，重新计算卡路里
        if (updates.duration !== undefined) {
          updated.calories = Math.round(updates.duration * 7.5);
        }
        return updated;
      }
      return c;
    }));
  };

  const clearAllData = () => {
    if (window.confirm("确定要清空所有本地数据吗？此操作不可撤销。")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const renderView = () => {
    switch (activeView) {
      case 'HOME': return (
        <Dashboard 
          commits={commits} 
          currentWeight={currentWeight} 
          initialWeight={initialWeight}
          targetWeight={targetWeight} 
          userName={userName}
          systemStatus={systemStatus}
          avatar={avatar}
          weeklyGoal={weeklyGoal}
          monthlyGoal={16}
          currentDayPlan={getTodayPlan()}
          setUserName={setUserName}
          setSystemStatus={setSystemStatus}
          setAvatar={setAvatar}
          setInitialWeight={setInitialWeight}
          setTargetWeight={setTargetWeight}
          setWeeklyGoal={setWeeklyGoal}
          onDeleteCommit={deleteCommit}
          onUpdateCommit={updateCommit}
          onCheckIn={() => setActiveView('CHECKIN')} 
          onViewPlan={() => setActiveView('PLAN')}
          onResetData={clearAllData}
        />
      );
      case 'PLAN': return (
        <SprintPlan 
          plan={weeklyPlan} 
          setPlan={setWeeklyPlan} 
          year={new Date().getFullYear()} 
          setYear={() => {}} 
          month={new Date().getMonth()}
          setMonth={() => {}}
        />
      );
      case 'CHECKIN': return <CheckIn onCommit={addCommit} />;
      case 'STATS': return <Stats commits={commits} currentWeight={currentWeight} />;
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
