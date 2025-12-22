
import React, { useState, useRef } from 'react';
import { 
  Edit2, 
  ChevronRight, 
  Zap, 
  Target, 
  Trash2, 
  Check, 
  X, 
  Camera, 
  ClipboardCheck,
  LayoutDashboard,
  Save,
  RotateCcw,
  Moon,
  Coffee,
  Clock,
  Navigation,
  History,
  Flag,
  CircleDot
} from 'lucide-react';
import { CommitRecord, ActivityType, PlanDay } from '../types';
import { ACTIVITY_ICONS, ACTIVITY_COLORS } from '../constants';

interface Props {
  commits: CommitRecord[];
  currentWeight: number;
  targetWeight: number;
  userName: string;
  systemStatus: string;
  avatar: string;
  weeklyGoal: number;
  monthlyGoal: number;
  currentDayPlan: PlanDay;
  setUserName: (v: string) => void;
  setSystemStatus: (v: string) => void;
  setAvatar: (v: string) => void;
  setWeight: (v: number) => void;
  setTargetWeight: (v: number) => void;
  setWeeklyGoal: (v: number) => void;
  setMonthlyGoal: (v: number) => void;
  onDeleteCommit: (id: string) => void;
  onUpdateCommit: (id: string, updates: Partial<CommitRecord>) => void;
  onCheckIn: () => void;
  onViewPlan: () => void;
}

