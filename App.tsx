
import React, { useState, useMemo, useRef } from 'react';
import Sidebar from './components/Sidebar';
import Heatmap from './components/Heatmap';
import UtilizationGauge from './components/UtilizationGauge';
import { PlanningData } from './types';
import { calculateProjectMetrics } from './utils/calculations';
import { format, addDays } from 'date-fns';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const App: React.FC = () => {
  const [data, setData] = useState<PlanningData>({
    projectName: "โครงการผลิตตัวอย่าง A",
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: format(addDays(new Date(), 14), 'yyyy-MM-dd'),
    targetVolume: 200,
    standardTime: 1.5,
    employeeCount: 4
  });

  const [isExporting, setIsExporting] = useState(false);
  const dashboardRef = useRef<HTMLElement>(null);

  const metrics = useMemo(() => calculateProjectMetrics(data), [data]);

  const handleExportPDF = async () => {
    if (!dashboardRef.current) return;
    
    setIsExporting(true);
    try {
      // Add a slight delay to ensure all charts are rendered/stable
      await new Promise(resolve => setTimeout(resolve, 500));

      const element = dashboardRef.current;
      const canvas = await html2canvas(element, {
        scale: 2, // Higher resolution
        useCORS: true,
        logging: false,
        backgroundColor: '#f8fafc',
        onclone: (clonedDoc) => {
          // Adjust layout for PDF if needed
          const main = clonedDoc.querySelector('main');
          if (main) {
            main.style.height = 'auto';
            main.style.overflow = 'visible';
            main.style.width = '1200px'; // Fixed width for better PDF scaling
          }
        }
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      
      const finalWidth = imgWidth * ratio;
      const finalHeight = imgHeight * ratio;
      
      const x = (pdfWidth - finalWidth) / 2;
      const y = (pdfHeight - finalHeight) / 2;

      pdf.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight);
      pdf.save(`${data.projectName || 'OpsMaster-Report'}.pdf`);
    } catch (error) {
      console.error('PDF Export failed:', error);
      alert('ไม่สามารถส่งออก PDF ได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 overflow-hidden">
      <Sidebar data={data} onChange={setData} />

      <main ref={dashboardRef} className="flex-1 h-screen overflow-y-auto p-8 lg:p-12">
        {/* Header Section */}
        <div className="flex flex-col xl:flex-row justify-between items-start gap-6 mb-10">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold uppercase rounded tracking-widest">Dashboard</span>
              <span className="h-1 w-8 bg-blue-200 rounded-full"></span>
            </div>
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {data.projectName || 'Unnamed Project'}
            </h2>
            <p className="text-slate-500 mt-2 text-lg font-medium">Dashboard วิเคราะห์ศักยภาพและแผนการใช้ทรัพยากรบุคคล</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <button
              onClick={handleExportPDF}
              disabled={isExporting}
              className={`flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm shadow-sm transition-all hover:bg-slate-50 hover:border-blue-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <i className={`fas ${isExporting ? 'fa-spinner fa-spin' : 'fa-file-pdf text-red-500'}`}></i>
              {isExporting ? 'กำลังสร้าง PDF...' : 'ส่งออกเป็น PDF'}
            </button>

            <div className={`px-8 py-3 rounded-2xl border-2 flex items-center gap-5 shadow-lg transition-all ${metrics.isFeasible ? 'bg-white border-green-500 shadow-green-100' : 'bg-white border-red-500 shadow-red-100'}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-inner ${metrics.isFeasible ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                <i className={`fas ${metrics.isFeasible ? 'fa-check-double' : 'fa-exclamation-triangle'}`}></i>
              </div>
              <div>
                <div className={`text-[10px] font-black uppercase tracking-widest ${metrics.isFeasible ? 'text-green-600' : 'text-red-600'}`}>
                  {metrics.isFeasible ? 'สถานะ: ปกติ' : 'สถานะ: วิกฤต'}
                </div>
                <div className="text-xs font-bold text-slate-800 mt-0.5">
                  {metrics.isFeasible 
                    ? 'กำลังคนเพียงพอ' 
                    : `ขาด ${metrics.overloadAmount.toFixed(1)} ชม./วัน`}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Calculation Variables Cards (Inputs) */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <i className="fas fa-sliders-h text-blue-500 text-sm"></i>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">ตัวแปรการคำนวณ (Project Parameters)</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100 flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm border border-blue-100">
                <i className="fas fa-boxes-stacked text-xl"></i>
              </div>
              <div>
                <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest">จำนวนงาน / Control</div>
                <div className="text-2xl font-black text-slate-800">{data.targetVolume.toLocaleString()} <span className="text-sm font-bold text-slate-500">ชิ้น</span></div>
              </div>
            </div>
            <div className="bg-indigo-50/50 p-5 rounded-2xl border border-indigo-100 flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100">
                <i className="fas fa-stopwatch text-xl"></i>
              </div>
              <div>
                <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">เวลามาตรฐาน</div>
                <div className="text-2xl font-black text-slate-800">{data.standardTime} <span className="text-sm font-bold text-slate-500">ชม./ชิ้น</span></div>
              </div>
            </div>
            <div className="bg-purple-50/50 p-5 rounded-2xl border border-purple-100 flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-purple-600 shadow-sm border border-purple-100">
                <i className="fas fa-user-group text-xl"></i>
              </div>
              <div>
                <div className="text-[10px] font-black text-purple-400 uppercase tracking-widest">จำนวนทีมงาน</div>
                <div className="text-2xl font-black text-slate-800">{data.employeeCount} <span className="text-sm font-bold text-slate-500">คน</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* Analysis Results Cards */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <i className="fas fa-chart-line text-emerald-500 text-sm"></i>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">ผลการวิเคราะห์ทรัพยากร (Resource Analysis)</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {[
              { label: 'ชั่วโมงรวม', value: `${metrics.totalRequiredHours.toLocaleString()} ชม.`, icon: 'fa-clock', color: 'text-blue-600' },
              { label: 'วันทำงานสุทธิ', value: `${metrics.netWorkingDays} วัน`, icon: 'fa-calendar-check', color: 'text-indigo-600' },
              { label: 'สัปดาห์รวม', value: `${metrics.totalWeeks} สัปดาห์`, icon: 'fa-calendar-week', color: 'text-emerald-600' },
              { label: 'เดือนรวม', value: `${metrics.totalMonths} เดือน`, icon: 'fa-calendar-alt', color: 'text-amber-600' },
              { label: 'ภาระงานทีม/วัน', value: `${metrics.requiredDailyTeamHours.toFixed(1)} ชม.`, icon: 'fa-users', color: 'text-purple-600' },
              { label: 'ภาระงานรายคน', value: `${metrics.requiredDailyPerPersonHours.toFixed(1)} ชม.`, icon: 'fa-user-clock', color: metrics.requiredDailyPerPersonHours > 8 ? 'text-red-600' : 'text-green-600' },
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center ${item.color}`}>
                    <i className={`fas ${item.icon}`}></i>
                  </div>
                  <div className="text-slate-400 text-[10px] font-black uppercase tracking-widest whitespace-nowrap">{item.label}</div>
                </div>
                <div className="text-2xl font-black text-slate-800 tracking-tight leading-tight">{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
          <div className="lg:col-span-8 h-full">
            <Heatmap timeline={metrics.dailyTimeline} />
          </div>

          <div className="lg:col-span-4 space-y-8 flex flex-col h-full">
            <div className="flex-1 min-h-[300px]">
              <UtilizationGauge percentage={metrics.capacityUtilization} />
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-center relative overflow-hidden group">
              <div className="relative z-10">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-inner">
                  <i className="fas fa-users-cog text-2xl"></i>
                </div>
                <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">จำนวนทีมงานที่เหมาะสม</div>
                <div className="text-5xl font-black text-blue-600 tracking-tighter">{metrics.recommendedStaff}</div>
                <div className="text-xs text-slate-500 font-bold mt-2 uppercase tracking-wide">คน (พิจารณาที่ 8 ชม./วัน)</div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-125"></div>
            </div>
          </div>
        </div>

        {/* Strategic Insight Section */}
        <div className="bg-slate-900 text-white p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden border border-slate-800">
          <div className="relative z-10 flex flex-col xl:flex-row items-center gap-10">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-400/20 text-yellow-400 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-yellow-400/30">
                <i className="fas fa-sparkles"></i>
                Strategic Recommendation
              </div>
              <h3 className="text-3xl font-black mb-4 tracking-tight leading-tight">
                แผนกลยุทธ์เพื่อเป้าหมาย <span className="text-blue-400 underline underline-offset-8">{data.targetVolume} ชิ้น</span>
              </h3>
              <p className="text-slate-400 text-xl leading-relaxed font-medium">
                จากการวิเคราะห์ขีดความสามารถ (Capacity Analysis) ในเวลา <span className="text-white font-bold">{metrics.netWorkingDays} วัน</span> (ประมาณ <span className="text-white">{metrics.totalWeeks} สัปดาห์</span>) 
                คุณควรมีกำลังพล <span className="text-white font-bold underline decoration-blue-500 decoration-4 underline-offset-4">{metrics.recommendedStaff} ท่าน</span> เพื่อรักษาสมดุล 8 ชม./วัน
                สถานะปัจจุบัน: <span className={`font-black ${metrics.capacityUtilization > 100 ? 'text-red-400' : 'text-green-400'}`}>
                  {metrics.capacityUtilization > 100 ? 'เกินกำลังผลิต (Critical Overload)' : 'อยู่ในเกณฑ์ปกติ (Optimal Load)'}
                </span>
              </p>
            </div>
            
            {!metrics.isFeasible && (
              <div className="bg-white/5 backdrop-blur-xl px-10 py-8 rounded-3xl border border-white/10 min-w-[280px] shadow-2xl text-center transform hover:rotate-2 transition-transform">
                <div className="text-xs font-black text-red-400 uppercase tracking-widest mb-2">ส่วนต่างที่วิกฤต</div>
                <div className="text-5xl font-black text-white tracking-tighter">-{metrics.overloadAmount.toFixed(1)} <span className="text-xl text-slate-400">ชม.</span></div>
                <div className="text-xs text-slate-500 mt-3 font-bold">เวลาที่เกินเพดาน 8 ชม./วัน/คน</div>
              </div>
            )}
          </div>
          
          <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
            <div className="absolute top-10 right-10 w-96 h-96 bg-blue-500 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-10 left-10 w-64 h-64 bg-indigo-500 rounded-full blur-[80px]"></div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
