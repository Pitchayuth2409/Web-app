
import React from 'react';
import { DayWorkload } from '../types';
import { format } from 'date-fns';

interface HeatmapProps {
  timeline: DayWorkload[];
}

const Heatmap: React.FC<HeatmapProps> = ({ timeline }) => {
  const getColor = (hours: number, isWorkDay: boolean) => {
    if (!isWorkDay) return 'bg-slate-100 opacity-30';
    if (hours === 0) return 'bg-white border-slate-200';
    if (hours <= 4) return 'bg-green-100 text-green-700';
    if (hours <= 8) return 'bg-green-500 text-white';
    return 'bg-red-500 text-white shadow-lg shadow-red-200';
  };

  const thaiDays = ['จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.', 'อา.'];

  if (!timeline || timeline.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center py-12">
        <div className="text-slate-400 mb-2 text-3xl"><i className="fas fa-calendar-xmark"></i></div>
        <p className="text-slate-500 font-medium">ช่วงวันที่ไม่ถูกต้อง</p>
      </div>
    );
  }

  const firstDate = new Date(timeline[0].date);
  const offset = (firstDate.getDay() + 6) % 7;

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-800">การกระจายภาระงานรายวัน</h3>
        <div className="flex gap-4 text-xs font-medium text-slate-500">
          <div className="flex items-center gap-1"><span className="w-3 h-3 bg-slate-100 rounded"></span> วันหยุด</div>
          <div className="flex items-center gap-1"><span className="w-3 h-3 bg-green-500 rounded"></span> เหมาะสม</div>
          <div className="flex items-center gap-1"><span className="w-3 h-3 bg-red-500 rounded"></span> ภาระงานเกิน</div>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-3 min-w-[600px]">
        {thaiDays.map(day => (
          <div key={day} className="text-center text-xs font-bold text-slate-400 uppercase tracking-wider">{day}</div>
        ))}

        {Array.from({ length: offset }).map((_, i) => (
          <div key={`offset-${i}`} className="h-20 bg-transparent" />
        ))}

        {timeline.map((day) => (
          <div 
            key={day.date} 
            className={`h-20 p-2 rounded-lg border transition-all ${getColor(day.hours, day.isWorkDay)} flex flex-col justify-between`}
          >
            <div className="text-[10px] font-bold opacity-70">
              {format(new Date(day.date), 'd MMM')}
            </div>
            <div className="text-center font-bold text-sm">
              {day.isWorkDay ? `${day.hours.toFixed(1)}ชม.` : 'หยุด'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Heatmap;