const Dashboard: React.FC<Props> = (props) => {
  const { 
    commits, currentWeight, targetWeight, userName, systemStatus, avatar, 
    weeklyGoal, monthlyGoal, currentDayPlan, setUserName, setSystemStatus, setAvatar, 
    setWeight, setTargetWeight, setWeeklyGoal, setMonthlyGoal, 
    onDeleteCommit, onUpdateCommit, onCheckIn, onViewPlan
  } = props;

  const [editMode, setEditMode] = useState<'NONE' | 'HEADER' | 'WEIGHT' | 'GOALS' | string>('NONE');
  const [tempName, setTempName] = useState(userName);
  const [tempStatus, setTempStatus] = useState(systemStatus);
  const [tempWeight, setTempWeight] = useState(currentWeight.toString());
  const [tempTarget, setTempTarget] = useState(targetWeight.toString());
  const [tempWeekly, setTempWeekly] = useState(weeklyGoal.toString());
  const [tempMonthly, setTempMonthly] = useState(monthlyGoal.toString());
  
  const [editingCommitId, setEditingCommitId] = useState<string | null>(null);
  const [editCommitData, setEditCommitData] = useState<Partial<CommitRecord>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);
  const todayStr = new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' });
  
  // 进度计算
  const progressPercent = Math.min(100, Math.max(0, ((85 - currentWeight) / (85 - targetWeight)) * 100));

  const saveHeader = () => { setUserName(tempName); setSystemStatus(tempStatus); setEditMode('NONE'); };
  const saveWeight = () => { setWeight(parseFloat(tempWeight)); setTargetWeight(parseFloat(tempTarget)); setEditMode('NONE'); };
  const saveGoals = () => { setWeeklyGoal(parseInt(tempWeekly)); setMonthlyGoal(parseInt(tempMonthly)); setEditMode('NONE'); };

  const startEditCommit = (commit: CommitRecord) => {
    setEditingCommitId(commit.id);
    setEditCommitData({ ...commit });
  };

  const saveCommitEdit = () => {
    if (editingCommitId) {
      onUpdateCommit(editingCommitId, editCommitData);
      setEditingCommitId(null);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatar(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 pb-4 animate-in fade-in duration-700">
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={handleAvatarChange} 
      />
      
      {/* Header Section */}
      <div className="flex justify-between items-start pt-2">
        <div className="flex-1">
          {editMode === 'HEADER' ? (
            <div className="space-y-3 bg-white p-4 rounded-[2rem] border border-indigo-100 shadow-xl animate-in zoom-in-95">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">用户名</label>
                <input className="w-full text-xl font-bold bg-slate-50 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-100" value={tempName} onChange={e => setTempName(e.target.value)} placeholder="用户名" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">个性口号</label>
                <input className="w-full text-xs text-slate-500 bg-slate-50 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-100" value={tempStatus} onChange={e => setTempStatus(e.target.value)} placeholder="输入您的个性口号..." />
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <button onClick={() => setEditMode('NONE')} className="px-4 py-2 text-slate-400 text-xs font-bold">取消</button>
                <button onClick={saveHeader} className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-100">保存更新</button>
              </div>
            </div>
          ) : (
            <div onClick={() => setEditMode('HEADER')} className="group cursor-pointer">
              <h1 className="text-3xl font-black tracking-tighter text-slate-800 group-hover:text-indigo-600 transition-colors flex items-center gap-2">
                你好, {userName}! <Edit2 size={16} className="opacity-0 group-hover:opacity-100 text-indigo-300" />
              </h1>
              <p className="text-slate-400 text-sm mt-1 font-medium">{systemStatus}</p>
            </div>
          )}
        </div>
      </div>

      {/* 1. Weight Console Card */}
      <div className="bg-gradient-to-br from-sky-400 to-blue-500 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-blue-200/40 relative overflow-hidden group border border-white/20">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-colors"></div>
        <div className="flex justify-between items-start relative z-10">
          <div className="space-y-1">
            <p className="text-white/80 text-[11px] font-black uppercase tracking-widest mb-3">初始 (体重)</p>
            {editMode === 'WEIGHT' ? (
              <div className="space-y-4 animate-in slide-in-from-left-4">
                <input type="number" step="0.1" className="w-32 text-5xl font-black bg-white/20 rounded-2xl px-4 py-2 text-white outline-none border border-white/30 focus:bg-white/30" value={tempWeight} onChange={e => setTempWeight(e.target.value)} />
                <div className="flex items-center gap-2 text-sm font-bold text-white/70">
                  <span>目标值:</span>
                  <input type="number" step="0.1" className="w-20 bg-white/10 rounded-lg px-2 py-1 text-white border border-white/20" value={tempTarget} onChange={e => setTempTarget(e.target.value)} />
                </div>
                <div className="flex gap-2">
                  <button onClick={saveWeight} className="flex-1 py-3 bg-white text-blue-600 rounded-xl font-black text-xs transition-all shadow-lg hover:scale-105 active:scale-95">同步数据</button>
                  <button onClick={() => setEditMode('NONE')} className="px-4 py-3 bg-blue-700/30 rounded-xl text-xs text-white">取消</button>
                </div>
              </div>
            ) : (
              <div onClick={() => setEditMode('WEIGHT')} className="cursor-pointer group/val">
                <div className="flex items-baseline gap-2">
                  <span className="text-7xl font-black tracking-tighter leading-none text-white drop-shadow-sm">{currentWeight}</span>
                  <span className="text-xl font-bold text-white/60 uppercase tracking-tighter">KG</span>
                  <Edit2 size={16} className="text-white/40 opacity-0 group-hover/val:opacity-100 ml-2 transition-opacity" />
                </div>
                <div className="flex items-center gap-2 mt-4 text-white/80 text-[11px] font-bold">
                  <div className="w-5 h-5 rounded-full border border-white/30 flex items-center justify-center">
                    <CircleDot size={12} className="text-white" />
                  </div>
                  <span>距离目标还有 <span className="text-white font-black">{(currentWeight - targetWeight).toFixed(1)} KG</span></span>
                </div>
              </div>
            )}
          </div>
          
          {/* Avatar Area */}
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-20 h-20 bg-white/20 rounded-[1.75rem] backdrop-blur-md flex items-center justify-center border border-white/30 shadow-inner group-hover:scale-105 transition-transform duration-500 relative cursor-pointer overflow-hidden"
          >
            {avatar ? (
              <img src={avatar} className="w-full h-full object-cover" />
            ) : (
              <span className="text-5xl animate-pulse filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.1)]">🐼</span>
            )}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
               <Camera size={18} className="text-white" />
            </div>
          </div>
        </div>
        
        <div className="mt-10 space-y-3 relative z-10">
          <div className="flex justify-between text-[11px] font-black uppercase tracking-widest px-0.5">
            <span className="text-white/80">减脂进度: <span className="text-white">{Math.round(progressPercent)}%</span></span>
            <span className="text-white/90">目标: {targetWeight} KG</span>
          </div>
          <div className="h-3 bg-black/10 rounded-full overflow-hidden border border-white/10 p-[1px]">
            <div className="h-full bg-gradient-to-r from-white/60 via-white to-white/60 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(255,255,255,0.4)] relative" style={{ width: `${progressPercent}%` }}>
              <div className="absolute top-0 right-0 h-full w-4 bg-white/40 blur-sm"></div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Today's Goal Card */}
      <div 
        onClick={onViewPlan}
        className="bg-white rounded-[2rem] p-5 shadow-sm border border-slate-100 flex items-center justify-between group cursor-pointer active:scale-[0.98] transition-all hover:shadow-md hover:border-indigo-100"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:rotate-12 transition-transform shadow-inner">
            {currentDayPlan.isRest ? <Coffee size={24} /> : (currentDayPlan.task !== 'REST' && ACTIVITY_ICONS[currentDayPlan.task]) || <LayoutDashboard size={24} />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">今日运动目标</span>
              <span className={`px-2 py-0.5 text-white text-[9px] font-black rounded-full ${currentDayPlan.isRest ? 'bg-slate-400' : 'bg-emerald-500'}`}>
                {currentDayPlan.isRest ? '休整中' : '进行中'}
              </span>
            </div>
            <p className="font-black text-slate-800">
              {currentDayPlan.isRest ? '休整日，睡个好觉' : `${currentDayPlan.task} • ${currentDayPlan.targetValue} ${currentDayPlan.targetUnit.toUpperCase()}`}
            </p>
            <p className="text-[10px] text-indigo-500 font-bold mt-0.5">点击查看周计划</p>
          </div>
        </div>
        <ChevronRight className="text-slate-200 group-hover:text-indigo-500 transition-colors" />
      </div>

      {/* Check-in Goals Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm border border-slate-100">
              <ClipboardCheck size={20} />
            </div>
            <div>
              <h3 className="font-black text-slate-800 uppercase tracking-tighter">打卡目标</h3>
              <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Check-in Sprint</p>
            </div>
          </div>
          <button onClick={() => setEditMode(editMode === 'GOALS' ? 'NONE' : 'GOALS')} className={`p-2 rounded-xl transition-all ${editMode === 'GOALS' ? 'bg-indigo-600 text-white' : 'bg-white shadow-sm border border-slate-100 text-slate-300 hover:text-indigo-600'}`}>
            <Edit2 size={18} />
          </button>
        </div>

        <div className="bg-white rounded-[2.5rem] p-7 shadow-sm border border-slate-100">
          {editMode === 'GOALS' ? (
            <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">每周打卡次数</label>
                <input type="number" className="w-full p-4 bg-slate-50 rounded-2xl font-black text-indigo-600 outline-none focus:ring-2 focus:ring-indigo-100" value={tempWeekly} onChange={e => setTempWeekly(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">每月打卡次数</label>
                <input type="number" className="w-full p-4 bg-slate-50 rounded-2xl font-black text-indigo-600 outline-none focus:ring-2 focus:ring-indigo-100" value={tempMonthly} onChange={e => setTempMonthly(e.target.value)} />
              </div>
              <button onClick={saveGoals} className="col-span-2 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-100">更新打卡目标</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6">
              <GoalProgress label="周打卡" current={commits.length} target={weeklyGoal} color="bg-indigo-500" />
              <GoalProgress label="月打卡" current={commits.length} target={monthlyGoal} color="bg-emerald-500" />
            </div>
          )}
        </div>
      </div>

      <button onClick={onCheckIn} className="w-full py-5 bg-indigo-50 border-2 border-dashed border-indigo-200 rounded-[2rem] text-indigo-600 font-black text-sm hover:bg-indigo-100 transition-all flex items-center justify-center gap-3 group uppercase tracking-widest">
        <Zap size={20} className="group-hover:animate-bounce" /> 强悍如你，继续打卡
      </button>

      {/* Activity Logs Section (Moved below the Check-in button) */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm border border-slate-100">
              <History size={20} />
            </div>
            <div>
              <h3 className="font-black text-slate-800 uppercase tracking-tighter">近期打卡</h3>
            </div>
          </div>
          <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-black rounded-full border border-slate-200/50">{commits.length} 条</span>
        </div>

        <div className="space-y-4">
          {commits.map(commit => (
            <div key={commit.id} className="bg-white rounded-[2rem] p-5 shadow-sm border border-slate-50 group transition-all hover:border-indigo-100">
              {editingCommitId === commit.id ? (
                <div className="space-y-4 animate-in zoom-in-95">
                  <div className="grid grid-cols-2 gap-2">
                    <select className="p-2 bg-slate-50 rounded-xl text-xs font-bold" value={editCommitData.type} onChange={e => setEditCommitData({...editCommitData, type: e.target.value as ActivityType})}>
                      {Object.values(ActivityType).map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <div className="flex items-center bg-slate-50 rounded-xl px-2">
                      <input type="number" className="flex-1 p-2 bg-transparent text-xs font-bold outline-none" value={editCommitData.duration} onChange={e => setEditCommitData({...editCommitData, duration: parseInt(e.target.value)})} placeholder="时长" />
                      <span className="text-[10px] font-black text-slate-300">MIN</span>
                    </div>
                  </div>
                  <div className="flex items-center bg-slate-50 rounded-xl px-2">
                    <input type="number" className="flex-1 p-2 bg-transparent text-xs font-bold outline-none" value={editCommitData.distance} onChange={e => setEditCommitData({...editCommitData, distance: parseFloat(e.target.value)})} placeholder="数值" />
                    <select className="text-[10px] font-black text-indigo-500 bg-transparent outline-none" value={editCommitData.distanceUnit || 'km'} onChange={e => setEditCommitData({...editCommitData, distanceUnit: e.target.value as 'km' | 'm' | '次'})}>
                      <option value="km">KM</option>
                      <option value="m">M</option>
                      <option value="次">次</option>
                    </select>
                  </div>
                  <textarea className="w-full p-3 bg-slate-50 rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-100" value={editCommitData.note} onChange={e => setEditCommitData({...editCommitData, note: e.target.value})} placeholder="输入备注..." />
                  <div className="flex gap-2">
                    <button onClick={saveCommitEdit} className="flex-1 py-2 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase">保存修改</button>
                    <button onClick={() => setEditingCommitId(null)} className="px-4 py-2 bg-slate-100 text-slate-400 rounded-xl text-[10px] font-black uppercase">取消</button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 ${ACTIVITY_COLORS[commit.type]} rounded-2xl flex items-center justify-center shadow-inner`}>
                        {React.cloneElement(ACTIVITY_ICONS[commit.type] as React.ReactElement<any>, { size: 28 })}
                      </div>
                      <div>
                        <h4 className="font-black text-slate-800 flex items-center gap-2 text-sm">
                          {commit.type}
                          {commit.date === todayStr && <span className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse shadow-[0_0_8px_rgba(79,70,229,0.5)]"></span>}
                        </h4>
                        <div className="flex items-center gap-3 mt-1">
                          <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                            <Clock size={10} className="text-slate-300" /> {commit.duration} min
                          </div>
                          {commit.distance ? (
                            <div className="flex items-center gap-1 text-[10px] font-bold text-indigo-400">
                              <Navigation size={10} className="text-indigo-300" /> {commit.distance} {commit.distanceUnit || 'km'}
                            </div>
                          ) : null}
                          <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{commit.date}</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-orange-500 font-black text-lg tracking-tighter">-{commit.calories}</span>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => startEditCommit(commit)} className="p-2 bg-slate-50 hover:bg-indigo-50 rounded-lg text-slate-300 hover:text-indigo-600 transition-colors">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => { if(confirm("确定要回滚此数据提交吗？")) onDeleteCommit(commit.id); }} className="p-2 bg-slate-50 hover:bg-red-50 rounded-lg text-slate-300 hover:text-red-500 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {commit.sleepDuration !== undefined && (
                    <div className="flex items-center gap-3 py-2 px-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <Moon size={14} className="text-indigo-500" />
                      <div className="flex-1 flex justify-between items-center">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">今日睡眠</span>
                        <div className="text-xs font-bold text-slate-700">
                          {commit.sleepDuration}H <span className="text-[10px] text-indigo-400 ml-1">[{commit.sleepQuality || '良好'}]</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <p className="text-[11px] text-slate-500 italic line-clamp-1">"{commit.note || '无提交信息'}"</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const GoalProgress: React.FC<{ label: string, current: number, target: number, color: string }> = ({ label, current, target, color }) => (
  <div className="space-y-3">
    <div className="flex justify-between items-end">
      <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{label}</span>
      <div className="text-xs font-black">
        <span className="text-indigo-600">{current}</span>
        <span className="text-slate-200 mx-1">/</span>
        <span className="text-slate-400">{target}</span>
      </div>
    </div>
    <div className="h-2.5 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
      <div className={`h-full ${color} rounded-full transition-all duration-1000`} style={{ width: `${Math.min(100, (current/target)*100)}%` }}></div>
    </div>
  </div>
);

export default Dashboard;
