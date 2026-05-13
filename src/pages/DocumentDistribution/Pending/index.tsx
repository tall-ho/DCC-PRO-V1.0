import React, { useState, useMemo, useEffect } from 'react';
import {
  Search, Plus, Eye, ChevronLeft, ChevronRight, Filter, 
  Users, CheckCircle, Clock, AlertTriangle, HelpCircle, X,
  LayoutDashboard, List, FileText, Globe, 
  ShieldCheck, MoreHorizontal, Activity, CheckSquare, MessageSquareDiff, AlertOctagon, Target,
  PieChart as PieChartIcon, BarChart3, Printer, QrCode, ChevronDown, Check,
  FilePlus, FileEdit, FileX2, Copy, FileStack, HardDriveDownload, Trash2, ClipboardCheck,
  RefreshCw, Kanban, History, ArrowUpRight, ArrowDownRight, TrendingUp, Lightbulb, BarChart2, CheckCircle2, Info, Trash, Share2, XCircle, CalendarDays, Network
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, 
  PieChart as RechartsPieChart, Pie, Cell, CartesianGrid, Legend
} from 'recharts';

// --- Theme Configuration (Synced with DCC PRO logic) ---
const THEME = {
  bgMain: 'transparent',
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
  silver: '#d7d7d7'
};

// --- Global Styles ---
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700;800&family=Noto+Sans+Thai:wght@300;400;500;600;700;800&display=swap');

  :root {
    --font-mixed: 'JetBrains Mono', 'Noto Sans Thai', sans-serif;
  }

  * { 
    font-family: var(--font-mixed) !important; 
    box-sizing: border-box;
  }

  html, body { 
    background-color: transparent; 
    font-size: 12px !important;
    margin: 0;
    padding: 0;
    min-height: 100vh;
  }

  table tr th, table tr td {
    font-size: 12px !important;
  }

  .custom-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; }
  .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
  .custom-scrollbar::-webkit-scrollbar-thumb { background: ${THEME.silver}; border-radius: 10px; }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: ${THEME.dustyBlue}; }
  
  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  .animate-fade { animation: fadeIn 0.4s ease-out forwards; }
`;

// --- Mock Data ---
const THAI_MONTHS = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];

const KANBAN_STAGES = [
  { id: 'dept_head', label: 'AWAITING DEPT HEAD', icon: Clock, color: `text-[${THEME.accent}]`, bg: `bg-[#FFF9F2]`, border: `border-[#F3E8D8]` },
  { id: 'dcc_review', label: 'AWAITING DCC REVIEW', icon: ShieldCheck, color: `text-[${THEME.primary}]`, bg: `bg-white`, border: `border-[${THEME.silver}]` },
  { id: 'processing', label: 'DCC PROCESSING', icon: Activity, color: `text-[${THEME.success}]`, bg: `bg-[#F0FDF4]`, border: `border-[#DCFCE7]` },
  { id: 'overdue', label: 'OVERDUE TASKS', icon: AlertTriangle, color: `text-[${THEME.danger}]`, bg: `bg-[#FDF4F4]`, border: `border-[#F0D5D5]` },
];

const INITIAL_DIST_DATA = [
  { id: 'DIST-26-001', docRef: 'QM-01', title: 'Quality Management Manual', holder: 'QMR Office', dept: 'MANAGEMENT', issueDate: '01-JAN-2025', type: 'Controlled', status: 'ACTIVE', stage: 'processing' },
  { id: 'DIST-26-003', docRef: 'QP-PD-01', title: 'Production Control Procedure', holder: 'PD Manager', dept: 'PRODUCTION', issueDate: '20-MAR-2025', type: 'Controlled', status: 'ACTIVE', stage: 'dcc_review' },
  { id: 'DIST-26-004', docRef: 'QP-PD-01', title: 'Production Control Procedure', holder: 'Planning Sup.', dept: 'PRODUCTION', issueDate: '20-MAR-2025', type: 'Controlled', status: 'RETURNED', stage: 'dept_head' },
  { id: 'DIST-26-005', docRef: 'WI-PD-001', title: 'CNC Operation WI', holder: 'Line A Sup.', dept: 'PRODUCTION', issueDate: '01-FEB-2026', type: 'Controlled', status: 'ACTIVE', stage: 'overdue' },
  { id: 'DIST-26-006', docRef: 'WI-QA-05', title: 'Calibration WI', holder: 'Internal Auditor', dept: 'QA/QC', issueDate: '05-FEB-2026', type: 'Uncontrolled', status: 'ACTIVE', stage: 'processing' },
];

