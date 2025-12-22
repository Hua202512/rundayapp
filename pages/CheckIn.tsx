
import React, { useState, useRef } from 'react';
import { 
  Check, 
  Camera, 
  MapPin, 
  Clock, 
  Scale, 
  Navigation, 
  Edit3,
  X,
  Loader2,
  Moon
} from 'lucide-react';
import { ActivityType, CommitRecord } from '../types';
import { ACTIVITY_ICONS } from '../constants';

interface Props {
  onCommit: (commit: Omit<CommitRecord, 'id' | 'calories'>) => void;
}

const CheckIn: React.FC<Props> = ({ onCommit }) => {
  const [selectedType, setSelectedType] = useState<ActivityType>(ActivityType.RUNNING);
  const [duration, setDuration] = useState('30');
  const [weight, setWeight] = useState('');
  const [distance, setDistance] = useState('0.0');
  const [distanceUnit, setDistanceUnit] = useState<'km' | 'm' | '次'>('km');
  const [note, setNote] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [location, setLocation] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);
  
  const [headerTitle, setHeaderTitle] = useState('打卡记录');

  const [sleepDuration, setSleepDuration] = useState('7.0');
  const [sleepQuality, setSleepQuality] = useState<'极好' | '良好' | '一般' | '较差'>('良好');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePush = () => {
    onCommit({
      date: new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }),
      type: selectedType,
      duration: parseInt(duration) || 0,
      weight: weight ? parseFloat(weight) : undefined,
      distance: parseFloat(distance) || 0,
      distanceUnit: distanceUnit,
      note: location ? `[坐标: ${location}] ${note}` : note,
      image: image || undefined,
      sleepDuration: parseFloat(sleepDuration),
      sleepQuality: sleepQuality
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) return alert('当前设备不支持地理位置获取');
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation(`${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
        setLocating(false);
      },
      (err) => {
        console.error(err);
        alert('获取位置失败，请检查系统权限');
        setLocating(false);
      }
    );
  };

  return (
    <div className="space-y-6 pb-40 animate-in fade-in duration-500">
      <header className="px-1">
        <div className="flex items-center gap-2 group">
          <input 
            className="text-3xl font-black text-slate-800 uppercase tracking-tighter bg-transparent border-none outline-none focus:ring-0 w-full" 
            value={headerTitle} 
            onChange={e => setHeaderTitle(e.target.value)}
          />
          <Edit3 size={16} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
        </div>
      </header>

      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />

      <div className="bg-white rounded-[2.5rem] p-7 shadow-sm border border-slate-100 space-y-4">
        <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] px-1">运动类型</h3>
        <div className="grid grid-cols-4 gap-3">
          {Object.values(ActivityType).map(type => (
            <ActivityButton key={type} type={type} active={selectedType === type} onClick={() => setSelectedType(type)} />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <InputCard icon={<Clock className="text-indigo-500" />} label="运动时间 (分钟)" value={duration} onChange={setDuration} type="number" />
          <InputCard icon={<Scale className="text-emerald-500" />} label="今日体重 (KG)" value={weight} placeholder="可选" onChange={setWeight} type="number" />
        </div>
        
        <div className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-slate-50 flex items-center gap-4 transition-all focus-within:border-indigo-200">
          <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center">
            <Navigation className="text-sky-500" />
          </div>
          <div className="flex-1">
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest block mb-1">运动距离/次数</span>
            <div className="flex items-center gap-2">
              <input type="number" value={distance} onChange={(e) => setDistance(e.target.value)} className="flex-1 text-lg font-black bg-transparent focus:outline-none text-slate-700" />
              <select className="text-[10px] font-black text-indigo-500 bg-slate-50 rounded-lg p-1 outline-none" value={distanceUnit} onChange={(e) => setDistanceUnit(e.target.value as 'km' | 'm' | '次')}>
                <option value="km">KM</option>
                <option value="m">M</option>
                <option value="次">次</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500">
              <Moon size={20} />
            </div>
            <div>
              <h3 className="font-black text-slate-800 text-sm uppercase tracking-widest">今日睡眠</h3>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2 px-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">睡眠时长(h): {sleepDuration}H</span>
                <span className={`text-[10px] font-black uppercase tracking-widest ${parseFloat(sleepDuration) >= 7 ? 'text-emerald-500' : 'text-amber-500'}`}>
                  {parseFloat(sleepDuration) >= 7 ? '性能完美' : '性能欠佳'}
                </span>
              </div>
              <input 
                type="range" 
                min="3" 
                max="12" 
                step="0.5" 
                value={sleepDuration} 
                onChange={(e) => setSleepDuration(e.target.value)} 
                className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-indigo-500"
              />
            </div>
            
            <div className="grid grid-cols-4 gap-2">
              {(['极好', '良好', '一般', '较差'] as const).map((q) => (
                <button
                  key={q}
                  onClick={() => setSleepQuality(q)}
                  className={`py-2 rounded-xl text-[10px] font-black uppercase transition-all ${sleepQuality === q ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-slate-50 text-slate-400 border border-transparent hover:border-slate-200'}`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div 
            onClick={() => image ? setImage(null) : fileInputRef.current?.click()}
            className={`bg-white rounded-[2rem] p-6 flex flex-col items-center justify-center gap-2 border-2 border-dashed transition-all cursor-pointer ${image ? 'border-indigo-500 bg-indigo-50/30' : 'border-slate-100 hover:border-indigo-200'}`}
          >
            {image ? (
              <div className="relative w-full h-full flex flex-col items-center">
                <img src={image} className="w-12 h-12 rounded-lg object-cover shadow-md mb-2" />
                <span className="text-[10px] font-black text-indigo-600 uppercase">附件已挂载</span>
                <X size={12} className="absolute -top-4 -right-2 text-slate-400" />
              </div>
            ) : (
              <>
                <Camera className="text-amber-500" size={24} />
                <span className="text-[10px] font-black uppercase tracking-wider">附加快照</span>
              </>
            )}
          </div>
          
          <div 
            onClick={handleGetLocation}
            className={`bg-white rounded-[2rem] p-6 flex flex-col items-center justify-center gap-2 border-2 border-dashed transition-all cursor-pointer ${location ? 'border-sky-500 bg-sky-50/30' : 'border-slate-100 hover:border-sky-200'}`}
          >
            {locating ? <Loader2 className="animate-spin text-sky-500" /> : <MapPin className={location ? "text-sky-500" : "text-slate-300"} size={24} />}
            <span className={`text-[10px] font-black uppercase tracking-wider ${location ? 'text-sky-600' : 'text-slate-400'}`}>
              {location ? '坐标已同步' : '同步坐标'}
            </span>
            {location && <span className="text-[8px] font-mono text-sky-400 truncate w-full text-center">{location}</span>}
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
              <Edit3 size={16} />
            </div>
            <h3 className="font-black text-slate-800 uppercase tracking-tighter">打卡记录</h3>
          </div>
          <textarea 
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full h-28 bg-slate-50 rounded-2xl p-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-100 resize-none transition-all placeholder:text-slate-300"
            placeholder="记录本次部署的心得或遇到的 BUG..."
          />
        </div>
      </div>

      {/* 底部确认按钮 */}
      <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-[60] flex flex-col items-center gap-3">
        <button 
          onClick={handlePush} 
          className="w-60 h-24 bg-white rounded-full shadow-[0_20px_50px_rgba(79,70,229,0.15)] border-4 border-slate-50 flex items-center justify-between px-8 active:scale-95 hover:scale-105 transition-all group overflow-hidden relative"
        >
          <div className="absolute inset-0 bg-indigo-500 opacity-0 group-hover:opacity-5 transition-opacity" />
          
          <span className="text-4xl transform -scale-x-100 group-hover:translate-x-2 transition-transform duration-300 group-hover:rotate-12">🐉</span>
          
          <div className="relative">
            <div className="text-5xl animate-pulse group-hover:scale-110 group-active:scale-90 transition-transform duration-300 drop-shadow-lg">🐼</div>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-slate-100 blur-[2px] rounded-full opacity-50"></div>
          </div>
          
          <span className="text-4xl group-hover:-translate-x-2 transition-transform duration-300 group-hover:-rotate-12">🐅</span>
        </button>
        <div className="px-6 py-2 bg-slate-900 text-white text-[11px] font-black tracking-[0.2em] rounded-full shadow-lg border border-white/20">
          记录好点我看看
        </div>
      </div>
    </div>
  );
};

