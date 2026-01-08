
import { differenceInCalendarDays, addDays, format, isSaturday, isSunday } from 'date-fns';
import { PlanningData, CalculationResult, DayWorkload } from '../types';

export const calculateProjectMetrics = (data: PlanningData): CalculationResult => {
  const start = new Date(data.startDate);
  const end = new Date(data.endDate);
  
  // Total Days in range
  const totalCalendarDays = differenceInCalendarDays(end, start) + 1;
  
  let netWorkingDays = 0;
  const dailyTimeline: DayWorkload[] = [];
  
  // Logic: Total Required Man-Hours = Total Units * Time per Unit
  const totalRequiredHours = data.targetVolume * data.standardTime;

  // Find business days and initialize timeline
  for (let i = 0; i < totalCalendarDays; i++) {
    const current = addDays(start, i);
    const isWorkDay = !isSaturday(current) && !isSunday(current);
    if (isWorkDay) netWorkingDays++;
    
    dailyTimeline.push({
      date: format(current, 'yyyy-MM-dd'),
      hours: 0,
      isWorkDay,
      cumulativeUnits: 0
    });
  }

  // Handle zero business days to avoid division by zero
  const effectiveWorkingDays = netWorkingDays || 1;
  
  // Required Daily Hours (Team) = Total Required Man-Hours / Net Working Days
  const requiredDailyTeamHours = totalRequiredHours / effectiveWorkingDays;
  
  // Required Daily Hours per Person
  const requiredDailyPerPersonHours = requiredDailyTeamHours / Math.max(data.employeeCount, 1);
  
  // Feasibility Check: Capacity limit = 8h per person
  const isFeasible = requiredDailyPerPersonHours <= 8;
  const overloadAmount = Math.max(0, requiredDailyPerPersonHours - 8);
  
  // Optimization Suggestion
  const recommendedStaff = Math.ceil(totalRequiredHours / (effectiveWorkingDays * 8));
  
  const capacityUtilization = (requiredDailyPerPersonHours / 8) * 100;

  // Time metrics (Duration based)
  const totalWeeks = Number((totalCalendarDays / 7).toFixed(1));
  const totalMonths = Number((totalCalendarDays / 30.44).toFixed(1));

  // Fill timeline data for charts
  let unitsCompleted = 0;
  const unitsPerDay = data.targetVolume / effectiveWorkingDays;

  dailyTimeline.forEach((day) => {
    if (day.isWorkDay) {
      day.hours = requiredDailyPerPersonHours;
      unitsCompleted += unitsPerDay;
      day.cumulativeUnits = Math.min(unitsCompleted, data.targetVolume);
    } else {
      day.hours = 0;
      day.cumulativeUnits = unitsCompleted;
    }
  });

  return {
    totalRequiredHours,
    netWorkingDays,
    totalWeeks,
    totalMonths,
    requiredDailyTeamHours,
    requiredDailyPerPersonHours,
    isFeasible,
    overloadAmount,
    recommendedStaff,
    capacityUtilization,
    dailyTimeline
  };
};
