import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import * as Icons from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, 
  PieChart as RechartsPieChart, Pie, Cell, CartesianGrid
} from 'recharts';

// --- Theme Configuration (Synced with Home Palette & DCC PRO) ---
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

// --- MOCK DATA ---
const INITIAL_LOGS = [
  { id: 'IA-26/001', date: '2026-04-15', facility: 'Headquarters', leadAuditor: 'Mr. Somchai', standard: 'ISO 9001:2015', findings: { cri: 0, maj: 1, min: 4, ofi: 2 }, status: 'CLOSED' },
  { id: 'IA-26/002', date: '2026-04-20', facility: 'Factory A', leadAuditor: 'Ms. Suda', standard: 'FSSC 22000', findings: { cri: 0, maj: 0, min: 2, ofi: 5 }, status: 'OPEN' },
  { id: 'IA-26/003', date: '2026-05-10', facility: 'Warehouse 1', leadAuditor: 'Mr. Panya', standard: 'GHPs&HACCP', findings: { cri: 1, maj: 2, min: 3, ofi: 1 }, status: 'IN PROGRESS' },
  { id: 'IA-26/004', date: '2026-05-15', facility: 'Factory B', leadAuditor: 'Mr. Wichai', standard: 'ISO 14001:2015', findings: { cri: 0, maj: 0, min: 1, ofi: 4 }, status: 'DRAFT' },
  { id: 'IA-26/005', date: '2026-06-02', facility: 'Headquarters', leadAuditor: 'Ms. Suda', standard: 'ISO 45001:2018', findings: { cri: 0, maj: 0, min: 0, ofi: 2 }, status: 'CLOSED' },
];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
const BAR_DATA = MONTHS.map(m => ({
  name: m,
  critical: Math.floor(Math.random() * 2),
  major: Math.floor(Math.random() * 3),
  minor: Math.floor(Math.random() * 10),
}));

const PIE_DATA = [
  { name: 'ISO 9001:2015', value: 3, color: THEME.skyBlue },
  { name: 'ISO 14001:2015', value: 2, color: THEME.success },
  { name: 'ISO 45001:2018', value: 1, color: THEME.gold },
  { name: 'FSSC 22000', value: 4, color: THEME.accent },
  { name: 'GHPs&HACCP', value: 2, color: THEME.primary },
];