const ActivityButton: React.FC<{ type: ActivityType, active: boolean, onClick: () => void }> = ({ type, active, onClick }) => {
  const originalIcon = ACTIVITY_ICONS[type] as React.ReactElement<any>;
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all relative ${active ? 'bg-indigo-600 shadow-xl shadow-indigo-100 -translate-y-1' : 'bg-slate-50 hover:bg-slate-100'}`}
    >
      <div className={`${active ? 'scale-110' : ''} transition-transform`}>
        {React.cloneElement(originalIcon, { 
          className: `${originalIcon.props.className || ''} ${active && !['游泳', '跑步', '羽毛球'].includes(type) ? '!text-white' : ''}`.trim() 
        })}
      </div>
      <span className={`text-[8px] font-black uppercase tracking-wider text-center ${active ? 'text-white' : 'text-slate-400'}`}>{type}</span>
      {active && <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white shadow-sm" />}
    </button>
  );
};

const InputCard: React.FC<{ icon: React.ReactNode, label: string, value: string, onChange: (v: string) => void, type?: string, placeholder?: string }> = ({ icon, label, value, onChange, type = "text", placeholder }) => (
  <div className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-slate-50 flex items-center gap-4 transition-all focus-within:border-indigo-200">
    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center">
      {icon}
    </div>
    <div className="flex-1">
      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest block mb-1">{label}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full text-lg font-black bg-transparent focus:outline-none placeholder:text-slate-200 text-slate-700" />
    </div>
  </div>
);

export default CheckIn;
