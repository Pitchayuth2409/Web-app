
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface UtilizationGaugeProps {
  percentage: number;
}

const UtilizationGauge: React.FC<UtilizationGaugeProps> = ({ percentage }) => {
  const data = [
    { value: Math.min(percentage, 100) },
    { value: Math.max(0, 100 - percentage) }
  ];

  const getColor = () => {
    if (percentage > 100) return '#ef4444';
    if (percentage > 85) return '#f59e0b';
    return '#10b981';
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center">
      <h3 className="text-lg font-bold text-slate-800 mb-2">อัตราการใช้กำลังคน</h3>
      <div className="h-48 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="80%"
              startAngle={180}
              endAngle={0}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={0}
              dataKey="value"
            >
              <Cell fill={getColor()} stroke="none" />
              <Cell fill="#f1f5f9" stroke="none" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-8">
          <span className="text-3xl font-bold text-slate-800">{percentage.toFixed(0)}%</span>
          <span className={`text-[10px] font-bold uppercase tracking-wider ${percentage > 100 ? 'text-red-500' : 'text-slate-400'}`}>
            {percentage > 100 ? 'เกินกำลัง' : 'ใช้กำลังผลิต'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default UtilizationGauge;
