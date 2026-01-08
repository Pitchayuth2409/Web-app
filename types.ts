
export interface PlanningData {
  projectName: string;
  startDate: string;
  endDate: string;
  targetVolume: number;
  standardTime: number; // Hours per unit
  employeeCount: number;
}

export interface DayWorkload {
  date: string;
  hours: number;
  isWorkDay: boolean;
  cumulativeUnits: number;
}

export interface CalculationResult {
  totalRequiredHours: number;
  netWorkingDays: number;
  totalWeeks: number;
  totalMonths: number;
  requiredDailyTeamHours: number;
  requiredDailyPerPersonHours: number;
  isFeasible: boolean;
  overloadAmount: number;
  recommendedStaff: number;
  capacityUtilization: number;
  dailyTimeline: DayWorkload[];
}
