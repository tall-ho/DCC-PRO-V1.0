import React, { useState } from 'react';
import { 
  Calendar, 
  Target, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Download, 
  Search, 
  Plus, 
  Filter, 
  ChevronRight, 
  MoreHorizontal,
  LayoutGrid,
  List,
  CalendarDays,
  FileText,
  ShieldCheck,
  TrendingUp,
  X,
  Save,
  Printer
} from 'lucide-react';

// --- Theme Configuration (Synced with DCC PRO Palette) ---
const THEME = {
  primary: '#212c46',
  primaryLight: '#4d87a8',
  accent: '#a94228',
  gold: '#b58c4f',
  brightGold: '#b7a159',
  success: '#657f4d',
  danger: '#932c2e',
  skyBlue: '#3f809e',
  dustyBlue: '#7a8b95',
  indigo: '#414757',
  softPurple: '#ab7d82',
  deepPurple: '#2d2c4a',
  pinkAccent: '#a54f6b',
  mutedSlate: '#606a5f',
  darkSlate: '#2f2926',
  bgMain: '#f3f3f1',
  white: '#ffffff',
  slateBlue: '#748ea1',
  burntOrange: '#d96245'
};

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700;800&family=Noto+Sans+Thai:wght@300;400;500;600;700;800&display=swap');
  
  * { font-family: 'JetBrains Mono', 'Noto Sans Thai', sans-serif !important; }
  
  .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
  .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
  .custom-scrollbar::-webkit-scrollbar-thumb { background: #7a8b95; border-radius: 3px; }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #eaeaec; }
  
  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  .animate-fadeIn { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
`;

const KpiCard = ({ icon: Icon, value, label, colorAccent, colorValue, desc }: any) => (
    <div className="bg-white/90 px-6 py-6 rounded-2xl border border-[#eaeaec] shadow-sm flex-1 min-w-[200px] relative overflow-hidden group hover:border-[#b7a159] transition-all min-h-[120px] flex flex-col justify-between animate-fadeIn">
        <div className="absolute -right-4 -bottom-6 opacity-[0.05] transform group-hover:scale-110 transition-transform duration-700 pointer-events-none">
            <Icon size={110} color={colorAccent} />
        </div>
        <div className="relative z-10 flex justify-between items-start w-full">
            <p className="text-[11px] font-bold text-[#7a8b95] uppercase tracking-[0.1em] drop-shadow-sm">{label}</p>
            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 shadow-sm transition-all group-hover:rotate-6`} style={{backgroundColor: `${colorAccent}15`, borderColor: `${colorAccent}25`, color: colorAccent}}>
                <Icon size={20} />
            </div>
        </div>
        <div className="relative z-10 mt-2 flex items-end justify-between">
            <p className="text-[28px] font-black leading-none text-[#212c46]" style={{color: colorValue}}>
                {value}
            </p>
            <span className="text-[11px] font-bold text-[#4d87a8] uppercase tracking-widest flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span> {desc}
            </span>
        </div>
    </div>
);

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

