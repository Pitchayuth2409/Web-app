
import React from 'react';
import { PlanningData } from '../types';
// Fix: Removed parseISO and format as they are either missing or unused
import { isAfter, isBefore } from 'date-fns';

interface SidebarProps {
  data: PlanningData;
  onChange: (newData: PlanningData) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ data, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'date') {
      const newDateStr = value;
      let newStartDate = data.startDate;
      let newEndDate = data.endDate;

      if (name === 'startDate') {
        newStartDate = newDateStr;
        // Fix: Use native Date constructor instead of parseISO to avoid module export errors
        if (isAfter(new Date(newStartDate), new Date(newEndDate))) {
          newEndDate = newStartDate;
        }
      } else if (name === 'endDate') {
        newEndDate = newDateStr;
        // Fix: Use native Date constructor instead of parseISO to avoid module export errors
        if (isBefore(new Date(newEndDate), new Date(newStartDate))) {
          newStartDate = newEndDate;
        }
      }

      onChange({
        ...data,
        startDate: newStartDate,
        endDate: newEndDate,
      });
      return;
    }

    onChange({
      ...data,
      [name]: type === 'number' ? parseFloat(value) : value
    });
  };

  return (
    <div className="w-80 bg-white border-r border-slate-200 h-screen flex flex-col sticky top-0">
      <div className="p-6 border-b border-slate-100 flex items-center gap-3">
        <div className="bg-blue-600 text-white p-2 rounded-lg shadow-sm">
          <i className="fas fa-layer-group text-xl"></i>
        </div>
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">OpsMaster</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">ข้อมูลโครงการ</label>
          <input
            type="text"
            name="projectName"
            value={data.projectName}
            onChange={handleChange}
            placeholder="ชื่อโครงการของคุณ..."
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all text-sm font-medium"
          />
        </div>

        <div className="space-y-4">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">การกำหนดช่วงเวลา</label>
          
          <div className="relative group">
            <div className="absolute left-3.5 top-9 text-slate-400 group-focus-within:text-blue-500 pointer-events-none z-10 transition-colors">
              <i className="fas fa-calendar-day"></i>
            </div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider ml-1">วันเริ่มต้นงาน</label>
              <span className="text-[9px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-bold uppercase">Start</span>
            </div>
            <input
              type="date"
              name="startDate"
              value={data.startDate}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer hover:bg-slate-100 transition-all outline-none text-sm font-semibold text-slate-700"
            />
          </div>

          <div className="relative group">
            <div className="absolute left-3.5 top-9 text-slate-400 group-focus-within:text-blue-500 pointer-events-none z-10 transition-colors">
              <i className="fas fa-flag-checkered"></i>
            </div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider ml-1">วันส่งมอบงาน</label>
              <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-bold uppercase">End</span>
            </div>
            <input
              type="date"
              name="endDate"
              value={data.endDate}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer hover:bg-slate-100 transition-all outline-none text-sm font-semibold text-slate-700"
            />
          </div>
        </div>

        <hr className="border-slate-100" />

        <div className="space-y-4">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">ตัวแปรการคำนวณ</label>
          
          <div>
            <label className="block text-xs text-slate-400 font-bold uppercase mb-1.5 ml-1">จำนวนงาน / Control</label>
            <div className="relative group">
              <span className="absolute left-3.5 top-2.5 text-slate-400 group-focus-within:text-blue-500 transition-colors"><i className="fas fa-boxes-stacked"></i></span>
              <input
                type="number"
                name="targetVolume"
                min="0"
                value={data.targetVolume}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm font-semibold text-slate-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-400 font-bold uppercase mb-1.5 ml-1">ชั่วโมงต่อชิ้น (Standard Time)</label>
            <div className="relative group">
              <span className="absolute left-3.5 top-2.5 text-slate-400 group-focus-within:text-blue-500 transition-colors"><i className="fas fa-stopwatch"></i></span>
              <input
                type="number"
                step="0.1"
                min="0.1"
                name="standardTime"
                value={data.standardTime}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm font-semibold text-slate-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-400 font-bold uppercase mb-1.5 ml-1">จำนวนทีมงาน (คน)</label>
            <div className="relative group">
              <span className="absolute left-3.5 top-2.5 text-slate-400 group-focus-within:text-blue-500 transition-colors"><i className="fas fa-user-group"></i></span>
              <input
                type="number"
                name="employeeCount"
                min="1"
                value={data.employeeCount}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm font-semibold text-slate-700"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 bg-slate-50 border-t border-slate-200">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">ข้อกำหนดการคำนวณ</p>
        </div>
        <ul className="text-[10px] text-slate-400 space-y-1.5 font-medium">
          <li className="flex items-center gap-2">
            <i className="fas fa-calendar-minus opacity-50"></i>
            ทำงาน 5 วัน/สัปดาห์ (หยุด ส.-อา.)
          </li>
          <li className="flex items-center gap-2">
            <i className="fas fa-hourglass-half opacity-50"></i>
            กำลังสูงสุด 8 ชม./คน/วัน
          </li>
          <li className="flex items-center gap-2">
            <i className="fas fa-calculator opacity-50"></i>
            คำนวณตามปริมาตรงานจริง (Volume-based)
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