const BAR_DATA_DEPT = [
  { name: 'PRODUCTION', count: 2, fill: THEME.danger },
  { name: 'QA/QC', count: 1, fill: THEME.primary },
  { name: 'HR', count: 1, fill: THEME.primary },
  { name: 'WAREHOUSE', count: 1, fill: THEME.primary },
  { name: 'PURCHASING', count: 1, fill: THEME.primary },
];

const TYPE_CHART_DATA = [
  { name: 'CONTROLLED', value: 4, fill: THEME.success },
  { name: 'UNCONTROLLED', value: 1, fill: THEME.primary },
];

const RenderIcon = ({ icon: IconComponent, size = 16, className = "", strokeWidth = 2 }: any) => {
  return IconComponent ? <IconComponent size={size} className={className} strokeWidth={strokeWidth} /> : null;
};

const MonthYearSelector = ({ value, onChange }: any) => {
  const [year, month] = value.split('-');
  const monthIndex = parseInt(month, 10) - 1;
  return (
    <div className="relative inline-flex items-center bg-white border border-[#d7d7d7] rounded shadow-sm h-[38px] hover:border-[#b58c4f] transition-colors overflow-hidden group">
      <input type="month" value={value} onChange={(e) => onChange(e.target.value)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
      <div className="px-3 h-full flex items-center bg-transparent border-r border-[#d7d7d7] text-[#7a8b95] group-hover:bg-[#f3f3f1] transition-colors">
        <RenderIcon icon={CalendarDays} size={16} />
      </div>
      <div className="px-4 flex items-center justify-between min-w-[130px] gap-4 text-[#212c46]">
        <span className="font-bold text-[14px] font-sans tracking-wide">{THAI_MONTHS[monthIndex]} <span className="ml-1">{year}</span></span>
        <RenderIcon icon={CalendarDays} size={14} className="opacity-50" />
      </div>
    </div>
  );
};

const TypeBadge = ({ type }: { type: string }) => {
  const styles = type === 'Controlled' 
    ? 'bg-orange-50 text-orange-700 border-orange-200' 
    : 'bg-slate-50 text-slate-700 border-slate-200';
  return (
    <span className={`px-2.5 py-1 rounded font-black border text-[9px] uppercase tracking-widest font-mono shadow-sm ${styles}`}>
      {type}
    </span>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const styles: any = {
    'ACTIVE': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'RETURNED': 'bg-blue-50 text-blue-600 border-blue-200',
    'OBSOLETE': 'bg-red-50 text-red-600 border-red-200',
  };
  const Icons: any = { 'ACTIVE': CheckCircle2, 'RETURNED': History, 'OBSOLETE': XCircle };
  return (
    <span className={`px-2.5 py-1 rounded-lg font-black border text-[9px] uppercase tracking-widest font-mono flex items-center justify-center gap-1.5 shadow-sm ${styles[status]}`}>
      <RenderIcon icon={Icons[status]} size={10} strokeWidth={3} /> {status}
    </span>
  );
};

const SummaryView = ({ selectedMonthDisplay, dataCount }: any) => {
  const KPIS = [
    { label: 'AWAITING DEPT HEAD', val: '2', color: THEME.accent, icon: Clock, bg: '#FFF9F2' },
    { label: 'AWAITING DCC REVIEW', val: '1', color: THEME.primary, icon: ShieldCheck, bg: 'transparent' },
    { label: 'DCC PROCESSING', val: '2', color: THEME.success, icon: Activity, bg: '#F0FDF4' },
    { label: 'OVERDUE TASKS', val: '1', color: THEME.danger, icon: AlertTriangle, bg: '#FDF4F4' },
  ];

  return (
    <div className="space-y-6 animate-fade mt-4 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-2">
        <div>
          <h2 className="text-2xl font-black text-[#212c46] uppercase tracking-tight">DISTRIBUTION DASHBOARD</h2>
          <p className="text-[#7a8b95] font-bold text-[11px] uppercase tracking-widest mt-1.5 flex items-center gap-2">
            <RenderIcon icon={CalendarDays} size={14}/> OVERVIEW FOR {selectedMonthDisplay} 2026
          </p>
        </div>
        <div className="bg-white px-6 py-4 rounded-3xl shadow-sm border border-[#d7d7d7]/50 flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className="bg-[#212c46]/10 w-12 h-12 rounded-2xl flex items-center justify-center text-[#212c46]"><Target size={24} strokeWidth={2.5} /></div>
          <div><div className="text-3xl font-black text-[#212c46] font-mono leading-none">{dataCount}</div><div className="text-[10px] font-black text-[#7a8b95] uppercase tracking-widest mt-1">Total Action Items</div></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {KPIS.map((kpi, i) => (
          <div key={i} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between h-[150px] relative overflow-hidden group hover:shadow-md transition-all">
             <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full opacity-40 transition-transform duration-500 ease-out pointer-events-none group-hover:scale-[1.8]" style={{ backgroundColor: kpi.bg }}></div>
             <div className="flex justify-between items-start z-10">
               <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner" style={{ backgroundColor: kpi.bg, color: kpi.color }}>
                 <RenderIcon icon={kpi.icon} size={22} strokeWidth={2.5}/>
               </div>
               <span className="text-4xl font-black font-mono tracking-tighter text-[#212c46]">{kpi.val}</span>
             </div>
             <div className="z-10 mt-auto"><p className="text-[11px] font-black text-[#212c46] uppercase tracking-widest leading-tight">{kpi.label}</p><p className="text-[10px] font-bold text-[#7a8b95] mt-1.5 flex items-center gap-1"><RenderIcon icon={Activity} size={10}/> Active Tasks</p></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm h-[400px] flex flex-col">
          <div className="flex justify-between items-center mb-6 border-b border-[#d7d7d7] pb-4"><h4 className="text-sm font-black text-[#212c46] uppercase tracking-widest font-mono flex items-center gap-2"><Users size={18} className="text-[#932c2e]" /> Pending By Department</h4><span className="text-[10px] bg-transparent px-3 py-1 rounded-full border border-[#d7d7d7] font-bold text-[#7a8b95]">Top 5 Depts</span></div>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={BAR_DATA_DEPT} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#d7d7d7" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#7a8b95', fontWeight: 'bold'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: THEME.primary, fontWeight: 'bold'}} />
                <RechartsTooltip cursor={{fill: '#f3f3f1'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'}} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={45}>{BAR_DATA_DEPT.map((entry, index) => <Cell key={`cell-${index}`} fill={index === 0 ? THEME.danger : THEME.primary} />)}</Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="lg:col-span-4 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm h-[400px] flex flex-col">
          <div className="flex justify-between items-center mb-6 border-b border-[#d7d7d7] pb-4"><h4 className="text-sm font-black text-[#212c46] uppercase tracking-widest font-mono flex items-center gap-2"><Share2 size={18} className="text-[#932c2e]" /> Copy Type Mix</h4></div>
          <div className="flex-1 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie data={TYPE_CHART_DATA} cx="50%" cy="50%" innerRadius={75} outerRadius={105} paddingAngle={5} dataKey="value" stroke="none">
                  {TYPE_CHART_DATA.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                </Pie>
                <RechartsTooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"><span className="text-3xl font-black text-[#212c46] font-mono">5</span><span className="text-[10px] text-[#7a8b95] font-bold uppercase tracking-widest">Total</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function DistributionPending() {
  const [activeTab, setActiveTab] = useState('summary');
  const [selectedMonth, setSelectedMonth] = useState('2026-04');
  const [search, setSearch] = useState('');

  const TABS = [
    { id: 'summary', label: 'SUMMARY', icon: LayoutDashboard },
    { id: 'kanban', label: 'MY APPROVALS', icon: CheckCircle2 },
    { id: 'list', label: 'LIST VIEW', icon: List }
  ];

  const pendingCount = INITIAL_DIST_DATA.length;
  const currentMonthName = THAI_MONTHS[parseInt(selectedMonth.split('-')[1], 10) - 1].toUpperCase();

  return (
    <>
      <style>{globalStyles}</style>
      <div className="flex flex-col min-h-screen w-full text-[#212c46] bg-transparent overflow-x-hidden relative">
        <header className="px-8 py-6 bg-transparent flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shrink-0 no-print animate-fade">
          <div className="flex items-center gap-4 shrink-0">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center border border-[#d7d7d7] shadow-sm shrink-0">
              <Network size={28} className="text-[#3f809e]" />
            </div>
            <div className="flex flex-col justify-center">
              <h1 className="text-[26px] font-black tracking-tight flex gap-2.5 uppercase font-mono">
                <span className="text-[#212c46]">DISTRIBUTION</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3f809e] to-[#b58c4f]">PENDING</span>
              </h1>
              <p className="text-[#7a8b95] font-bold uppercase tracking-[0.2em] mt-1 text-[11px] font-mono">
                ทะเบียนประวัติการแจกจ่ายเอกสารควบคุม
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <MonthYearSelector value={selectedMonth} onChange={setSelectedMonth} />
            <div className="bg-transparent p-1.5 rounded-xl inline-flex items-center shadow-inner gap-1 border border-[#d7d7d7]">
              {TABS.map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-5 py-2.5 rounded-lg font-black uppercase tracking-widest flex items-center gap-2 transition-all duration-300 font-mono text-[12px] relative ${activeTab === tab.id ? 'bg-[#212c46] text-white shadow-lg scale-105' : 'text-[#7a8b95] hover:text-[#212c46] hover:bg-white/80'}`}>
                    <RenderIcon icon={tab.icon} size={14}/> {tab.label}
                    {tab.id === 'kanban' && <div className="absolute -top-2 -right-2 bg-[#932c2e] text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-md font-black">{pendingCount}</div>}
                  </button>
              ))}
            </div>
          </div>
        </header>

        <main className="flex-1 w-full max-w-[1600px] mx-auto px-8 pb-10 flex flex-col min-h-0 overflow-y-auto custom-scrollbar">
           {activeTab === 'summary' && <SummaryView selectedMonthDisplay={currentMonthName} dataCount={pendingCount} />}
           
           {activeTab === 'kanban' && (
             <div className="overflow-x-auto custom-scrollbar h-full pb-6 -mx-4 px-4 mt-6">
                <div className="grid grid-cols-4 gap-6 min-w-[1200px] h-full items-stretch animate-fade pb-24">
                  {KANBAN_STAGES.map(stage => {
                    const stageItems = INITIAL_DIST_DATA.filter(item => item.stage === stage.id);
                    return (
                      <div key={stage.id} className="flex flex-col h-full min-h-0">
                        <div className={`px-5 py-4 rounded-t-2xl flex items-center justify-between border-t-[3px] border-x border-b ${stage.border} ${stage.bg} shrink-0`}>
                          <div className="flex items-center gap-3"><RenderIcon icon={stage.icon} size={18} className={stage.color} strokeWidth={2.5} /><span className={`text-[11px] font-black uppercase tracking-widest ${stage.color} font-mono`}>{stage.label}</span></div>
                          <span className={`bg-white px-3 py-1 rounded-full text-[10px] font-black shadow-sm border border-white/50 ${stage.color} font-mono`}>{stageItems.length}</span>
                        </div>
                        <div className={`p-4 rounded-b-2xl border-x border-b border-t-0 ${stage.border} flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-3 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] bg-gradient-to-b from-white/40 to-transparent`}>
                            {stageItems.map(item => (
                                <div key={item.id} className="bg-white p-5 rounded-2xl shadow-sm border border-[#d7d7d7] hover:border-[#b58c4f] hover:shadow-md transition-all duration-300 group flex flex-col relative overflow-hidden cursor-pointer">
                                  <div className="flex justify-between items-start mb-3"><span className="text-[10px] font-black text-[#932c2e] font-mono bg-white px-2.5 py-1 rounded-lg border border-[#d7d7d7] shadow-sm flex items-center gap-1.5"><FileStack size={12}/>{item.id}</span></div>
                                  <h4 className="text-[13px] font-black text-[#212c46] leading-relaxed mb-3 line-clamp-2">{item.title}</h4>
                                  <p className="text-[10px] font-mono text-[#7a8b95] font-bold mb-4 flex items-center gap-1.5 opacity-80">Doc No: {item.docRef}</p>
                                  <div className="flex items-center justify-between border-t border-[#d7d7d7] pt-3 mt-auto gap-2">
                                     <div className="flex flex-col items-start gap-1.5 min-w-0"><span className="text-[10px] font-black text-[#7a8b95] uppercase font-mono tracking-widest truncate w-full">{item.dept}</span><TypeBadge type={item.type} /></div>
                                     <button className="p-1.5 bg-transparent border border-[#d7d7d7] text-[#7a8b95] hover:bg-[#212c46] hover:text-white rounded-lg shadow-sm transition-all"><Eye size={16}/></button>
                                  </div>
                                </div>
                            ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
             </div>
           )}

           {activeTab === 'list' && (
             <div className="bg-white rounded-none border border-[#d7d7d7]/30 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-140px)] animate-fade mt-6">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white shrink-0 gap-4">
                   <div className="flex items-center gap-2 bg-transparent px-4 py-2 rounded-xl border border-[#d7d7d7]/50 shadow-sm">
                      <Users size={14} className="text-[#212c46] mr-1"/><span className="text-[10px] text-[#7a8b95] font-extrabold uppercase tracking-widest font-mono">DEPT:</span><span className="mx-2 text-[#d7d7d7]">|</span>
                      <select className="bg-transparent font-black text-[#212c46] outline-none cursor-pointer uppercase font-mono text-[11px] pr-4"><option>ALL DEPARTMENTS</option></select>
                   </div>
                   <div className="relative w-96">
                      <div className="absolute left-4 top-2.5 text-[#7a8b95]"><Search size={16}/></div>
                      <input type="text" placeholder="Search Holder or Title..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-12 pr-4 py-2.5 bg-transparent border border-[#d7d7d7]/50 rounded-xl outline-none focus:border-[#b58c4f] text-[12px] font-bold font-mono transition-all shadow-sm" />
                   </div>
                </div>
                <div className="overflow-x-auto flex-1 custom-scrollbar">
                   <table className="w-full text-left border-collapse min-w-[1300px]">
                      <thead className="bg-[#1d2636] border-b-[3px] border-[#b7a159] sticky top-0 z-10 text-white font-mono text-[10px] uppercase tracking-[0.15em]">
                         <tr>
                            <th className="py-4 px-6">COPY ID</th>
                            <th className="py-4 px-6">DOC REF</th>
                            <th className="py-4 px-6">DOCUMENT TITLE</th>
                            <th className="py-4 px-6 text-center">HOLDER / DEPARTMENT</th>
                            <th className="py-4 px-6 text-center">ISSUE DATE</th>
                            <th className="py-4 px-6 text-center">TYPE</th>
                            <th className="py-4 px-6 text-center">STATUS</th>
                            <th className="py-4 px-6 text-center">ACTION</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 font-mono text-[12px]">
                         {INITIAL_DIST_DATA.map(item => (
                            <tr key={item.id} className="hover:bg-gray-50 transition-colors h-20 group">
                               <td className="py-4 px-6 font-bold text-[#212c46]">{item.id}</td>
                               <td className="py-4 px-6 font-black text-[#932c2e]">{item.docRef}</td>
                               <td className="py-4 px-6 font-bold text-[#2f2926]">{item.title}</td>
                               <td className="py-4 px-6 text-center font-bold text-[#2f2926]">{item.holder} <br/> <span className="text-[10px] text-[#7a8b95] uppercase">{item.dept}</span></td>
                               <td className="py-4 px-6 text-center text-[#7a8b95] font-bold">{item.issueDate}</td>
                               <td className="py-4 px-6 text-center"><TypeBadge type={item.type} /></td>
                               <td className="py-4 px-6 text-center"><StatusBadge status={item.status} /></td>
                               <td className="py-4 px-6 text-center"><button className="p-1.5 bg-white border border-[#d7d7d7] rounded-lg shadow-sm hover:bg-[#212c46] hover:text-white transition-all"><Eye size={14}/></button></td>
                            </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
             </div>
           )}
        </main>
      </div>
    </>
  );
}
