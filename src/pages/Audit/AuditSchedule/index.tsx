import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import * as Icons from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, 
  PieChart as RechartsPieChart, Pie, Cell, CartesianGrid
} from 'recharts';

const THEME = {
  bgMain: 'transparent',
  primary: '#212c46',
  primaryLight: '#4d87a8',
  accent: '#657f4d',
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
  silver: '#d7d7d7',
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

const INITIAL_SCHEDULE = [
    { id: 'SCH-26/05-1', date: '2026-05-15', time: '09:00 - 16:00', activity: 'Internal Audit', standard: 'ISO 9001:2015', auditor: 'T All Team', auditee: 'Production Dept', status: 'Upcoming' },
    { id: 'SCH-26/05-2', date: '2026-05-18', time: '10:00 - 12:00', activity: 'Follow-up Audit', standard: 'GHPs', auditor: 'John Doe', auditee: 'Warehouse', status: 'InProgress' },
    { id: 'SCH-26/04-1', date: '2026-04-10', time: '08:30 - 17:00', activity: 'CB Audit', standard: 'ISO 14001:2015', auditor: 'SGS Thailand', auditee: 'Facility Mgt', status: 'Completed' },
    { id: 'SCH-26/06-1', date: '2026-06-05', time: '09:00 - 12:00', activity: 'Supplier Audit', standard: 'Vendor Assessment', auditor: 'Jane Smith', auditee: 'Supplier A', status: 'Planned' },
];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
const BAR_DATA = MONTHS.map(m => ({
  name: m,
  count: Math.floor(Math.random() * 6) + 1,
}));

const PIE_DATA = [
  { name: 'Upcoming', value: 2, color: THEME.skyBlue },
  { name: 'InProgress', value: 1, color: THEME.gold },
  { name: 'Completed', value: 1, color: THEME.success },
];

const StatusBadge = ({ status }: { status: string }) => {
  const styles: any = {
    'Completed': { bg: '#657f4d15', text: THEME.success, border: '#657f4d30', icon: Icons.CheckCircle2 },
    'InProgress': { bg: '#b58c4f15', text: THEME.gold, border: '#b58c4f30', icon: Icons.Activity },
    'Upcoming': { bg: '#3f809e15', text: THEME.skyBlue, border: '#3f809e30', icon: Icons.Clock },
    'Planned': { bg: '#7a8b9515', text: THEME.dustyBlue, border: '#7a8b9530', icon: Icons.Calendar },
  };
  const config = styles[status] || styles['Planned'];
  const Icon = config.icon;
  return (
    <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 border shadow-sm w-[130px]" style={{ backgroundColor: config.bg, color: config.text, borderColor: config.border }}>
      <Icon size={12} strokeWidth={3} /> {status}
    </span>
  );
};

const KpiCard = ({ icon, value, label, colorAccent, colorValue, desc }: any) => {
  const IconComp = Icons[icon as keyof typeof Icons] as any || Icons.HelpCircle;
  return (
      <div className="bg-white/90 px-6 py-6 rounded-2xl border border-[#eaeaec] shadow-sm flex-1 min-w-[200px] relative overflow-hidden group hover:border-[#b7a159] transition-all min-h-[120px] flex flex-col justify-between animate-fadeIn">
          <div className="absolute -right-4 -bottom-6 opacity-[0.05] transform group-hover:scale-110 transition-transform duration-700 pointer-events-none">
              <IconComp size={110} color={colorAccent} />
          </div>
          <div className="relative z-10 flex justify-between items-start w-full">
              <p className="text-[11px] font-bold text-[#7a8b95] uppercase tracking-[0.1em] drop-shadow-sm">{label}</p>
              <div className="w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 shadow-sm transition-all group-hover:rotate-6" style={{backgroundColor: `${colorAccent}15`, borderColor: `${colorAccent}25`, color: colorAccent}}>
                  <IconComp size={20} />
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
};

function UserGuidePanel({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  if (typeof document === 'undefined') return null;
  return createPortal(
    <>
      <div className={`fixed inset-0 z-[190] bg-[#212c46]/60 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={onClose}/>
      <div className={`fixed inset-y-0 right-0 z-[200] w-full md:w-[500px] bg-white shadow-2xl transform transition-transform duration-500 ease-in-out flex flex-col border-l-2 border-[#b7a159] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-between items-center p-5 px-6 border-b-2 border-[#b7a159] bg-[#212c46] text-white shrink-0">
          <div>
            <h3 className="font-black flex items-center gap-3 uppercase tracking-widest text-lg"><Icons.CalendarDays size={22} className="text-[#b7a159]"/> AUDIT SCHEDULE GUIDE</h3>
            <p className="text-[12px] font-bold text-[#d7d7d7] uppercase tracking-widest mt-1.5">Schedule & Planning Management</p>
          </div>
          <button onClick={onClose} className="p-2 text-white/50 hover:text-[#932c2e] hover:bg-white/10 rounded-xl transition-colors"><Icons.X size={24}/></button>
        </div>
        <div className="flex-1 overflow-y-auto p-8 space-y-8 text-[#414757] text-[12px] leading-relaxed custom-scrollbar bg-white">
          <section className="animate-fadeIn">
            <h4 className="text-[14px] font-black text-[#212c46] mb-3 uppercase flex items-center gap-2 border-b-2 border-[#d7d7d7] pb-2 font-mono">
              <Icons.LayoutDashboard size={18} className="text-[#b7a159]"/> 1. Overview
            </h4>
            <p className="text-[12px] mb-3">หน้าตารางเวลาการตรวจประเมิน (Audit Schedule):</p>
            <ul className="list-disc pl-5 mt-2 space-y-2 text-[12px]">
                <li><strong className="text-[#4d87a8]">Dashboard:</strong> ติดตามและวิเคราะห์ภาพรวมของแผนการตรวจประเมิน</li>
                <li><strong className="text-[#212c46]">Schedule List:</strong> ตารางคิวงานการตรวจประเมิน พร้อมรายละเอียดผู้ตรวจ ผู้ถูกตรวจ และมาตรฐาน</li>
            </ul>
          </section>
        </div>
        <div className="p-4 bg-[#f8f9fa] border-t border-[#eaeaec] flex justify-end shrink-0">
          <button onClick={onClose} className="px-8 py-2.5 bg-[#212c46] text-white font-black rounded-xl uppercase text-[12px] hover:bg-[#414757] hover:text-white transition-all shadow-md tracking-[0.1em]">รับทราบ (Got it)</button>
        </div>
      </div>
    </>, document.body
  );
}

export default function AuditSchedule() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Modals & User guide
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isNewScheduleOpen, setIsNewScheduleOpen] = useState(false);
  const [viewScheduleId, setViewScheduleId] = useState<string | null>(null);
  const [editScheduleId, setEditScheduleId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredLogs = useMemo(() => {
    return INITIAL_SCHEDULE.filter(l => 
      l.id.toLowerCase().includes(search.toLowerCase()) || 
      l.activity.toLowerCase().includes(search.toLowerCase()) ||
      l.auditor.toLowerCase().includes(search.toLowerCase()) ||
      l.auditee.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const currentData = filteredLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage) || 1;

  return (
    <div className="flex flex-1 w-full font-sans flex-col pb-0 animate-fadeIn bg-transparent relative">
      <style dangerouslySetInnerHTML={{__html: globalStyles}} />
      
      {toastMessage && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[300] bg-[#212c46] text-white px-6 py-3 rounded-full font-black text-[12px] uppercase tracking-widest shadow-2xl flex items-center gap-3 animate-fadeIn">
            <Icons.CheckCircle2 size={18} className="text-[#b7a159]"/>
            {toastMessage}
        </div>
      )}

      {(isNewScheduleOpen || viewScheduleId || editScheduleId || isFilterOpen) && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-[#212c46]/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-[#eaeaec] flex flex-col">
                <div className="px-6 py-4 border-b border-[#eaeaec] bg-[#f8f9fa] flex justify-between items-center">
                    <h3 className="font-black text-[#212c46] uppercase tracking-widest text-[14px] flex items-center gap-2">
                        {isFilterOpen ? <><Icons.Filter size={18} className="text-[#3f809e]"/> Filter Schedule</> :
                         isNewScheduleOpen ? <><Icons.CalendarPlus size={18} className="text-[#success]"/> Create New Schedule</> :
                         viewScheduleId ? <><Icons.Eye size={18} className="text-[#b58c4f]"/> View Schedule Details</> :
                         <><Icons.Edit3 size={18} className="text-[#a94228]"/> Edit Schedule Details</>}
                    </h3>
                    <button onClick={() => { setIsFilterOpen(false); setIsNewScheduleOpen(false); setViewScheduleId(null); setEditScheduleId(null); }} className="text-[#7a8b95] hover:text-[#932c2e] transition-colors"><Icons.X size={20}/></button>
                </div>
                <div className="p-8 text-[#414757] text-[12px] font-bold">
                    {isFilterOpen && <p className="text-center text-[#7a8b95] py-10">Filter Options for Audit Schedule</p>}
                    {isNewScheduleOpen && <p className="text-center text-[#7a8b95] py-10">Input form to assign Date, Time, Auditor, and Auditee.</p>}
                    {viewScheduleId && <p className="text-center text-[#7a8b95] py-10">Detailed view for Schedule ID: <span className="text-[#932c2e] font-black">{viewScheduleId}</span></p>}
                    {editScheduleId && <p className="text-center text-[#7a8b95] py-10">Edit view for Schedule ID: <span className="text-[#932c2e] font-black">{editScheduleId}</span></p>}
                </div>
                <div className="px-6 py-4 bg-[#f8f9fa] border-t border-[#eaeaec] flex justify-end gap-3">
                    <button onClick={() => { setIsFilterOpen(false); setIsNewScheduleOpen(false); setViewScheduleId(null); setEditScheduleId(null); }} className="px-6 py-2.5 rounded-xl font-black text-[12px] uppercase tracking-widest text-[#7a8b95] bg-white border border-[#eaeaec] shadow-sm hover:text-[#212c46] hover:border-[#b7a159] transition-all">Cancel</button>
                    {!viewScheduleId && (
                      <button onClick={() => { 
                          setIsFilterOpen(false); setIsNewScheduleOpen(false); setEditScheduleId(null); 
                          showToast(isFilterOpen ? "Filters Applied" : isNewScheduleOpen ? "Schedule Created Successfully" : "Changes Saved"); 
                      }} className="px-6 py-2.5 rounded-xl font-black text-[12px] uppercase tracking-widest text-white bg-[#212c46] border border-[#212c46] shadow-md hover:bg-[#b7a159] hover:border-[#b7a159] transition-all">
                          {isFilterOpen ? 'Apply Filters' : 'Save Details'}
                      </button>
                    )}
                </div>
            </div>
        </div>
      )}

      {/* USER GUIDE FLOATING TAB */}
      <button onClick={() => setIsGuideOpen(true)} className="fixed right-0 top-[220px] -translate-y-1/2 bg-[#f8f9fa] border border-[#eaeaec] border-r-0 text-[#212c46] py-8 px-1.5 rounded-l-xl shadow-md hover:bg-[#932c2e] hover:text-white hover:border-[#932c2e] transition-all duration-500 z-[100] flex flex-col items-center gap-4 group">
          <Icons.HelpCircle size={18} className="shrink-0 group-hover:rotate-12 transition-transform text-[#7a8b95] group-hover:text-white" />
          <span className="font-black tracking-[0.3em] [writing-mode:vertical-rl] rotate-180 whitespace-nowrap uppercase text-[11px]">USER GUIDE</span>
      </button>

      <UserGuidePanel isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />

      {/* HEADER SECTION */}
      <div className="px-8 pt-3 pb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 z-20 shrink-0">
          <div className="flex items-center gap-5">
              <div className="relative flex items-center justify-center group cursor-default shrink-0">
                  <div className="absolute inset-0 bg-[#657f4d] blur-[15px] opacity-20 rounded-full group-hover:opacity-60 transition-all duration-700"></div>
                  <div className="relative z-10 p-1.5 border border-[#657f4d]/40 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm">
                      <Icons.CalendarDays size={28} strokeWidth={2.5} className="text-[#657f4d]" />
                  </div>
              </div>
              <div>
                  <h3 className="font-black text-[#212c46] uppercase tracking-tighter leading-none" style={{ fontSize: '24px' }}>
                      AUDIT <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#657f4d] to-[#b58c4f]">SCHEDULE</span>
                  </h3>
                  <p className="text-[11px] font-bold text-[#4d5a44] uppercase tracking-[0.2em] mt-0.5 opacity-80 leading-none">
                      PLANNING & DATE TIME MANAGEMENT
                  </p>
              </div>
          </div>

          <div className="flex items-center gap-4">
              <div className="bg-white/50 p-1.5 rounded-xl border border-white/60 shadow-inner flex flex-wrap items-center gap-1">
                  <button onClick={() => setActiveTab('dashboard')} className={`px-6 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'dashboard' ? 'bg-[#212c46] text-white shadow-md' : 'text-[#7a8b95] hover:text-[#657f4d]'}`}>
                    <Icons.LayoutDashboard size={16} /> Dashboard
                  </button>
                  <button onClick={() => setActiveTab('registry')} className={`px-6 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'registry' ? 'bg-[#212c46] text-white shadow-md' : 'text-[#7a8b95] hover:text-[#657f4d]'}`}>
                    <Icons.List size={16} /> Schedule List
                  </button>
              </div>
          </div>
      </div>

      <div className="px-8 mt-2 pb-6 max-w-[1500px] w-full mx-auto">
        {activeTab === 'dashboard' ? (
          <div className="space-y-6 animate-fadeIn">
            {/* KPI STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <KpiCard label="Total Audits" value={INITIAL_SCHEDULE.length} icon="Calendar" colorAccent={THEME.primaryLight} colorValue={THEME.primary} desc="Planned YTD" />
                <KpiCard label="Upcoming" value={2} icon="Clock" colorAccent={THEME.skyBlue} colorValue={THEME.primary} desc="Awaiting Actions" />
                <KpiCard label="In Progress" value={1} icon="Activity" colorAccent={THEME.gold} colorValue={THEME.primary} desc="Currently Active" />
                <KpiCard label="Completed" value={1} icon="CheckCircle" colorAccent={THEME.success} colorValue={THEME.primary} desc="Finished Audits" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-8 bg-white rounded-3xl shadow-lg border border-[#eaeaec] p-6">
                    <h3 className="text-[14px] font-black text-[#212c46] uppercase tracking-widest flex items-center gap-2 border-b border-[#eaeaec] pb-4 mb-6"><Icons.BarChart2 size={18} className="text-[#657f4d]" /> AUDIT FREQUENCY / TIMELINE</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={BAR_DATA} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b', fontWeight: 'bold'}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b', fontWeight: 'bold'}} />
                                <RechartsTooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                                <Bar dataKey="count" fill={THEME.accent} radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                
                <div className="lg:col-span-4 bg-white rounded-3xl shadow-lg border border-[#eaeaec] p-6">
                    <h3 className="text-[14px] font-black text-[#212c46] uppercase tracking-widest flex items-center gap-2 border-b border-[#eaeaec] pb-4 mb-6"><Icons.PieChart size={18} className="text-[#657f4d]" /> STATUS BREAKDOWN</h3>
                    <div className="h-[300px] w-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <RechartsPieChart>
                                <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={5} dataKey="value" stroke="none">
                                    {PIE_DATA.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                </Pie>
                                <RechartsTooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)'}} />
                            </RechartsPieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/90 rounded-3xl shadow-lg border border-[#eaeaec] overflow-hidden flex flex-col animate-fadeIn min-h-[600px]">
              <div className="px-8 py-4 border-b border-[#eaeaec] bg-[#f8f9fa] flex flex-col md:flex-row justify-between items-center gap-4 shrink-0">
                  <div className="flex items-center gap-3">
                      <button onClick={() => setIsFilterOpen(true)} className="bg-white border border-[#eaeaec] text-[#212c46] px-5 py-2 rounded-xl font-black uppercase text-[12px] shadow-sm hover:border-[#b7a159] transition-all flex items-center gap-2">
                        <Icons.Filter size={14} /> FILTER
                      </button>
                      <button onClick={() => showToast('Exporting Data...')} className="bg-white border border-[#eaeaec] text-[#212c46] px-5 py-2 rounded-xl font-black uppercase text-[12px] shadow-sm hover:border-[#b7a159] transition-all flex items-center gap-2">
                        <Icons.Download size={14} /> EXPORT
                      </button>
                  </div>
                  <div className="flex items-center gap-3 w-full md:w-auto">
                      <div className="relative flex-1 md:w-80">
                          <Icons.Search size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-[#7a8b95]" />
                          <input type="text" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search Date, Activity, Auditor..." className="w-full pl-12 pr-6 py-2.5 text-[12px] border border-[#eaeaec] rounded-xl font-bold outline-none focus:border-[#b7a159] bg-white shadow-sm text-[#212c46]" />
                      </div>
                      <button onClick={() => setIsNewScheduleOpen(true)} className="bg-[#212c46] text-white px-6 py-2.5 rounded-xl font-black text-[12px] uppercase tracking-widest shadow-md hover:bg-[#414757] hover:text-white transition-all flex items-center gap-2 shrink-0 border border-[#212c46]">
                          <Icons.Plus size={16} /> ADD SCHEDULE
                      </button>
                  </div>
              </div>

              <div className="overflow-auto custom-scrollbar flex-1">
                  <table className="w-full text-left font-sans border-collapse min-w-[1000px]">
                      <thead className="bg-[#1d2636] text-white sticky top-0 z-10">
                          <tr className="border-b-[3px] border-[#657f4d]">
                              <th className="py-4 px-6 font-black uppercase tracking-widest text-[11px] whitespace-nowrap">ID</th>
                              <th className="py-4 px-6 font-black uppercase tracking-widest text-[11px] whitespace-nowrap">Date & Time</th>
                              <th className="py-4 px-6 font-black uppercase tracking-widest text-[11px] whitespace-nowrap">Activity / Standard</th>
                              <th className="py-4 px-6 font-black uppercase tracking-widest text-[11px] whitespace-nowrap">Auditor Body/Name</th>
                              <th className="py-4 px-6 font-black uppercase tracking-widest text-[11px] whitespace-nowrap">Auditee</th>
                              <th className="py-4 px-6 font-black uppercase tracking-widest text-[11px] text-center">Status</th>
                              <th className="py-4 px-6 font-black uppercase tracking-widest text-[11px] text-center">Action</th>
                          </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-[#eaeaec]">
                          {currentData.map((log, i) => (
                              <tr key={i} className="hover:bg-[#f8f9fa] transition-colors group">
                                  <td className="py-3 px-6 font-black text-[#932c2e] uppercase tracking-tight text-[12px]">
                                      <div className="flex items-center gap-2">
                                          <Icons.Calendar size={14} className="text-[#a54f6b]" />
                                          {log.id}
                                      </div>
                                  </td>
                                  <td className="py-3 px-6 font-bold text-[#4d87a8] uppercase text-[12px]">
                                    <div className="flex flex-col">
                                      <span>{log.date}</span>
                                      <span className="text-[#7a8b95] text-[10px]">{log.time}</span>
                                    </div>
                                  </td>
                                  <td className="py-3 px-6">
                                    <div className="flex flex-col">
                                      <span className="font-black text-[#212c46] text-[12px]">{log.activity}</span>
                                      <span className="font-bold text-[#3f809e] text-[10px] uppercase">{log.standard}</span>
                                    </div>
                                  </td>
                                  <td className="py-3 px-6 font-bold text-[#7a8b95] text-[12px] uppercase">{log.auditor}</td>
                                  <td className="py-3 px-6 font-bold text-[#b58c4f] text-[12px] uppercase">{log.auditee}</td>
                                  <td className="py-3 px-6 text-center flex justify-center">
                                      <StatusBadge status={log.status} />
                                  </td>
                                  <td className="py-3 px-6 text-center">
                                      <div className="flex justify-center items-center gap-[4px]">
                                          <button onClick={() => setViewScheduleId(log.id)} className="w-8 h-8 flex items-center justify-center rounded-lg text-[#212c46] border border-[#eaeaec] bg-white hover:bg-[#212c46] hover:text-white transition-all shadow-sm">
                                              <Icons.Eye size={14} />
                                          </button>
                                          <button onClick={() => setEditScheduleId(log.id)} className="w-8 h-8 flex items-center justify-center rounded-lg text-[#212c46] border border-[#eaeaec] bg-white hover:bg-[#3f809e] hover:text-white hover:border-[#3f809e] shadow-sm transition-all">
                                              <Icons.Edit3 size={14} />
                                          </button>
                                      </div>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>

              <div className="px-8 py-3 bg-[#f8f9fa] border-t border-[#eaeaec] flex justify-between items-center shrink-0">
                  <div className="flex items-center gap-6 text-[11px] font-black text-[#7a8b95] uppercase tracking-widest">
                      <div className="flex items-center gap-3">
                          <span>Display Rows:</span>
                          <select value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }} className="bg-white border border-[#eaeaec] rounded-lg px-3 py-1.5 outline-none font-black text-[#212c46] cursor-pointer shadow-sm">
                              {[5, 10, 20, 50].map(v => <option key={v} value={v}>{v}</option>)}
                          </select>
                      </div>
                      <p className="bg-white px-4 py-2 rounded-xl border border-[#eaeaec] shadow-sm">Total Records: {filteredLogs.length}</p>
                  </div>
                  <div className="flex items-center gap-3">
                      <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className={`w-10 h-10 border border-[#eaeaec] bg-white rounded-xl flex items-center justify-center transition-all ${currentPage === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#212c46] hover:text-white shadow-md active:scale-90'}`}>
                          <Icons.ChevronLeft size={18}/>
                      </button>
                      <div className="bg-[#212c46] text-white px-8 py-2.5 rounded-xl shadow-md font-black text-[11px] min-w-[140px] text-center uppercase tracking-widest">
                          Page {currentPage} / {totalPages}
                      </div>
                      <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className={`w-10 h-10 border border-[#eaeaec] bg-white rounded-xl flex items-center justify-center transition-all ${currentPage === totalPages ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#212c46] hover:text-white shadow-md active:scale-90'}`}>
                          <Icons.ChevronRight size={18}/>
                      </button>
                  </div>
              </div>
          </div>
        )}
      </div>
    </div>
  );
}
