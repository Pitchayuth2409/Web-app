
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DayWorkload } from '../types';

interface BurnDownChartProps {
  timeline: DayWorkload[];
}

const BurnDownChart: React.FC<BurnDownChartProps> = ({ timeline }) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-full">
      <h3 className="text-lg font-bold text-slate-800 mb-6">กราฟแสดงความคืบหน้าการผลิต</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={timeline} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorUnits" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 10, fill: '#94a3b8' }} 
              tickFormatter={(val) => {
                 const d = new Date(val);
                 return `${d.getDate()}/${d.getMonth() + 1}`;
              }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 10, fill: '#94a3b8' }} 
              axisLine={false}
              tickLine={false}
            />
            <Tooltip 
              formatter={(value: any) => [`${Math.round(value)} ชิ้น`, 'สะสม']}
              contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
              labelStyle={{ fontWeight: 'bold', fontSize: '12px' }}
            />
            <Area 
              type="monotone" 
              dataKey="cumulativeUnits" 
              stroke="#3b82f6" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorUnits)" 
              name="จำนวนชิ้นสะสม"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BurnDownChart;