export default function YearlyPlan() {
  const [activeView, setActiveView] = useState('list');
  const [selectedYear, setSelectedYear] = useState('2024');

  const plans = [
    { id: 'IA-2024-001', process: 'Management & Strategic Plan', dept: 'HQ', frequency: 'Annual', months: [false, false, false, false, false, false, true, false, false, false, false, false], status: 'Planned' },
    { id: 'IA-2024-002', process: 'Production Operations (Line A)', dept: 'Production', frequency: 'Bi-Annual', months: [false, false, true, false, false, false, false, false, true, false, false, false], status: 'In Progress' },
    { id: 'IA-2024-003', process: 'Purchasing & Supplier Evaluation', dept: 'Procurement', frequency: 'Annual', months: [false, true, false, false, false, false, false, false, false, false, false, false], status: 'Completed' },
    { id: 'IA-2024-004', process: 'Warehouse & Logistics', dept: 'Logistics', frequency: 'Annual', months: [false, false, false, true, false, false, false, false, false, false, false, false], status: 'Delayed' }
  ];

  return (
    <div className="flex flex-1 w-full flex-col pb-6 animate-fadeIn bg-transparent px-8">
      <style dangerouslySetInnerHTML={{__html: globalStyles}} />

      {/* HEADER SECTION */}
      <div className="pt-3 pb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 z-20 shrink-0">
          <div className="flex items-center gap-5">
              <div className="relative flex items-center justify-center group cursor-default shrink-0">
                  <div className="absolute inset-0 bg-[#3f809e] blur-[15px] opacity-20 rounded-full group-hover:opacity-60 transition-all duration-700"></div>
                  <div className="relative z-10 p-1.5 border border-[#3f809e]/40 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm">
                      <CalendarDays size={28} strokeWidth={2.5} className="text-[#3f809e]" />
                  </div>
              </div>
              <div>
                  <h3 className="font-black text-[#212c46] uppercase tracking-tighter leading-none" style={{ fontSize: '24px' }}>
                      AUDIT PLAN <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3f809e] to-[#b58c4f]">(YEARLY)</span>
                  </h3>
                  <p className="text-[11px] font-bold text-[#4d5a44] uppercase tracking-[0.2em] mt-0.5 opacity-80 leading-none">
                      INTERNAL & EXTERNAL COMPLIANCE SCHEDULE
                  </p>
              </div>
          </div>

          <div className="flex items-center gap-4">
              <div className="bg-[#212c46] text-white px-5 py-2.5 rounded-xl border border-white/20 shadow-md flex items-center gap-3">
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-70">Active Year</span>
                  <select value={selectedYear} onChange={e => setSelectedYear(e.target.value)} className="bg-transparent font-black outline-none cursor-pointer border-l border-white/20 pl-3">
                      <option value="2023">2023</option>
                      <option value="2024">2024</option>
                      <option value="2025">2025</option>
                  </select>
              </div>
              <button className="bg-[#b58c4f] text-white px-6 py-2.5 rounded-full font-black text-[12px] uppercase tracking-widest shadow-md hover:bg-[#a94228] transition-all flex items-center gap-2">
                <Plus size={16} /> New Schedule
              </button>
          </div>
      </div>

      {/* KPI STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
          <KpiCard label="Scheduled Audits" value="24" icon={Calendar} colorAccent={THEME.primaryLight} colorValue={THEME.primary} desc="Events this year" />
          <KpiCard label="Completed" value="8" icon={CheckCircle2} colorAccent={THEME.success} colorValue={THEME.success} desc="On track" />
          <KpiCard label="In Progress" value="3" icon={Clock} colorAccent={THEME.brightGold} colorValue={THEME.primary} desc="Currently active" />
          <KpiCard label="Delayed / Overdue" value="1" icon={AlertCircle} colorAccent={THEME.danger} colorValue={THEME.danger} desc="Needs review" />
      </div>

      {/* MATRIX TABLE */}
      <div className="bg-white rounded-3xl shadow-lg border border-[#eaeaec] overflow-hidden flex flex-col">
          <div className="px-8 py-5 border-b border-[#eaeaec] bg-[#f8f9fa] flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex bg-[#f8f9fa] border border-[#eaeaec] p-1 rounded-full shadow-sm inline-flex">
                  <button onClick={() => setActiveView('list')} className={`px-5 py-2 text-[11px] font-black uppercase tracking-widest rounded-full transition-all ${activeView === 'list' ? 'bg-[#212c46] text-white shadow-md' : 'text-[#7a8b95] hover:text-[#a94228]'}`}>
                      Schedule Matrix
                  </button>
                  <button onClick={() => setActiveView('analytics')} className={`px-5 py-2 text-[11px] font-black uppercase tracking-widest rounded-full transition-all ${activeView === 'analytics' ? 'bg-[#212c46] text-white shadow-md' : 'text-[#7a8b95] hover:text-[#a94228]'}`}>
                      Visual Analytics
                  </button>
              </div>
              <div className="flex gap-2">
                  <button className="p-2.5 bg-white border border-[#eaeaec] text-[#212c46] rounded-xl shadow-sm hover:bg-[#eaeaec] transition-all"><Printer size={18}/></button>
                  <button className="p-2.5 bg-white border border-[#eaeaec] text-[#a94228] rounded-xl shadow-sm hover:bg-[#eaeaec] transition-all"><Download size={18}/></button>
              </div>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left font-sans border-collapse">
                  <thead>
                      <tr className="bg-[#212c46] text-white border-b-2 border-[#b7a159]">
                          <th className="py-4 px-6 font-black uppercase tracking-widest text-[11px] whitespace-nowrap min-w-[250px]">Audit Scope / Process</th>
                          {MONTHS.map(m => (
                              <th key={m} className="py-4 px-2 text-center font-black uppercase tracking-widest text-[10px] w-12">{m}</th>
                          ))}
                          <th className="py-4 px-6 font-black uppercase tracking-widest text-[11px] text-center whitespace-nowrap">Status</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-[#eaeaec]">
                      {plans.map((p, i) => (
                          <tr key={p.id} className="hover:bg-[#f8f9fa] transition-colors group">
                              <td className="py-4 px-6">
                                  <div className="flex flex-col">
                                      <span className="font-black text-[#212c46] text-[12px] uppercase">{p.process}</span>
                                      <div className="flex items-center gap-2 mt-1">
                                          <span className="text-[10px] font-black text-[#7a8b95] uppercase tracking-widest">{p.id}</span>
                                          <span className="w-1 h-1 rounded-full bg-[#d7d7d7]"></span>
                                          <span className="text-[10px] font-bold text-[#4d87a8] uppercase">{p.dept}</span>
                                      </div>
                                  </div>
                              </td>
                              {p.months.map((m, idx) => (
                                  <td key={idx} className="py-4 px-1 text-center border-x border-[#eaeaec]/50">
                                      <div className={`mx-auto w-6 h-6 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                                          m ? 'bg-[#212c46] text-white shadow-md scale-110' : 'bg-[#eaeaec]/40 hover:bg-[#7a8b95]/20'
                                      }`}>
                                          {m && <ShieldCheck size={14} />}
                                      </div>
                                  </td>
                              ))}
                              <td className="py-4 px-6 text-center">
                                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border whitespace-nowrap ${
                                      p.status === 'Completed' ? `bg-[${THEME.success}15] text-[${THEME.success}] border-[${THEME.success}30]` : 
                                      p.status === 'In Progress' ? `bg-[${THEME.brightGold}15] text-[${THEME.brightGold}] border-[${THEME.brightGold}30]` : 
                                      p.status === 'Delayed' ? `bg-[${THEME.danger}15] text-[${THEME.danger}] border-[${THEME.danger}30]` :
                                      `bg-[${THEME.dustyBlue}15] text-[${THEME.dustyBlue}] border-[${THEME.dustyBlue}30]`
                                  }`}>
                                      {p.status}
                                  </span>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
          
          <div className="p-8 bg-[#f8f9fa] border-t border-[#eaeaec] flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-8">
                  <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-[#212c46] rounded-md shadow-sm"></div>
                      <span className="text-[10px] font-black text-[#7a8b95] uppercase tracking-widest">Planned Month</span>
                  </div>
                  <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-[#657f4d15] border border-[#657f4d30] rounded-md"></div>
                      <span className="text-[10px] font-black text-[#7a8b95] uppercase tracking-widest">Completed</span>
                  </div>
              </div>
              <p className="text-[10px] font-black text-[#212c46] bg-[#b7a15915] px-4 py-2 rounded-xl border border-[#b7a15930] uppercase tracking-widest animate-pulse">Next Audit: ISO 9001 Awareness - 15 June 2024</p>
          </div>
      </div>
    </div>
  );
}
