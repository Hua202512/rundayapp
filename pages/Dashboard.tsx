
import React, { useState, useRef } from 'react';
import { 
  Edit2, 
  Zap, 
  Trash2, 
  Camera, 
  Clock, 
  Navigation, 
  History, 
  Scale, 
  Target,
  ChevronRight,
  Coffee,
  CircleDot,
  Database,
  RefreshCw,
  HardDrive,
  Moon,
  Users,
  PlusCircle,
  TrendingUp,
  Heart,
  Share2,
  Copy,
  MessageCircle,
  QrCode,
  X,
  Check
} from 'lucide-react';
import { CommitRecord, ActivityType, PlanDay } from '../types';
import { ACTIVITY_ICONS, ACTIVITY_COLORS } from '../constants';

interface FriendStatus {
  id: string;
  name: string;
  avatar: string;
  lastActivity: string;
  value: string;
  unit: string;
  isCommitted: boolean;
  score: number;
}

interface Props {
  commits: CommitRecord[];
  currentWeight: number;
  initialWeight: number;
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
  setInitialWeight: (v: number) => void;
  setTargetWeight: (v: number) => void;
  setWeeklyGoal: (v: number) => void;
  onDeleteCommit: (id: string) => void;
  onUpdateCommit: (id: string, updates: Partial<CommitRecord>) => void;
  onCheckIn: () => void;
  onViewPlan: () => void;
  onResetData?: () => void;
}

const MOCK_FRIENDS: FriendStatus[] = [
  { id: '1', name: 'Alpha', avatar: '🦁', lastActivity: '跑步', value: '5.2', unit: 'km', isCommitted: true, score: 85 },
  { id: '2', name: 'Beta', avatar: '🦊', lastActivity: '力量', value: '45', unit: 'min', isCommitted: true, score: 92 },
  { id: '3', name: 'Gamma', avatar: '🦉', lastActivity: '待定', value: '0', unit: '', isCommitted: false, score: 45 },
  { id: '4', name: 'Delta', avatar: '🐲', lastActivity: '骑行', value: '12', unit: 'km', isCommitted: true, score: 78 },
];

