
export enum ActivityType {
  SWIMMING = '游泳',
  HIKING = '徒步',
  CLIMBING = '爬山',
  CYCLING = '骑行',
  RUNNING = '跑步',
  WEIGHTED_WALK = '负重散步',
  STRENGTH = '力量健身',
  BADMINTON = '羽毛球'
}

export type TargetUnit = 'min' | 'km' | 'm' | '次';

export interface PlanDay {
  day: string;
  task: ActivityType | 'REST';
  targetValue: string;
  targetUnit: TargetUnit;
  isRest: boolean;
}

export interface CommitRecord {
  id: string;
  date: string;
  type: ActivityType;
  duration: number;
  weight?: number;
  distance?: number;
  distanceUnit?: 'km' | 'm' | '次';
  calories: number;
  note: string;
  image?: string;
  sleepDuration?: number;
  sleepQuality?: '极好' | '良好' | '一般' | '较差';
}

export type ViewType = 'HOME' | 'PLAN' | 'CHECKIN' | 'STATS';