// --- COMPONENTS ---
const StatusBadge = ({ status }: { status: string }) => {
  const styles: any = {
    'CLOSED': { bg: '#657f4d15', text: THEME.success, border: '#657f4d30', icon: Icons.CheckCircle2 },
    'OPEN': { bg: '#d9624515', text: THEME.danger, border: '#d9624530', icon: Icons.AlertCircle },
    'IN PROGRESS': { bg: '#b58c4f15', text: THEME.gold, border: '#b58c4f30', icon: Icons.Activity },
    'DRAFT': { bg: '#7a8b9515', text: THEME.dustyBlue, border: '#7a8b9530', icon: Icons.Edit3 },
  };
  const config = styles[status] || styles['DRAFT'];
  const Icon = config.icon;
  return (
    <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 border shadow-sm w-[110px]" style={{ backgroundColor: config.bg, color: config.text, borderColor: config.border }}>
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
            <h3 className="font-black flex items-center gap-3 uppercase tracking-widest text-lg"><Icons.BookOpen size={22} className="text-[#b7a159]"/> REPORT LOG GUIDE</h3>
            <p className="text-[12px] font-bold text-[#d7d7d7] uppercase tracking-widest mt-1.5">Summary Report Management</p>
          </div>
          <button onClick={onClose} className="p-2 text-white/50 hover:text-[#932c2e] hover:bg-white/10 rounded-xl transition-colors"><Icons.X size={24}/></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-8 space-y-8 text-[#414757] text-[12px] leading-relaxed custom-scrollbar bg-white">
          <section className="animate-fadeIn">
            <h4 className="text-[14px] font-black text-[#212c46] mb-3 uppercase flex items-center gap-2 border-b-2 border-[#d7d7d7] pb-2 font-mono">
              <Icons.LayoutDashboard size={18} className="text-[#b7a159]"/> 1. Dashboard Overview
            </h4>
            <p className="text-[12px] mb-3">หน้า Dashboard แสดงสรุปสถิติและสถานะของรายงานการตรวจประเมินภายในทั้งหมด:</p>
            <ul className="list-none pl-0 space-y-3">
                <li className="flex items-start gap-2 bg-[#f8f9fa] p-3 rounded-xl border border-[#eaeaec]">
                  <Icons.PieChart size={16} className="shrink-0 text-[#4d87a8] mt-0.5"/> 
                  <div><strong className="text-[#4d87a8]">Analytics:</strong> การวิเคราะห์สัดส่วนของมาตรฐานที่ใช้ตรวจสอบ และระดับความรุนแรงของข้อบกพร่อง (NCs)</div>
                </li>
            </ul>
          </section>
          
          <section className="animate-fadeIn" style={{ animationDelay: '0.1s' }}>
            <h4 className="text-[14px] font-black text-[#212c46] mb-3 uppercase flex items-center gap-2 border-b-2 border-[#d7d7d7] pb-2 font-mono">
              <Icons.List size={18} className="text-[#d96245]"/> 2. Report Log Registry
            </h4>
            <p className="text-[12px] mb-3">หน้ารายการสำหรับค้นหา, คัดกรอง, และติดตามสถานะของแต่ละรายงาน:</p>
            <ul className="list-disc pl-5 mt-2 space-y-2 text-[12px]">
                <li><strong className="text-[#4d87a8]">Date Range Filter:</strong> สามารถกรองข้อมูลตามช่วงเวลาของการตรวจได้</li>
                <li><strong className="text-[#212c46]">Status Tracking:</strong> ติดตามกระบวนการตั้งแต่ Draft, In Progress, Open ไปจนถึง Closed</li>
                <li><strong className="text-[#657f4d]">Export:</strong> รองรับการพิมพ์ตารางและการส่งออกรายงานเป็นรูปแบบ Excel/PDF</li>
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

export default function SummaryReportLog() {
  const [activeTab, setActiveTab] = useState('dashboard'); 
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // New States for functional buttons
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isNewReportOpen, setIsNewReportOpen] = useState(false);
  const [viewReportId, setViewReportId] = useState<string | null>(null);
  const [editReportId, setEditReportId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredLogs = useMemo(() => {
    return INITIAL_LOGS.filter(l => 
      l.id.toLowerCase().includes(search.toLowerCase()) || 
      l.leadAuditor.toLowerCase().includes(search.toLowerCase()) ||
      l.facility.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const currentData = filteredLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage) || 1;

  return (
    <div className="flex flex-1 w-full font-sans flex-col pb-0 animate-fadeIn bg-transparent relative">
      <style dangerouslySetInnerHTML={{__html: globalStyles}} />
      
      {/* TOAST */}
      {toastMessage && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[300] bg-[#212c46] text-white px-6 py-3 rounded-full font-black text-[12px] uppercase tracking-widest shadow-2xl flex items-center gap-3 animate-fadeIn">
            <Icons.CheckCircle2 size={18} className="text-[#b7a159]"/>
            {toastMessage}
        </div>
      )}

      {/* MODALS */}
      {(isNewReportOpen || viewReportId || editReportId || isFilterOpen) && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-[#212c46]/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-[#eaeaec] flex flex-col">
                <div className="px-6 py-4 border-b border-[#eaeaec] bg-[#f8f9fa] flex justify-between items-center">
                    <h3 className="font-black text-[#212c46] uppercase tracking-widest text-[14px] flex items-center gap-2">
                        {isFilterOpen ? <><Icons.Filter size={18} className="text-[#3f809e]"/> Filter Records</> :
                         isNewReportOpen ? <><Icons.FilePlus size={18} className="text-[#success]"/> Create New Report</> :
                         viewReportId ? <><Icons.Eye size={18} className="text-[#b58c4f]"/> View Report Details</> :
                         <><Icons.Edit3 size={18} className="text-[#a94228]"/> Edit Report Details</>}
                    </h3>
                    <button onClick={() => { setIsFilterOpen(false); setIsNewReportOpen(false); setViewReportId(null); setEditReportId(null); }} className="text-[#7a8b95] hover:text-[#932c2e] transition-colors"><Icons.X size={20}/></button>
                </div>
                <div className="p-8 text-[#414757] text-[12px] font-bold">
                    {isFilterOpen && <p className="text-center text-[#7a8b95] py-10">Filter form mockup. User can select date range, facility, auditor, etc.</p>}
                    {isNewReportOpen && <p className="text-center text-[#7a8b95] py-10">New report form mockup. User can input facility, date, standard, auditors.</p>}
                    {viewReportId && <p className="text-center text-[#7a8b95] py-10">Viewing details for Report: <span className="text-[#932c2e] font-black">{viewReportId}</span></p>}
                    {editReportId && <p className="text-center text-[#7a8b95] py-10">Editing details for Report: <span className="text-[#932c2e] font-black">{editReportId}</span></p>}
                </div>
                <div className="px-6 py-4 bg-[#f8f9fa] border-t border-[#eaeaec] flex justify-end gap-3">
                    <button onClick={() => { setIsFilterOpen(false); setIsNewReportOpen(false); setViewReportId(null); setEditReportId(null); }} className="px-6 py-2.5 rounded-xl font-black text-[12px] uppercase tracking-widest text-[#7a8b95] bg-white border border-[#eaeaec] shadow-sm hover:text-[#212c46] hover:border-[#b7a159] transition-all">Cancel</button>
                    {!viewReportId && (
                      <button onClick={() => { 
                          setIsFilterOpen(false); setIsNewReportOpen(false); setEditReportId(null); 
                          showToast(isFilterOpen ? "Filters Applied" : isNewReportOpen ? "Report Created Successfully" : "Changes Saved"); 
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
                  <div className="absolute inset-0 bg-[#3f809e] blur-[15px] opacity-20 rounded-full group-hover:opacity-60 transition-all duration-700"></div>
                  <div className="relative z-10 p-1.5 border border-[#3f809e]/40 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm">
                      <Icons.ClipboardList size={28} strokeWidth={2.5} className="text-[#3f809e]" />
                  </div>
              </div>
              <div>
                  <h3 className="font-black text-[#212c46] uppercase tracking-tighter leading-none" style={{ fontSize: '24px' }}>
                      SUMMARY REPORT <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3f809e] to-[#b58c4f]">LOG</span>
                  </h3>
                  <p className="text-[11px] font-bold text-[#4d5a44] uppercase tracking-[0.2em] mt-0.5 opacity-80 leading-none">
                      INTERNAL AUDIT HISTORY & TRACKING
                  </p>
              </div>
          </div>

          <div className="flex items-center gap-4">
              <div className="bg-white/50 p-1.5 rounded-xl border border-white/60 shadow-inner flex flex-wrap items-center gap-1">
                  <button onClick={() => setActiveTab('dashboard')} className={`px-6 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'dashboard' ? 'bg-[#212c46] text-white shadow-md' : 'text-[#7a8b95] hover:text-[#a94228]'}`}>
                    <Icons.LayoutDashboard size={16} /> Dashboard
                  </button>
                  <button onClick={() => setActiveTab('registry')} className={`px-6 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'registry' ? 'bg-[#212c46] text-white shadow-md' : 'text-[#7a8b95] hover:text-[#a94228]'}`}>
                    <Icons.List size={16} /> Registry Log
                  </button>
              </div>
          </div>
      </div>

      <div className="px-8 mt-2 pb-6 max-w-[1500px] w-full mx-auto">
        {activeTab === 'dashboard' ? (
          <div className="space-y-6 animate-fadeIn">
            {/* KPI STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <KpiCard label="Total Reports" value={INITIAL_LOGS.length} icon="Files" colorAccent={THEME.primaryLight} colorValue={THEME.primary} desc="Logged YTD" />
                <KpiCard label="Open/Draft" value={INITIAL_LOGS.filter(l => l.status === 'OPEN' || l.status === 'DRAFT').length} icon="FolderOpen" colorAccent={THEME.danger} colorValue={THEME.primary} desc="Requires Action" />
                <KpiCard label="Critical NCs" value={1} icon="AlertTriangle" colorAccent={THEME.danger} colorValue={THEME.danger} desc="Total Found" />
                <KpiCard label="Active Auditors" value="4" icon="Users" colorAccent={THEME.success} colorValue={THEME.primary} desc="Authorized" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-8 bg-white rounded-3xl shadow-lg border border-[#eaeaec] p-6">
                    <h3 className="text-[14px] font-black text-[#212c46] uppercase tracking-widest flex items-center gap-2 border-b border-[#eaeaec] pb-4 mb-6"><Icons.BarChart2 size={18} className="text-[#b7a159]" /> NON-CONFORMITY TREND (H1 2026)</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={BAR_DATA} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b', fontWeight: 'bold'}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b', fontWeight: 'bold'}} />
                                <RechartsTooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                                <Bar dataKey="critical" stackId="a" fill={THEME.danger} radius={[0, 0, 4, 4]} barSize={40} />
                                <Bar dataKey="major" stackId="a" fill={THEME.accent} />
                                <Bar dataKey="minor" stackId="a" fill={THEME.gold} radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                
                <div className="lg:col-span-4 bg-white rounded-3xl shadow-lg border border-[#eaeaec] p-6">
                    <h3 className="text-[14px] font-black text-[#212c46] uppercase tracking-widest flex items-center gap-2 border-b border-[#eaeaec] pb-4 mb-6"><Icons.PieChart size={18} className="text-[#b7a159]" /> REPORTS BY STANDARD</h3>
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
                      <button onClick={() => showToast('Exporting to Excel...')} className="bg-white border border-[#eaeaec] text-[#212c46] px-5 py-2 rounded-xl font-black uppercase text-[12px] shadow-sm hover:border-[#b7a159] transition-all flex items-center gap-2">
                        <Icons.Download size={14} /> EXPORT
                      </button>
                  </div>
                  <div className="flex items-center gap-3 w-full md:w-auto">
                      <div className="relative flex-1 md:w-80">
                          <Icons.Search size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-[#7a8b95]" />
                          <input type="text" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search ID, Auditor, Facility..." className="w-full pl-12 pr-6 py-2.5 text-[12px] border border-[#eaeaec] rounded-xl font-bold outline-none focus:border-[#b7a159] bg-white shadow-sm text-[#212c46]" />
                      </div>
                      <button onClick={() => setIsNewReportOpen(true)} className="bg-[#212c46] text-white px-6 py-2.5 rounded-xl font-black text-[12px] uppercase tracking-widest shadow-md hover:bg-[#414757] hover:text-white transition-all flex items-center gap-2 shrink-0 border border-[#212c46]">
                          <Icons.Plus size={16} /> NEW REPORT
                      </button>
                  </div>
              </div>

              <div className="overflow-auto custom-scrollbar flex-1">
                  <table className="w-full text-left font-sans border-collapse min-w-[1000px]">
                      <thead className="bg-[#1d2636] text-white sticky top-0 z-10">
                          <tr className="border-b-[3px] border-[#b7a159]">
                              <th className="py-4 px-6 font-black uppercase tracking-widest text-[11px] whitespace-nowrap">Report ID</th>
                              <th className="py-4 px-6 font-black uppercase tracking-widest text-[11px] whitespace-nowrap">Date</th>
                              <th className="py-4 px-6 font-black uppercase tracking-widest text-[11px] whitespace-nowrap">Standard / Criteria</th>
                              <th className="py-4 px-6 font-black uppercase tracking-widest text-[11px] whitespace-nowrap">Facility</th>
                              <th className="py-4 px-6 font-black uppercase tracking-widest text-[11px] whitespace-nowrap">Lead Auditor</th>
                              <th className="py-4 px-6 font-black uppercase tracking-widest text-[11px] text-center">NCs (Cri/Maj/Min)</th>
                              <th className="py-4 px-6 font-black uppercase tracking-widest text-[11px] text-center">Status</th>
                              <th className="py-4 px-6 font-black uppercase tracking-widest text-[11px] text-center">Action</th>
                          </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-[#eaeaec]">
                          {currentData.map((log, i) => (
                              <tr key={i} className="hover:bg-[#f8f9fa] transition-colors group">
                                  <td className="py-3 px-6 font-black text-[#932c2e] uppercase tracking-tight text-[12px]">
                                      <div className="flex items-center gap-2">
                                          <Icons.FileText size={14} className="text-[#a54f6b]" />
                                          {log.id}
                                      </div>
                                  </td>
                                  <td className="py-3 px-6 font-bold text-[#4d87a8] uppercase text-[12px]">{log.date}</td>
                                  <td className="py-3 px-6 font-black text-[#212c46] text-[12px]">{log.standard}</td>
                                  <td className="py-3 px-6 font-bold text-[#7a8b95] text-[12px] uppercase">{log.facility}</td>
                                  <td className="py-3 px-6 font-bold text-[#414757] text-[12px] uppercase">{log.leadAuditor}</td>
                                  <td className="py-3 px-6 text-center text-[12px] font-mono font-black">
                                      <span className="text-[#932c2e]">{log.findings.cri}</span> / <span className="text-[#a94228]">{log.findings.maj}</span> / <span className="text-[#b58c4f]">{log.findings.min}</span>
                                  </td>
                                  <td className="py-3 px-6 text-center flex justify-center">
                                      <StatusBadge status={log.status} />
                                  </td>
                                  <td className="py-3 px-6 text-center">
                                      <div className="flex justify-center items-center gap-[4px]">
                                          <button onClick={() => setViewReportId(log.id)} className="w-8 h-8 flex items-center justify-center rounded-lg text-[#212c46] border border-[#eaeaec] bg-white hover:bg-[#212c46] hover:text-white transition-all shadow-sm">
                                              <Icons.Eye size={14} />
                                          </button>
                                          <button onClick={() => setEditReportId(log.id)} className="w-8 h-8 flex items-center justify-center rounded-lg text-[#212c46] border border-[#eaeaec] bg-white hover:bg-[#3f809e] hover:text-white hover:border-[#3f809e] shadow-sm transition-all">
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
