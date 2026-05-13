import React, { useState, useMemo } from 'react';
import { 
  History, 
  Search, 
  CalendarDays, 
  Trash2, 
  CheckCircle2, 
  X, 
  HelpCircle, 
  ChevronLeft, 
  ChevronRight, 
  FileStack, 
  HardDriveDownload,
  Users,
  Target,
  ArrowUpRight,
  ShieldCheck,
  Activity,
  Archive,
  Megaphone,
  Filter,
  BarChart2,
  TrendingDown,
  Printer,
  MoreHorizontal,
  Plus
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend
} from 'recharts';

// --- Theme Configuration ---
const THEME = {
    bgMain: '#f3f3f1',
    bgGradient: 'transparent',
    sidebarBg: 'linear-gradient(180deg, #1d2636 0%, #0F172A 100%)',
    glassWhite: 'rgba(255, 255, 255, 0.88)',
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
    silver: '#d7d7d7',
    deepNavy: '#212c46',
    brownGold: '#b58c4f',
    vibrantPurple: '#2d2c4a',
    burntOrange: '#d96245',
    slateBlue: '#748ea1',
    coolGray: '#f3f3f1'
};

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700;800&family=Noto+Sans+Thai:wght@300;400;500;600;700;800&display=swap');
  
  * { font-family: 'JetBrains Mono', 'Noto Sans Thai', sans-serif !important; }
  
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #7a8b95; border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: #f3f3f1; }
  
  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  .animate-fadeIn { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
`;

const INITIAL_LOGS = [
  { id: 'DEST-2024-001', recordId: 'REC-PD-055', subject: 'Machine Log 2021', dept: 'Production', method: 'Shred', date: '2024-05-10', dccBy: 'Somsak', status: 'Completed' },
  { id: 'DEST-2024-002', recordId: 'REC-QA-102', subject: 'IQC Form FY2020', dept: 'QA/QC', method: 'Pulverize', date: '2024-05-12', dccBy: 'Wipa', status: 'Completed' },
  { id: 'DEST-2024-003', recordId: 'REC-HR-004', subject: 'CVs Pool 2019', dept: 'HR', method: 'Burn', date: '2024-05-15', dccBy: 'Somsak', status: 'Completed' },
  { id: 'DEST-2024-004', recordId: 'REC-EN-022', subject: 'Wiring Diagram Rev.0', dept: 'Engineering', method: 'Digital Delete', date: '2024-05-18', dccBy: 'Admin', status: 'Completed' },
  { id: 'DEST-2024-005', recordId: 'REC-MK-009', subject: 'Event Ads 2020', dept: 'Marketing', method: 'Shred', date: '2024-05-20', dccBy: 'Wipa', status: 'Completed' },
];

const CHART_DATA_METHOD = [
  { name: 'Shred', value: 45, color: THEME.danger },
  { name: 'Burn', value: 25, color: THEME.accent },
  { name: 'Delete', value: 30, color: THEME.skyBlue },
];

const CHART_DATA_TREND = [
  { month: 'Jan', count: 12 }, { month: 'Feb', count: 18 }, { month: 'Mar', count: 8 }, 
  { month: 'Apr', count: 24 }, { month: 'May', count: 32 }, { month: 'Jun', count: 20 },
];

export default function DestructionLog() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('list');
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const filteredLogs = useMemo(() => {
    return INITIAL_LOGS.filter(l => 
      l.id.toLowerCase().includes(search.toLowerCase()) || 
      l.subject.toLowerCase().includes(search.toLowerCase()) ||
      l.recordId.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <div className="flex flex-1 w-full font-sans flex-col pb-0 animate-fadeIn bg-transparent">
      <style dangerouslySetInnerHTML={{__html: globalStyles}} />

      {/* USER GUIDE FLOATING TAB */}
      <button onClick={() => setIsGuideOpen(true)} className="fixed right-0 top-[220px] -translate-y-1/2 bg-[#f3f3f1] border border-[#f3f3f1] border-r-0 text-[#212c46] py-8 px-1.5 rounded-l-xl shadow-md hover:bg-[#932c2e] hover:text-white hover:border-[#932c2e] transition-all duration-500 z-[100] flex flex-col items-center gap-4 group">
          <HelpCircle size={18} className="shrink-0 group-hover:rotate-12 transition-transform text-[#7a8b95] group-hover:text-white" />
          <span className="font-black tracking-[0.3em] [writing-mode:vertical-rl] rotate-180 whitespace-nowrap uppercase text-[11px]">USER GUIDE</span>
      </button>

      {/* HEADER SECTION */}
      <div className="px-8 pt-3 pb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 z-20 shrink-0">
          <div className="flex items-center gap-5">
              <div className="relative flex items-center justify-center group cursor-default shrink-0">
                  <div className="absolute inset-0 bg-[#3f809e] blur-[15px] opacity-20 rounded-full group-hover:opacity-60 transition-all duration-700"></div>
                  <div className="relative z-10 p-1.5 border border-[#3f809e]/40 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm">
                      <History size={28} strokeWidth={2.5} className="text-[#3f809e]" />
                  </div>
              </div>
              <div>
                  <h3 className="font-black text-[#212c46] uppercase tracking-tighter leading-none" style={{ fontSize: '24px' }}>
                      DESTRUCTION <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3f809e] to-[#b58c4f]">LOG BOOK</span>
                  </h3>
                  <p className="text-[11px] font-bold text-[#4d5a44] uppercase tracking-[0.2em] mt-0.5 opacity-80 leading-none">
                      HISTORICAL QUALITY RECORD DISPOSAL RECORDS
                  </p>
              </div>
          </div>

          <div className="flex items-center gap-4">
              <div className="bg-white/50 p-1.5 rounded-xl border border-white/60 shadow-inner flex flex-wrap items-center gap-1">
                  <button onClick={() => setActiveTab('list')} className={`px-6 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'list' ? 'bg-[#212c46] text-white shadow-md' : 'text-[#7a8b95] hover:text-[#3f809e]'}`}>
                    <Archive size={16} /> Registry Log
                  </button>
                  <button onClick={() => setActiveTab('stats')} className={`px-6 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'stats' ? 'bg-[#212c46] text-white shadow-md' : 'text-[#7a8b95] hover:text-[#3f809e]'}`}>
                    <BarChart2 size={16} /> Performance
                  </button>
              </div>
              <button className="bg-white text-[#212c46] px-5 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-sm border border-[#f3f3f1] hover:bg-[#f3f3f1] transition-all flex items-center gap-2">
                <HardDriveDownload size={16}/> Export Report
              </button>
          </div>
      </div>

      <div className="px-8 mt-2 pb-8 flex-1 overflow-y-auto custom-scrollbar">
        <div className="max-w-[1500px] w-full mx-auto">
           {activeTab === 'list' ? (
             <div className="space-y-6">
                {/* SEARCH & FILTERS */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                    <div className="lg:col-span-4 relative">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7a8b95]" />
                        <input 
                          type="text" 
                          value={search}
                          onChange={e => setSearch(e.target.value)}
                          placeholder="Search destruction records..."
                          className="w-full pl-12 pr-6 py-3.5 bg-white border border-[#f3f3f1] rounded-2xl text-[12px] font-bold text-[#212c46] outline-none focus:border-[#b7a159] shadow-sm"
                        />
                    </div>
                </div>

                {/* LOG TABLE */}
                <div className="bg-white/90 rounded-3xl border border-[#f3f3f1] shadow-lg overflow-hidden">
                    <table className="w-full text-left font-sans border-collapse">
                        <thead className="bg-[#212c46] text-white">
                            <tr className="border-b-2 border-[#b7a159]">
                                <th className="py-4 px-8 font-black uppercase tracking-widest text-[11px]">DISPOSAL REF</th>
                                <th className="py-4 px-6 font-black uppercase tracking-widest text-[11px]">RECORD TITLE</th>
                                <th className="py-4 px-6 font-black uppercase tracking-widest text-[11px] text-center">DEPARTMENT</th>
                                <th className="py-4 px-6 font-black uppercase tracking-widest text-[11px] text-center">METHOD</th>
                                <th className="py-4 px-6 font-black uppercase tracking-widest text-[11px] text-center">DATE</th>
                                <th className="py-4 px-6 font-black uppercase tracking-widest text-[11px] text-center">BY DCC</th>
                                <th className="py-4 px-6 font-black uppercase tracking-widest text-[11px] text-center">ACTION</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#f3f3f1]">
                            {filteredLogs.map((log, idx) => (
                                <tr key={log.id} className="hover:bg-[#f3f3f1]/40 transition-colors group">
                                    <td className="py-4 px-8">
                                       <div className="flex items-center gap-3">
                                          <div className="w-8 h-8 rounded-lg bg-[#212c46]/5 flex items-center justify-center text-[#212c46]">
                                             <FileStack size={14} />
                                          </div>
                                          <span className="font-black text-[#212c46] text-[12px] tracking-tighter">{log.id}</span>
                                       </div>
                                    </td>
                                    <td className="py-4 px-6">
                                       <div className="flex flex-col">
                                          <span className="font-black text-[#212c46] text-[13px]">{log.subject}</span>
                                          <span className="text-[10px] font-bold text-[#7a8b95] uppercase mt-0.5">{log.recordId}</span>
                                       </div>
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                       <span className="text-[11px] font-black text-[#3f809e] uppercase tracking-widest">{log.dept}</span>
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                       <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${log.method === 'Burn' ? `bg-[${THEME.danger}15] text-[${THEME.danger}] border-[${THEME.danger}20]` : `bg-[${THEME.primary}05] text-[${THEME.primary}] border-[${THEME.primary}10]`}`}>
                                          {log.method}
                                       </span>
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                       <span className="text-[12px] font-bold text-[#212c46]">{log.date}</span>
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                       <div className="flex items-center justify-center gap-2">
                                          <div className="w-6 h-6 rounded-full bg-[#f3f3f1] border border-[#eaeaec] flex items-center justify-center text-[10px] font-black text-[#7a8b95] uppercase">
                                             {log.dccBy.charAt(0)}
                                          </div>
                                          <span className="text-[11px] font-bold text-[#212c46]">{log.dccBy}</span>
                                       </div>
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                       <button className="p-2 text-[#7a8b95] hover:text-[#212c46] hover:bg-white rounded-lg transition-all shadow-sm">
                                          <Printer size={16} />
                                       </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                    {/* PAGINATION */}
                    <div className="px-8 py-4 bg-[#f3f3f1] border-t border-[#f3f3f1] flex justify-between items-center">
                       <p className="text-[11px] font-bold text-[#7a8b95] uppercase tracking-widest">Showing 1 - 5 of 244 entries</p>
                       <div className="flex items-center gap-2">
                          <button className="p-1.5 border border-[#eaeaec] bg-white rounded-lg text-[#7a8b95] hover:bg-[#212c46] hover:text-white transition-all"><ChevronLeft size={16}/></button>
                          <div className="px-4 py-1.5 bg-[#212c46] text-white rounded-lg font-black text-[11px]">1 / 49</div>
                          <button className="p-1.5 border border-[#eaeaec] bg-white rounded-lg text-[#7a8b95] hover:bg-[#212c46] hover:text-white transition-all"><ChevronRight size={16}/></button>
                       </div>
                    </div>
                </div>
             </div>
           ) : (
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
                <div className="lg:col-span-8 space-y-6">
                   <div className="bg-white/90 p-8 rounded-3xl border border-[#f3f3f1] shadow-lg h-[450px] flex flex-col">
                      <div className="flex justify-between items-center mb-8 border-b border-[#f3f3f1] pb-4">
                         <h4 className="font-black text-[#212c46] uppercase tracking-widest flex items-center gap-3"><Activity size={20} className="text-[#3f809e]"/> Monthly Disposal Trend</h4>
                         <span className="text-[10px] font-black text-white bg-[#3f809e] px-3 py-1 rounded-full uppercase tracking-widest">Last 6 Months</span>
                      </div>
                      <div className="flex-1 w-full">
                         <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={CHART_DATA_TREND}>
                               <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f3f1" />
                               <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#7a8b95', fontWeight: 'bold'}} />
                               <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#7a8b95', fontWeight: 'bold'}} />
                               <Tooltip 
                                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                  cursor={{fill: '#f3f3f1'}}
                               />
                               <Bar dataKey="count" fill={THEME.skyBlue} radius={[10, 10, 0, 0]} barSize={40} />
                            </BarChart>
                         </ResponsiveContainer>
                      </div>
                   </div>
                </div>

                <div className="lg:col-span-4 space-y-6">
                   <div className="bg-white/90 p-8 rounded-3xl border border-[#f3f3f1] shadow-lg h-[450px] flex flex-col items-center">
                      <div className="w-full flex justify-between items-center mb-10 border-b border-[#f3f3f1] pb-4">
                         <h4 className="font-black text-[#212c46] uppercase tracking-widest flex items-center gap-3"><Target size={20} className="text-[#a54f6b]"/> Disposal Methods</h4>
                      </div>
                      <div className="flex-1 w-full relative">
                         <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                               <Pie data={CHART_DATA_METHOD} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={5} dataKey="value">
                                  {CHART_DATA_METHOD.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                  ))}
                               </Pie>
                               <Tooltip />
                               <Legend verticalAlign="bottom" align="center" iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', paddingTop: '20px' }} />
                            </PieChart>
                         </ResponsiveContainer>
                         <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mb-10">
                            <span className="text-3xl font-black text-[#212c46]">1,244</span>
                            <span className="text-[10px] font-black text-[#7a8b95] uppercase tracking-widest">Total Purged</span>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
           )}
        </div>
      </div>
      
      {/* USER GUIDE PANEL (Simplified) */}
      {isGuideOpen && (
        <div className="fixed inset-0 z-[250] flex justify-end no-scrollbar bg-[#212c46]/60 backdrop-blur-sm animate-fadeIn" onClick={() => setIsGuideOpen(false)}>
           <div className="bg-white w-full md:w-[500px] h-full shadow-2xl flex flex-col border-l-4 border-[#b7a159] animate-fadeIn" onClick={e => e.stopPropagation()}>
              <div className="p-6 bg-[#212c46] text-white flex justify-between items-center border-b-2 border-[#b7a159]">
                 <div className="flex items-center gap-4">
                    <HelpCircle size={24} className="text-[#b7a159]" />
                    <div>
                      <h3 className="font-black text-lg tracking-widest uppercase mb-0.5">Log Book Guide</h3>
                      <p className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em]">Compliance Integrity Center</p>
                    </div>
                 </div>
                 <button onClick={() => setIsGuideOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={24}/></button>
              </div>
              <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-white custom-scrollbar text-[12px] leading-relaxed">
                 <div className="bg-[#f3f3f1] p-6 rounded-2xl border border-[#f3f3f1] shadow-sm">
                    <h4 className="font-black text-[#212c46] mb-2 uppercase tracking-tight flex items-center gap-2"><History size={16} className="text-[#3f809e]"/> Registry History</h4>
                    <p>ระบบรวบรวมประวัติการทำลายบันทึกคุณภาพทั้งหมดที่เคยเกิดขึ้นในระบบ DCC PRO ข้อมูลนี้ถือเป็นส่วนหนึ่งของ <strong className="text-[#212c46]">Internal Audit Records</strong></p>
                 </div>
              </div>
              <div className="p-6 bg-white border-t border-[#f3f3f1] flex justify-end">
                 <button onClick={() => setIsGuideOpen(false)} className="px-8 py-3 bg-[#212c46] text-white font-black rounded-2xl uppercase text-[11px] hover:bg-[#414757] transition-all shadow-md tracking-wider">Accept</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