const Dashboard: React.FC<Props> = (props) => {
  const { 
    commits, currentWeight, initialWeight, targetWeight, userName, systemStatus, avatar, 
    weeklyGoal, currentDayPlan, setUserName, setSystemStatus, setAvatar, 
    setInitialWeight, setTargetWeight, setWeeklyGoal, 
    onDeleteCommit, onUpdateCommit, onCheckIn, onViewPlan, onResetData
  } = props;

  const [editMode, setEditMode] = useState<'NONE' | 'HEADER' | 'WEIGHT_TARGET' | 'GOALS'>('NONE');
  const [tempName, setTempName] = useState(userName);
  const [tempStatus, setTempStatus] = useState(systemStatus);
  const [tempInitial, setTempInitial] = useState(initialWeight.toString());
  const [tempTarget, setTempTarget] = useState(targetWeight.toString());
  const [tempWeekly, setTempWeekly] = useState(weeklyGoal.toString());
  
  const [editingCommitId, setEditingCommitId] = useState<string | null>(null);
  const [editCommitData, setEditCommitData] = useState<Partial<CommitRecord>>({});
  
  const [selectedFriend, setSelectedFriend] = useState<FriendStatus | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [copyStatus, setCopyStatus] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const diffTotal = initialWeight - targetWeight || 1;
  const weightProgress = Math.min(100, Math.max(0, ((initialWeight - currentWeight) / diffTotal) * 100));

  const currentWeekCommits = commits.filter(c => {
    try {
      const parts = c.date.split('/');
      const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      const now = new Date();
      return (now.getTime() - d.getTime()) < 7 * 24 * 60 * 60 * 1000;
    } catch(e) {
      return false;
    }
  }).length;

  const saveHeader = () => { setUserName(tempName); setSystemStatus(tempStatus); setEditMode('NONE'); };
  const saveWeightTarget = () => { 
    setInitialWeight(parseFloat(tempInitial)); 
    setTargetWeight(parseFloat(tempTarget)); 
    setEditMode('NONE'); 
  };
  const saveGoals = () => { setWeeklyGoal(parseInt(tempWeekly)); setEditMode('NONE'); };

  const handleEdit = (commit: CommitRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingCommitId(commit.id);
    setEditCommitData({ ...commit });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://devfitness.app/join/${userName.toLowerCase()}`);
    setCopyStatus(true);
    setTimeout(() => setCopyStatus(false), 2000);
  };

  return (
    <div className="space-y-6 pb-4 animate-in fade-in duration-700 relative">
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => setAvatar(reader.result as string);
          reader.readAsDataURL(file);
        }
      }} />
      
      {/* 邀请好友弹窗 */}
      {showInviteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in zoom-in-95 duration-300">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowInviteModal(false)}></div>
          <div className="bg-white w-full max-w-sm rounded-[3rem] p-8 relative shadow-2xl overflow-hidden">
            <button 
              onClick={() => setShowInviteModal(false)}
              className="absolute top-6 right-6 p-2 bg-slate-50 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="space-y-8">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-4">
                   <Users size={32} />
                </div>
                <h2 className="text-xl font-black text-slate-800 tracking-tight">邀请战友加入 SQUAD</h2>
                <p className="text-xs text-slate-400 font-medium">共同挑战 10KG 减重目标，同步运动 Commits</p>
              </div>

              <div className="space-y-3">
                <button 
                  className="w-full flex items-center justify-between p-4 bg-emerald-500 hover:bg-emerald-600 rounded-2xl text-white transition-all active:scale-95 shadow-lg shadow-emerald-100 group"
                  onClick={() => alert("已生成微信分享卡片，请通过系统分享发送给好友")}
                >
                  <div className="flex items-center gap-3">
                    <MessageCircle size={24} fill="white" />
                    <span className="text-sm font-black uppercase tracking-widest">微信好友邀请</span>
                  </div>
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="flex items-center gap-3">
                  <button 
                    onClick={handleCopyLink}
                    className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-2xl border-2 border-dashed transition-all ${copyStatus ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-100 text-slate-600 hover:border-indigo-200'}`}
                  >
                    {copyStatus ? <Check size={20} /> : <Copy size={20} />}
                    <span className="text-sm font-black uppercase tracking-widest">{copyStatus ? '已复制链接' : '复制专属链接'}</span>
                  </button>
                  <button className="w-16 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-slate-100">
                    <QrCode size={20} />
                  </button>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest text-center mb-3">当前 Squad 席位: 4/8</p>
                <div className="flex justify-center -space-x-3">
                  {MOCK_FRIENDS.map(f => (
                    <div key={f.id} className="w-10 h-10 bg-white border-2 border-slate-50 rounded-full flex items-center justify-center text-lg shadow-sm">
                      {f.avatar}
                    </div>
                  ))}
                  <div className="w-10 h-10 bg-indigo-50 border-2 border-dashed border-indigo-200 rounded-full flex items-center justify-center text-indigo-400">
                    <PlusCircle size={16} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 用户头部 */}
      <div className="flex justify-between items-start pt-2 px-1">
        <div className="flex-1">
          {editMode === 'HEADER' ? (
            <div className="space-y-3 bg-white p-4 rounded-[2rem] border border-indigo-100 shadow-xl">
              <input className="w-full text-xl font-bold bg-slate-50 rounded-xl px-3 py-2 outline-none" value={tempName} onChange={e => setTempName(e.target.value)} />
              <input className="w-full text-xs text-slate-500 bg-slate-50 rounded-xl px-3 py-2 outline-none" value={tempStatus} onChange={e => setTempStatus(e.target.value)} />
              <div className="flex gap-2 justify-between items-center mt-4">
                <button onClick={onResetData} className="text-[10px] font-black text-red-400 uppercase tracking-tighter flex items-center gap-1">
                   <RefreshCw size={10} /> 清空缓存
                </button>
                <div className="flex gap-2">
                  <button onClick={() => setEditMode('NONE')} className="text-xs font-bold text-slate-400">取消</button>
                  <button onClick={saveHeader} className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold shadow-lg">确定</button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-between items-start">
              <div onClick={() => setEditMode('HEADER')} className="group cursor-pointer">
                <h1 className="text-3xl font-black tracking-tighter text-slate-800 group-hover:text-indigo-600 transition-colors flex items-center gap-2">
                  你好, {userName}! <Edit2 size={16} className="opacity-0 group-hover:opacity-100 text-indigo-300" />
                </h1>
                <p className="text-slate-400 text-sm mt-1 font-medium">{systemStatus}</p>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[9px] font-black uppercase tracking-tighter border border-emerald-100 shadow-sm animate-pulse">
                <HardDrive size={10} /> Local Synced
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 体重看板 */}
      <div className="bg-gradient-to-br from-indigo-500 to-blue-600 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group border border-white/20">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl transition-colors group-hover:bg-white/20"></div>
        <div className="flex justify-between items-start relative z-10">
          <div className="space-y-1 flex-1">
            {editMode === 'WEIGHT_TARGET' ? (
              <div className="space-y-4 animate-in slide-in-from-left-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <span className="text-[9px] font-black opacity-60 uppercase tracking-widest">初始体重</span>
                    <input type="number" step="0.1" className="w-full bg-white/20 rounded-xl px-3 py-2 outline-none text-white font-bold" value={tempInitial} onChange={e => setTempInitial(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-black opacity-60 uppercase tracking-widest">目标体重</span>
                    <input type="number" step="0.1" className="w-full bg-white/20 rounded-xl px-3 py-2 outline-none text-white font-bold" value={tempTarget} onChange={e => setTempTarget(e.target.value)} />
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <button onClick={saveWeightTarget} className="flex-1 py-2 bg-white text-indigo-600 rounded-xl text-[10px] font-black uppercase shadow-lg">完成设置</button>
                  <button onClick={() => setEditMode('NONE')} className="px-4 py-2 text-white/60 text-[10px] font-bold">取消</button>
                </div>
              </div>
            ) : (
              <div onClick={() => setEditMode('WEIGHT_TARGET')} className="cursor-pointer group/weight">
                <div className="flex items-baseline gap-2">
                  <span className="text-7xl font-black tracking-tighter leading-none">{currentWeight}</span>
                  <span className="text-xl font-bold text-white/60 uppercase">KG</span>
                  <Edit2 size={16} className="text-white/40 opacity-0 group-hover/weight:opacity-100 ml-2" />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                   <div className="bg-white/10 px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2 hover:bg-white/30 transition-all">
                      <span className="text-[9px] font-bold opacity-60 uppercase tracking-tighter">初始:</span>
                      <span className="text-xs font-black">{initialWeight} KG</span>
                   </div>
                   <div className="bg-white/10 px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2 hover:bg-white/30 transition-all">
                      <span className="text-[9px] font-bold opacity-60 uppercase tracking-tighter">目标:</span>
                      <span className="text-xs font-black">{targetWeight} KG</span>
                   </div>
                </div>
              </div>
            )}
          </div>
          <div onClick={() => fileInputRef.current?.click()} className="w-20 h-20 bg-white/20 rounded-3xl backdrop-blur-md flex items-center justify-center border border-white/30 cursor-pointer overflow-hidden relative shadow-inner">
            {avatar ? <img src={avatar} className="w-full h-full object-cover" /> : <span className="text-5xl">🐼</span>}
          </div>
        </div>
        <div className="mt-8 space-y-3 relative z-10">
          <div className="flex justify-between text-[11px] font-black uppercase tracking-widest px-1">
            <span className="text-white/80">减重进度: {Math.round(weightProgress)}%</span>
            <span className="text-emerald-300 font-black">已减: {(initialWeight - currentWeight).toFixed(1)} KG</span>
          </div>
          <div className="h-3 bg-black/10 rounded-full overflow-hidden border border-white/10 p-[1px]">
            <div className="h-full bg-white rounded-full transition-all duration-1000" style={{ width: `${weightProgress}%` }}></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div onClick={onViewPlan} className="bg-white rounded-[2rem] p-5 shadow-sm border border-slate-100 flex flex-col justify-between cursor-pointer active:scale-95 transition-all">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-orange-50 rounded-xl flex items-center justify-center text-orange-500"><Zap size={16} /></div>
            <h3 className="font-black text-slate-800 text-[10px] uppercase tracking-widest">今日运动目标</h3>
          </div>
          {currentDayPlan.isRest ? (
            <div className="py-2 flex items-center gap-2"><Coffee size={18} className="text-slate-300" /><span className="text-xs font-black text-slate-400 uppercase">Rest...</span></div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2"><div className="text-indigo-600">{ACTIVITY_ICONS[currentDayPlan.task as ActivityType]}</div><span className="text-xs font-black text-slate-700 truncate">{currentDayPlan.task}</span></div>
              <p className="text-[10px] font-bold text-slate-400 px-1">{currentDayPlan.targetValue} {currentDayPlan.targetUnit.toUpperCase()}</p>
            </div>
          )}
        </div>

        <div onClick={() => setEditMode('GOALS')} className="bg-white rounded-[2rem] p-5 shadow-sm border border-slate-100 flex flex-col justify-between cursor-pointer active:scale-95 transition-all relative overflow-hidden group">
          {editMode === 'GOALS' ? (
            <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-20 p-4 flex flex-col justify-center gap-2 animate-in fade-in" onClick={e => e.stopPropagation()}>
               <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest text-center">每周目标次数</span>
               <input 
                 type="number" 
                 className="bg-indigo-50 rounded-xl px-2 py-2 outline-none font-black text-center text-indigo-600" 
                 value={tempWeekly} 
                 onChange={e => setTempWeekly(e.target.value)} 
                 autoFocus
               />
               <button onClick={saveGoals} className="py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase shadow-lg shadow-indigo-100 mt-1">确定</button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600"><Target size={16} /></div>
                <h3 className="font-black text-slate-800 text-[10px] uppercase tracking-widest">打卡进度</h3>
                <Edit2 size={10} className="ml-auto text-slate-200 group-hover:text-indigo-300 opacity-0 group-hover:opacity-100 transition-all" />
              </div>
              <div className="space-y-2">
                 <div className="flex justify-between items-baseline">
                   <span className="text-2xl font-black text-slate-800 leading-none">{currentWeekCommits}</span>
                   <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">/ {weeklyGoal} 次</span>
                 </div>
                 <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                   <div className="h-full bg-indigo-500 rounded-full transition-all duration-700" style={{ width: `${Math.min(100, (currentWeekCommits / weeklyGoal) * 100)}%` }}></div>
                 </div>
              </div>
            </>
          )}
        </div>
      </div>

      <button onClick={onCheckIn} className="w-full py-5 bg-indigo-50 border-2 border-dashed border-indigo-200 rounded-[2rem] text-indigo-600 font-black text-sm hover:bg-indigo-100 transition-all flex items-center justify-center gap-3 group uppercase tracking-widest">
        <Zap size={20} className="group-hover:animate-bounce" /> 提交打卡，同步状态
      </button>

      <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100 space-y-5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600"><Users size={18} /></div>
            <div>
              <h3 className="font-black text-slate-800 text-sm uppercase tracking-tighter">协作小组 (DEV SQUAD)</h3>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">10KG 减重突击队</p>
            </div>
          </div>
          <button 
            onClick={() => setShowInviteModal(true)}
            className="p-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl transition-all shadow-lg shadow-emerald-100 active:scale-90 group"
          >
            <PlusCircle size={20} className="group-hover:rotate-90 transition-transform" />
          </button>
        </div>

        <div className="relative flex items-center gap-4 overflow-x-auto no-scrollbar pb-2 px-1">
          {MOCK_FRIENDS.map(friend => (
            <div 
              key={friend.id} 
              onClick={() => setSelectedFriend(selectedFriend?.id === friend.id ? null : friend)}
              className="flex flex-col items-center gap-2 shrink-0 cursor-pointer group"
            >
              <div className={`relative p-0.5 rounded-full border-2 transition-all ${friend.isCommitted ? 'border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'border-slate-100 opacity-60'}`}>
                <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center text-2xl shadow-inner group-hover:scale-105 transition-transform">
                  {friend.avatar}
                </div>
                {friend.isCommitted && (
                  <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-1 border-2 border-white">
                    <Zap size={8} fill="currentColor" />
                  </div>
                )}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-1 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500" style={{ width: `${friend.score}%` }}></div>
                </div>
              </div>
              <span className="text-[10px] font-black text-slate-500 uppercase">{friend.name}</span>
            </div>
          ))}
          
          <div 
            onClick={() => setShowInviteModal(true)}
            className="flex flex-col items-center gap-2 shrink-0 cursor-pointer group"
          >
            <div className="w-14 h-14 border-2 border-dashed border-slate-100 rounded-full flex items-center justify-center text-slate-200 group-hover:border-emerald-300 group-hover:text-emerald-400 transition-all">
              <PlusCircle size={24} />
            </div>
            <span className="text-[8px] font-black text-slate-300 uppercase">待邀请</span>
          </div>
          
          {selectedFriend && (
            <div className="absolute top-0 right-0 bg-white/95 backdrop-blur-md border border-emerald-100 rounded-3xl p-4 shadow-xl z-20 animate-in slide-in-from-right-4 w-48">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[11px] font-black text-slate-800">{selectedFriend.name} 的今日状态</span>
                <Heart size={12} className="text-red-400 fill-current" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-indigo-50 rounded flex items-center justify-center text-indigo-500"><TrendingUp size={10} /></div>
                  <span className="text-[10px] font-bold text-slate-500">{selectedFriend.lastActivity}: {selectedFriend.value} {selectedFriend.unit}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-emerald-50 rounded flex items-center justify-center text-emerald-500"><Target size={10} /></div>
                  <span className="text-[10px] font-bold text-slate-500">周贡献: {selectedFriend.score} PTS</span>
                </div>
                <button className="w-full mt-2 py-1.5 bg-emerald-600 text-white text-[9px] font-black uppercase rounded-lg shadow-lg shadow-emerald-100 active:scale-95 transition-all">
                  🔥 发送激励
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3 px-2">
           <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm border border-slate-100"><History size={20} /></div>
           <h3 className="font-black text-slate-800 uppercase tracking-tighter">近期打卡</h3>
        </div>

        <div className="space-y-4">
          {commits.length === 0 ? (
            <div className="bg-white rounded-[2rem] p-10 text-center border border-dashed border-slate-200 text-slate-300 text-[10px] font-black uppercase tracking-widest">暂无记录</div>
          ) : (
            commits.map(commit => (
              <div key={commit.id} className="bg-white rounded-[2.5rem] p-5 shadow-sm border border-slate-50 group hover:border-indigo-100 transition-all relative overflow-hidden">
                {editingCommitId === commit.id ? (
                  <div className="space-y-4 animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">运动时长 (MIN)</label>
                        <input type="number" className="w-full p-2.5 bg-slate-50 rounded-xl text-xs font-bold border border-slate-100 outline-none focus:border-indigo-200" value={editCommitData.duration} onChange={e => setEditCommitData({...editCommitData, duration: parseInt(e.target.value) || 0})} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">当前体重 (KG)</label>
                        <input type="number" step="0.1" className="w-full p-2.5 bg-slate-50 rounded-xl text-xs font-bold border border-slate-100 outline-none focus:border-indigo-200" value={editCommitData.weight} onChange={e => setEditCommitData({...editCommitData, weight: parseFloat(e.target.value) || undefined})} placeholder="可选" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">运动距离</label>
                        <input type="number" step="0.1" className="w-full p-2.5 bg-slate-50 rounded-xl text-xs font-bold border border-slate-100 outline-none focus:border-indigo-200" value={editCommitData.distance} onChange={e => setEditCommitData({...editCommitData, distance: parseFloat(e.target.value) || 0})} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">单位</label>
                        <select className="w-full p-2.5 bg-slate-50 rounded-xl text-xs font-black border border-slate-100 outline-none focus:border-indigo-200 appearance-none" value={editCommitData.distanceUnit} onChange={e => setEditCommitData({...editCommitData, distanceUnit: e.target.value as any})}>
                          <option value="km">KM</option>
                          <option value="m">M</option>
                          <option value="次">次</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">感悟记录</label>
                      <textarea className="w-full p-3 bg-slate-50 rounded-xl text-xs border border-slate-100 outline-none focus:border-indigo-200 resize-none h-20" value={editCommitData.note} onChange={e => setEditCommitData({...editCommitData, note: e.target.value})} placeholder="修改心得..." />
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button onClick={(e) => { e.stopPropagation(); onUpdateCommit(editingCommitId, editCommitData); setEditingCommitId(null); }} className="flex-1 py-3 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase shadow-lg shadow-indigo-100 transition-transform active:scale-95">保存修改</button>
                      <button onClick={(e) => { e.stopPropagation(); setEditingCommitId(null); }} className="flex-1 py-3 bg-slate-100 text-slate-400 rounded-2xl text-[10px] font-black uppercase transition-transform active:scale-95">取消</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 ${ACTIVITY_COLORS[commit.type]} rounded-2xl overflow-hidden flex items-center justify-center shadow-inner border border-slate-100 shrink-0`}>
                          {commit.image ? <img src={commit.image} className="w-full h-full object-cover" alt="快照" /> : React.cloneElement(ACTIVITY_ICONS[commit.type] as React.ReactElement<any>, { size: 28 })}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-black text-slate-800 flex items-center gap-2 text-sm">{commit.type}</h4>
                          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400"><Clock size={10} /> {commit.duration}m</div>
                            
                            {commit.weight && (
                              <div className="flex items-center gap-1.5 text-[10px] font-black text-white bg-emerald-500 px-2.5 py-1 rounded-full shadow-lg shadow-emerald-100">
                                <Scale size={10} strokeWidth={3} /> {commit.weight} <span className="text-[8px] opacity-80 uppercase tracking-tighter">KG</span>
                              </div>
                            )}

                            {commit.distance !== undefined && commit.distance > 0 && (
                              <div className="flex items-center gap-1.5 text-[10px] font-black text-white bg-sky-500 px-2.5 py-1 rounded-full shadow-lg shadow-sky-100">
                                <Navigation size={10} strokeWidth={3} /> {commit.distance} <span className="text-[8px] opacity-80 uppercase tracking-tighter">{commit.distanceUnit?.toUpperCase() || 'KM'}</span>
                              </div>
                            )}

                            {commit.sleepDuration && (
                              <div className="flex items-center gap-1.5 text-[10px] font-black text-white bg-indigo-400 px-2.5 py-1 rounded-full shadow-lg shadow-indigo-50 animate-in fade-in">
                                <Moon size={10} strokeWidth={3} /> {commit.sleepDuration} <span className="text-[8px] opacity-80 uppercase tracking-tighter">H</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <span className="text-orange-500 font-black text-lg tracking-tighter leading-none">-{commit.calories} <span className="text-[9px] uppercase">kcal</span></span>
                        <div className="flex gap-2">
                          <button onClick={(e) => handleEdit(commit, e)} className="p-2.5 bg-slate-50 hover:bg-indigo-50 rounded-xl text-slate-300 hover:text-indigo-600 transition-all border border-slate-100 active:scale-90"><Edit2 size={14} /></button>
                          <button onClick={(e) => { e.stopPropagation(); if(window.confirm("彻底删除该记录？")) onDeleteCommit(commit.id); }} className="p-2.5 bg-slate-50 hover:bg-red-50 rounded-xl text-slate-300 hover:text-red-500 transition-all border border-slate-100 active:scale-90 group/del"><Trash2 size={14} className="group-hover/del:rotate-12 transition-transform" /></button>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-50/80">
                      <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-1"><History size={10} /> {commit.date}</div>
                    </div>
                    <p className="text-[11px] text-slate-500 italic bg-slate-50/50 p-3 rounded-2xl border border-slate-100/30 line-clamp-2">"{commit.note || 'No notes provided'}"</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
