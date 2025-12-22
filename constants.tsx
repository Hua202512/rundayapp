
import React from 'react';
import { 
  Footprints, 
  Activity, 
  Bike, 
  BicepsFlexed, 
  PersonStanding
} from 'lucide-react';
import { ActivityType } from './types';

// 1. 拟物化跑步图标
const RunningIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    {/* 头部 */}
    <circle cx="15" cy="5" r="2.5" fill="#78350f" />
    {/* 身体/上衣 */}
    <path d="M11 7.5L14 11L12 14.5" stroke="#f97316" strokeWidth="3" strokeLinecap="round" />
    {/* 裤子/腿 */}
    <path d="M12 14.5L10 19M12 14.5L15 18" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" />
    {/* 手臂 */}
    <path d="M14 11L16 8M14 11L11 10.5" stroke="#f97316" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// 2. 拟物化游泳图标 (带水波纹背景)
const SwimmingIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="2" y="4" width="20" height="16" rx="4" fill="#60a5fa" fillOpacity="0.8" />
    {/* 水波纹 */}
    <path d="M4 16C6 15 8 17 10 16C12 15 14 17 16 16C18 15 20 17 22 16" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    {/* 人物泳姿 */}
    <path d="M8 10C10 9 12 11 15 10" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="16" cy="9.5" r="1.5" fill="#f59e0b" />
  </svg>
);

// 3. 拟物化羽毛球图标 (拍+球)
const BadmintonIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    {/* 球拍手柄 */}
    <path d="M6 18L10 14" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
    {/* 球拍框 */}
    <circle cx="14" cy="10" r="5" stroke="#3b82f6" strokeWidth="1.5" />
    {/* 球拍网格 */}
    <path d="M11 7L17 13M11 13L17 7" stroke="#93c5fd" strokeWidth="1" strokeLinecap="round" />
    {/* 羽毛球 */}
    <path d="M7 6L9 8" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M6.5 7.5L8.5 9.5" stroke="#ef4444" strokeWidth="1" strokeLinecap="round" />
    <circle cx="9.5" cy="8.5" r="1" fill="#f1f5f9" />
  </svg>
);

export const ACTIVITY_ICONS: Record<ActivityType, React.ReactNode> = {
  [ActivityType.SWIMMING]: <SwimmingIcon className="w-6 h-6" />,
  [ActivityType.HIKING]: <Footprints className="w-6 h-6 text-emerald-500" />,
  [ActivityType.CLIMBING]: <Activity className="w-6 h-6 text-teal-600" />,
  [ActivityType.CYCLING]: <Bike className="w-6 h-6 text-sky-500" />,
  [ActivityType.RUNNING]: <RunningIcon className="w-6 h-6" />,
  [ActivityType.WEIGHTED_WALK]: <PersonStanding className="w-6 h-6 text-amber-600" />,
  [ActivityType.STRENGTH]: <BicepsFlexed className="w-6 h-6 text-indigo-500" />,
  [ActivityType.BADMINTON]: <BadmintonIcon className="w-6 h-6" />,
};

export const ACTIVITY_COLORS: Record<ActivityType, string> = {
  [ActivityType.SWIMMING]: 'bg-blue-100/50',
  [ActivityType.HIKING]: 'bg-emerald-100/50',
  [ActivityType.CLIMBING]: 'bg-teal-100/50',
  [ActivityType.CYCLING]: 'bg-sky-100/50',
  [ActivityType.RUNNING]: 'bg-orange-100/50',
  [ActivityType.WEIGHTED_WALK]: 'bg-amber-100/50',
  [ActivityType.STRENGTH]: 'bg-indigo-100/50',
  [ActivityType.BADMINTON]: 'bg-rose-100/50',
};
