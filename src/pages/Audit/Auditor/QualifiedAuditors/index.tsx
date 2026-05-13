import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, Plus, Download, Filter, ChevronLeft, ChevronRight, 
  CheckCircle2, Clock, AlertCircle, HelpCircle, X,
  ShieldCheck, Users, GraduationCap, Award, Briefcase,
  Pencil, Trash2, Save, ChevronDown, Activity, Target, CalendarDays,
  LayoutDashboard, List, BarChart3, PieChart as PieChartIcon, TrendingUp, Globe
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';
import { createPortal } from 'react-dom';

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700;800&family=Noto+Sans+Thai:wght@300;400;500;600;700;800&display=swap');

  :root {
    --font-mixed: 'JetBrains Mono', 'Noto Sans Thai', sans-serif;
  }

  .auditor-page * { 
    font-family: var(--font-mixed) !important; 
  }

  .auditor-page .custom-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; }
  .auditor-page .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
  .auditor-page .custom-scrollbar::-webkit-scrollbar-thumb { background: #7a8b95; border-radius: 10px; }
  .auditor-page .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #414757; }
  
  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  .auditor-page .animate-fade { animation: fadeIn 0.4s ease-out forwards; }
  @keyframes slideDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
  .auditor-page .animate-slide-down { animation: slideDown 0.3s ease-out forwards; }

  /* Table Header - py-4 strictly */
  .auditor-page .sticky-header th { 
    position: sticky; 
    top: 0; 
    z-index: 40; 
    background-color: #212c46 !important;
    border-bottom: 3px solid #b7a159 !important;
    color: white !important;
    padding: 1rem !important; /* py-4 equivalent */
    white-space: nowrap !important;
  }
`;

const INITIAL_AUDITORS = [
  { id: 'AUD-001', name: 'สมชาย ใจดี (Somchai J.)', dept: 'Management', role: 'Lead Auditor', standards: ['ISO 9001:2015', 'ISO 14001:2015'], trainedDate: '2023-05-10', expiryDate: '2026-05-09', status: 'Active' },
  { id: 'AUD-002', name: 'วิชัย รักงาน (Wichai R.)', dept: 'QA/QC', role: 'Internal Auditor', standards: ['ISO 9001:2015'], trainedDate: '2024-01-15', expiryDate: '2027-01-14', status: 'Active' },
  { id: 'AUD-003', name: 'สุดา มานะ (Suda M.)', dept: 'QA/QC', role: 'Lead Auditor', standards: ['ISO 9001:2015', 'FSSC 22000'], trainedDate: '2022-11-20', expiryDate: '2025-11-19', status: 'Active' },
  { id: 'AUD-004', name: 'สมเกียรติ พากเพียร (Somkiat P.)', dept: 'Production', role: 'Internal Auditor', standards: ['ISO 9001:2015'], trainedDate: '2023-02-10', expiryDate: '2026-02-09', status: 'Active' },
  { id: 'AUD-005', name: 'อมรา เก่งกิจ (Amara K.)', dept: 'Purchasing', role: 'Internal Auditor', standards: ['ISO 9001:2015'], trainedDate: '2021-08-05', expiryDate: '2024-08-04', status: 'Expired' },
  { id: 'AUD-006', name: 'ณรงค์ สมบัติ (Narong S.)', dept: 'Engineering', role: 'Trainee/Observer', standards: ['ISO 9001:2015'], trainedDate: '2025-03-01', expiryDate: '2026-03-01', status: 'Active' },
  { id: 'AUD-007', name: 'อารี รักษ์โลก (Aree R.)', dept: 'HR', role: 'Internal Auditor', standards: ['ISO 9001:2015', 'ISO 45001:2018'], trainedDate: '2023-04-20', expiryDate: '2026-04-19', status: 'Active' },
  { id: 'AUD-008', name: 'ธวัชชัย แสนดี (Tawatchai S.)', dept: 'Warehouse', role: 'Internal Auditor', standards: ['ISO 9001:2015'], trainedDate: '2022-06-15', expiryDate: '2025-06-14', status: 'Expiring Soon' },
];

const DEPTS = ['Management', 'Production', 'QA/QC', 'Purchasing', 'Sales', 'HR', 'Engineering', 'Warehouse'];
const ROLES = ['ALL', 'Lead Auditor', 'Internal Auditor', 'Trainee/Observer'];
const AVAILABLE_STANDARDS = ['ISO 9001:2015', 'ISO 14001:2015', 'ISO 45001:2018', 'FSSC 22000', 'GHPs&HACCP'];

const STANDARD_COLORS: any = {
  'ISO 9001:2015': 'bg-[#3f809e]/10 text-[#3f809e] border-[#3f809e]/30',
  'ISO 14001:2015': 'bg-[#657f4d]/10 text-[#657f4d] border-[#657f4d]/30',
  'ISO 45001:2018': 'bg-[#d96245]/10 text-[#d96245] border-[#d96245]/30',
  'FSSC 22000': 'bg-[#ab7d82]/10 text-[#ab7d82] border-[#ab7d82]/30',
  'GHPs&HACCP': 'bg-[#748b9e]/10 text-[#748b9e] border-[#748b9e]/30',
};

const RoleBadge = ({ role }: { role: string }) => {
  const styles: any = {
    'Lead Auditor': 'bg-[#4d87a8] text-white border-[#4d87a8]', 
    'Internal Auditor': 'bg-[#7a8b95]/10 text-[#212c46] border-[#7a8b95]/30',
    'Trainee/Observer': 'bg-[#f3f3f1] text-[#414757] border-[#7a8b95]/30'
  };
  const icons: any = {
    'Lead Auditor': <Award size={12} />,
    'Internal Auditor': <ShieldCheck size={12} />,
    'Trainee/Observer': <GraduationCap size={12} />
  };
  return (
    <span className={`px-2.5 py-1 rounded border text-[11px] font-black uppercase tracking-widest flex items-center gap-1.5 w-max font-mono shadow-sm ${styles[role] || styles['Internal Auditor']}`}>
      {icons[role]} {role}
    </span>
  );
};

const StandardChip: React.FC<{ std: string }> = ({ std }) => (
  <span className={`px-2 py-0.5 border rounded text-[11px] font-black font-mono shadow-sm whitespace-nowrap ${STANDARD_COLORS[std] || 'bg-[#f3f3f1] text-[#414757] border-[#f3f3f1]'}`}>
    {std}
  </span>
);

const StatusBadge = ({ status }: { status: string }) => {
  const styles: any = {
    'Active': 'bg-[#657f4d]/10 text-[#657f4d] border-[#657f4d]/30',
    'Expiring Soon': 'bg-[#b7a159]/10 text-[#b7a159] border-[#b7a159]/30',
    'Expired': 'bg-[#932c2e]/10 text-[#932c2e] border-[#932c2e]/30'
  };
  const icons: any = {
    'Active': <CheckCircle2 size={12} />,
    'Expiring Soon': <Clock size={12} />,
    'Expired': <AlertCircle size={12} />
  };
  return (
    <span className={`px-2.5 py-1 rounded-full border text-[11px] font-black uppercase tracking-widest flex items-center gap-1 w-max font-mono ${styles[status]}`}>
      {icons[status]} {status}
    </span>
  );
};

const UserGuideDrawer = ({ isOpen, onClose }: any) => {
  if (typeof document === 'undefined') return null;
  return createPortal(
    <>
      <div className={`fixed inset-0 bg-[#212c46]/60 backdrop-blur-sm z-[200] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose}></div>
      <div className={`fixed top-0 right-0 h-full w-full max-w-[450px] bg-white shadow-[-10px_0_30px_rgba(0,0,0,0.2)] z-[210] transform transition-transform duration-300 ease-in-out flex flex-col border-l-2 border-[#b7a159] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-between items-center p-6 border-b-2 border-[#b7a159] bg-[#212c46] text-white shrink-0 shadow-md z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg"><HelpCircle size={20} className="text-[#b7a159]"/></div>
            <div>
              <h3 className="font-black uppercase tracking-widest font-mono text-[13px]">AUDITOR DIRECTORY GUIDE</h3>
              <p className="text-[10px] text-[#7a8b95] font-mono tracking-wider mt-0.5">คู่มือการจัดการทะเบียนผู้ตรวจประเมิน</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-white/50 hover:text-[#932c2e] hover:bg-white/10 rounded-full transition-colors"><X size={20}/></button>
        </div>
        <div className="p-8 overflow-y-auto flex-1 custom-scrollbar text-[#414757] leading-relaxed space-y-6 bg-white">
          <div className="bg-[#f3f3f1] p-5 rounded-2xl border border-[#eaeaec] shadow-sm">
            <h4 className="text-[11px] font-black text-[#212c46] mb-2 uppercase tracking-widest flex items-center gap-2 font-mono"><Target size={16} className="text-[#b7a159]"/> Competency Matrix</h4>
            <p className="text-[12px]">ระบบนี้มีไว้เพื่อควบคุมรายชื่อผู้ตรวจประเมิน (Qualified Auditors) ที่ผ่านคุณสมบัติตามมาตรฐาน ISO ขององค์กร</p>
          </div>
          <div className="space-y-3">
            <h4 className="text-[11px] font-black text-[#7a8b95] uppercase tracking-widest font-mono pl-1">Key Features</h4>
            <div className="bg-white p-4 rounded-xl border border-[#eaeaec] shadow-sm space-y-4">
               <div className="flex gap-4">
                  <div className="p-2 bg-[#212c46]/10 rounded-lg text-[#212c46] shrink-0"><BarChart3 size={18}/></div>
                  <div><h5 className="font-black text-[#212c46] text-[11px] uppercase">ANALYTICS DASHBOARD</h5><p className="text-[11px]">แสดงสถิติความพร้อมของทีม Auditor แยกตามมาตรฐานและแผนก</p></div>
               </div>
               <div className="flex gap-4">
                  <div className="p-2 bg-[#932c2e]/10 rounded-lg text-[#932c2e] shrink-0"><Clock size={18}/></div>
                  <div><h5 className="font-black text-[#212c46] text-[11px] uppercase">EXPIRY TRACKING</h5><p className="text-[11px]">แจ้งเตือนสถานะใบเซอร์ใกล้หมดอายุเพื่อวางแผน Re-training</p></div>
               </div>
            </div>
          </div>
        </div>
        <div className="p-6 bg-[#f3f3f1] border-t border-[#eaeaec] flex justify-end shrink-0 z-10">
          <button onClick={onClose} className="px-8 py-3 bg-[#212c46] text-white font-black rounded-xl uppercase font-mono text-[11px] hover:bg-[#a94228] shadow-md transition-all w-full sm:w-auto">เข้าใจแล้ว (Got it)</button>
        </div>
      </div>
    </>, document.body
  );
};

const DashboardView = ({ data }: { data: any[] }) => {
  const deptData = DEPTS.map(d => ({
    name: d,
    count: data.filter(a => a.dept === d).length
  })).filter(d => d.count > 0);

  const roleData = ROLES.filter(r => r !== 'ALL').map(r => ({
    name: r,
    value: data.filter(a => a.role === r).length,
    color: r === 'Lead Auditor' ? '#4d87a8' : r === 'Internal Auditor' ? '#748b9e' : '#abb7bf'
  }));

  const standardStats = AVAILABLE_STANDARDS.map(std => ({
    name: std,
    count: data.filter(a => a.standards.includes(std)).length
  }));

  return (
    <div className="space-y-8 animate-fade pb-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
         <div className="bg-white rounded-3xl p-8 border border-[#eaeaec] shadow-sm flex flex-col h-[400px]">
            <h4 className="text-sm font-black text-[#212c46] uppercase tracking-widest mb-6 flex items-center gap-2 font-mono"><Users size={18} className="text-[#b7a159]"/> Auditors by Department</h4>
            <div className="flex-1 w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={deptData} layout="vertical" margin={{ left: 20 }}>
                     <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                     <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                     <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} width={100}/>
                     <RechartsTooltip cursor={{fill: '#f3f3f1'}} />
                     <Bar dataKey="count" fill="#4d87a8" radius={[0, 4, 4, 0]} barSize={24} />
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </div>
         <div className="bg-white rounded-3xl p-8 border border-[#eaeaec] shadow-sm flex flex-col h-[400px]">
            <h4 className="text-sm font-black text-[#212c46] uppercase tracking-widest mb-6 flex items-center gap-2 font-mono"><Award size={18} className="text-[#b7a159]"/> Auditor Role Breakdown</h4>
            <div className="flex-1">
               <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={roleData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={5} dataKey="value">
                      {roleData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                    </Pie>
                    <RechartsTooltip />
                    <Legend iconType="circle" />
                  </PieChart>
               </ResponsiveContainer>
            </div>
         </div>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-[#eaeaec] shadow-sm">
        <h4 className="text-sm font-black text-[#212c46] uppercase tracking-widest mb-6 flex items-center gap-2 font-mono"><ShieldCheck size={18} className="text-[#b7a159]"/> Standards Certified Coverage</h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
           {standardStats.map(s => (
             <div key={s.name} className="p-6 bg-[#f8f9fa] rounded-2xl border border-[#eaeaec] flex flex-col items-center text-center">
                <span className="text-[10px] font-black text-[#7a8b95] uppercase mb-2 h-8 flex items-center">{s.name}</span>
                <span className="text-3xl font-black text-[#212c46] font-mono">{s.count}</span>
                <span className="text-[9px] font-bold text-[#b7a159] mt-1 uppercase tracking-widest">Qualified</span>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default function QualifiedAuditors() {
  const [data, setData] = useState(INITIAL_AUDITORS);
  const [search, setSearch] = useState('');
  const [activeStandard, setActiveStandard] = useState('ALL'); 
  const [activeRole, setActiveRole] = useState('ALL');
  const [activeMainTab, setActiveMainTab] = useState('directory'); 
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [modal, setModal] = useState<any>({ isOpen: false, isNew: false, item: null });

  useEffect(() => {
    const today = new Date();
    const updatedData = INITIAL_AUDITORS.map(auditor => {
      const expDate = new Date(auditor.expiryDate);
      const diffTime = expDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      let status = 'Active';
      if (diffDays <= 0) status = 'Expired';
      else if (diffDays <= 90) status = 'Expiring Soon';
      return { ...auditor, status };
    });
    setData(updatedData);
  }, []);

  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.id.toLowerCase().includes(search.toLowerCase());
      const matchStandard = activeStandard === 'ALL' || item.standards.includes(activeStandard);
      const matchRole = activeRole === 'ALL' || item.role === activeRole;
      return matchSearch && matchStandard && matchRole;
    });
  }, [data, search, activeStandard, activeRole]);

  const currentData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const kpis = useMemo(() => ({
    total: data.length,
    lead: data.filter(d => d.role === 'Lead Auditor').length,
    active: data.filter(d => d.status === 'Active').length,
    warning: data.filter(d => d.status === 'Expiring Soon' || d.status === 'Expired').length
  }), [data]);

  const handleOpenModal = (item: any = null) => {
    setModal({
      isOpen: true,
      isNew: !item,
      item: item || { id: '', name: '', dept: 'QA/QC', role: 'Internal Auditor', standards: ['ISO 9001:2015'], trainedDate: '', expiryDate: '' }
    });
  };

  const handleSave = (e: any) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const newItem = {
      id: fd.get('id') as string,
      name: fd.get('name') as string,
      dept: fd.get('dept') as string,
      role: fd.get('role') as string,
      standards: fd.getAll('standards') as string[],
      trainedDate: fd.get('trainedDate') as string,
      expiryDate: fd.get('expiryDate') as string,
      status: 'Active'
    };
    if (modal.isNew) setData([...data, newItem]);
    else setData(data.map(d => d.id === modal.item.id ? { ...newItem, status: d.status } : d));
    setModal({ isOpen: false, isNew: false, item: null });
  };

  return (
    <div className="auditor-page flex flex-col h-full w-full bg-transparent overflow-x-hidden relative">
      <style dangerouslySetInnerHTML={{__html: globalStyles}} />
      
      {/* User Guide Trigger */}
      <button onClick={() => setIsGuideOpen(true)} className="fixed right-0 top-[220px] -translate-y-1/2 bg-[#f8f9fa] border border-[#eaeaec] border-r-0 text-[#212c46] py-8 px-1.5 rounded-l-xl shadow-md hover:bg-[#932c2e] hover:text-white hover:border-[#932c2e] transition-all duration-500 z-[100] flex flex-col items-center gap-4 group">
        <HelpCircle size={18} className="shrink-0 group-hover:rotate-12 transition-transform text-[#7a8b95] group-hover:text-white" />
        <span className="font-extrabold tracking-[0.3em] [writing-mode:vertical-rl] rotate-180 whitespace-nowrap uppercase font-mono text-[11px]">USER GUIDE</span>
      </button>
      <UserGuideDrawer isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />

      {/* HEADER SECTION (Like User Permissions) */}
      <div className="px-8 pt-6 pb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0 z-20 animate-fade">
        <div className="flex items-center gap-5">
            <div className="relative flex items-center justify-center group cursor-default shrink-0">
                <div className="absolute inset-0 bg-[#3f809e] blur-[15px] opacity-20 rounded-full group-hover:opacity-60 transition-all duration-700"></div>
                <div className="relative z-10 p-1.5 border border-[#3f809e]/40 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm">
                    <ShieldCheck size={28} strokeWidth={2.5} className="text-[#3f809e]" />
                </div>
            </div>
            <div>
                <h3 className="font-black text-[#212c46] uppercase tracking-tighter leading-none" style={{ fontSize: '24px' }}>
                    QUALIFIED <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3f809e] to-[#b58c4f]">AUDITORS</span>
                </h3>
                <p className="text-[11px] font-bold text-[#4d5a44] uppercase tracking-[0.2em] mt-0.5 opacity-80 leading-none">
                    ISO AUDITOR COMPETENCY & CERTIFICATION
                </p>
            </div>
        </div>
        
        <div className="bg-white/50 p-1.5 rounded-xl border border-white/60 shadow-inner inline-flex items-center gap-1 backdrop-blur-sm">
           <button 
              onClick={() => setActiveMainTab('directory')}
              className={`px-6 py-2.5 rounded-lg font-black uppercase tracking-widest flex items-center gap-2 transition-all duration-300 font-mono text-[12px] ${
                activeMainTab === 'directory' ? 'bg-[#212c46] text-white shadow-md' : 'text-[#7a8b95] hover:text-[#a94228]'
              }`}
           >
              <List size={14}/> Directory
           </button>
           <button 
              onClick={() => setActiveMainTab('dashboard')}
              className={`px-6 py-2.5 rounded-lg font-black uppercase tracking-widest flex items-center gap-2 transition-all duration-300 font-mono text-[12px] ${
                activeMainTab === 'dashboard' ? 'bg-[#212c46] text-white shadow-md' : 'text-[#7a8b95] hover:text-[#a94228]'
              }`}
           >
              <LayoutDashboard size={14}/> Analytics
           </button>
        </div>
      </div>

      <main className="flex-1 w-full max-w-[1600px] mx-auto px-8 pb-10 flex flex-col min-h-0 animate-fade">
        
        {/* KPI Summary Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 mt-2">
          {[
            { label: 'Total Auditors', val: kpis.total, icon: Users, color: '#3f809e' },
            { label: 'Lead Auditors', val: kpis.lead, icon: Award, color: '#b7a159' },
            { label: 'Active Status', val: kpis.active, icon: ShieldCheck, color: '#657f4d' },
            { label: 'Attention Required', val: kpis.warning, icon: AlertCircle, color: '#932c2e' }
          ].map((kpi, idx) => (
            <div key={idx} className="bg-white/90 p-6 rounded-2xl shadow-sm border border-[#eaeaec] flex flex-col justify-between h-[120px] hover:border-[#b7a159] transition-all duration-300 relative overflow-hidden group cursor-default">
               <div className="absolute -right-4 -bottom-6 opacity-[0.05] group-hover:scale-110 transition-transform duration-700 pointer-events-none">
                 <kpi.icon size={110} color={kpi.color} />
               </div>
               <div className="flex justify-between items-start z-10 w-full relative">
                 <span className="text-[11px] font-bold text-[#7a8b95] uppercase tracking-[0.1em] drop-shadow-sm font-mono">{kpi.label}</span>
                 <div className="w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 shadow-sm transition-all group-hover:rotate-6" style={{backgroundColor: kpi.color+'15', borderColor: kpi.color+'25', color: kpi.color}}>
                   <kpi.icon size={20} strokeWidth={2.5}/>
                 </div>
               </div>
               <div className="z-10 mt-2 flex items-end justify-between relative">
                  <span className="text-[28px] font-black font-mono tracking-tighter text-[#212c46] leading-none" style={{color: kpi.color}}>{kpi.val}</span>
                  <span className="text-[11px] font-bold text-[#4d87a8] uppercase tracking-widest flex items-center gap-1 font-mono">
                     <Activity size={12}/> Active
                  </span>
               </div>
            </div>
          ))}
        </div>

        {activeMainTab === 'directory' ? (
          <div className="bg-white/90 border border-[#eaeaec] shadow-sm rounded-2xl overflow-hidden flex flex-col">
            {/* Toolbar */}
            <div className="p-4 bg-white flex flex-col md:flex-row justify-between items-center gap-4 shrink-0 border-b border-[#eaeaec]">
               <div className="flex flex-wrap items-center gap-3">
                  <div className="relative flex items-center bg-[#f8f9fa] px-4 py-2 rounded-xl border border-[#eaeaec] transition-colors hover:bg-white shadow-sm">
                    <Globe size={14} className="text-[#4d87a8] mr-2"/>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#7a8b95]">Standard:</span>
                    <span className="mx-2 text-[#eaeaec]">|</span>
                    <select 
                      value={activeStandard} 
                      onChange={(e)=>setActiveStandard(e.target.value)} 
                      className="appearance-none bg-transparent font-black text-[#212c46] outline-none cursor-pointer text-[11px] pr-8"
                    >
                      <option value="ALL">ALL ({data.length})</option>
                      {AVAILABLE_STANDARDS.map(std => {
                        const count = data.filter(a => a.standards.includes(std)).length;
                        return <option key={std} value={std}>{std} ({count})</option>;
                      })}
                    </select>
                    <ChevronDown size={14} className="text-[#212c46] absolute right-4 pointer-events-none" />
                  </div>
                  <div className="relative w-full md:w-64">
                     <Search className="absolute left-3 top-2.5 text-[#7a8b95]" size={16}/>
                     <input type="text" placeholder="Search by name or ID..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 pr-4 py-2 bg-[#f8f9fa] border border-[#eaeaec] rounded-xl w-full focus:outline-none focus:border-[#b7a159] font-bold text-[12px] shadow-sm transition-all"/>
                  </div>
               </div>
               
               <div className="flex items-center gap-3 w-full md:w-auto">
                  <button className="px-5 py-2.5 bg-white border border-[#eaeaec] rounded-xl font-black text-[#414757] shadow-sm hover:bg-[#f8f9fa] transition-all flex items-center gap-2 uppercase text-[10px] font-mono">
                     <Download size={14}/> Export CSV
                  </button>
                  <button onClick={() => handleOpenModal()} className="px-6 py-2.5 bg-[#932c2e] text-white rounded-xl font-black shadow-md hover:bg-[#851c24] transition-all flex items-center gap-2 uppercase text-[10px] font-mono tracking-widest">
                     <Plus size={14}/> REGISTER NEW
                  </button>
               </div>
            </div>

            {/* Table Area */}
            <div className="w-full overflow-x-auto relative bg-white pb-4">
              <table className="w-full text-left border-collapse min-w-[1200px]">
                <thead className="sticky-header">
                  <tr className="font-mono text-[11px] uppercase tracking-widest">
                    <th className="py-4 px-6">Auditor Info</th>
                    <th className="py-4 px-4 text-center">Department</th>
                    <th className="py-4 px-4 text-center">Role / Level</th>
                    <th className="py-4 px-4 text-center">Certified Standards</th>
                    <th className="py-4 px-4 text-center">Expiry Date</th>
                    <th className="py-4 px-4 text-center">Status</th>
                    <th className="py-4 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eaeaec]">
                  {currentData.length > 0 ? currentData.map((item) => (
                    <tr key={item.id} className="hover:bg-[#f8f9fa] transition-colors group h-16">
                      <td className="py-4 px-6 align-middle">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl overflow-hidden border border-[#eaeaec] shrink-0 shadow-sm">
                            <img src={`https://i.pravatar.cc/150?u=${item.id}`} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <span className="font-extrabold text-[#932c2e] font-mono text-[12px] leading-none">{item.id}</span>
                            <span className="font-bold text-[#212c46] text-[12px] mt-1">{item.name}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 align-middle text-center font-extrabold text-[#748b9e] uppercase tracking-wider font-mono">{item.dept}</td>
                      <td className="py-4 px-4 align-middle text-center"><div className="flex justify-center"><RoleBadge role={item.role} /></div></td>
                      <td className="py-4 px-4 align-middle text-center">
                         <div className="flex flex-wrap justify-center gap-1.5">
                           {item.standards.map((std: string, idx: number) => (
                             <StandardChip key={idx} std={std} />
                           ))}
                         </div>
                      </td>
                      <td className="py-4 px-4 align-middle text-center">
                        <div className="flex flex-col items-center justify-center leading-none">
                           <span className={`font-black font-mono text-[12px] ${item.status === 'Expired' ? 'text-[#932c2e]' : item.status === 'Expiring Soon' ? 'text-[#b58c4f]' : 'text-[#212c46]'}`}>{item.expiryDate}</span>
                           <span className="text-[9px] text-[#7a8b95] font-bold font-mono tracking-widest mt-1.5 uppercase whitespace-nowrap">Trained: {item.trainedDate}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 align-middle text-center"><div className="flex justify-center"><StatusBadge status={item.status} /></div></td>
                      <td className="py-4 px-4 align-middle text-center">
                         <button onClick={() => handleOpenModal(item)} className="p-1.5 text-[#7a8b95] bg-white border border-[#eaeaec] hover:bg-[#212c46] hover:text-white rounded shadow-sm transition-all"><Pencil size={14} /></button>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan={7} className="p-10 text-center font-mono text-[#7a8b95] italic">No auditors found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="shrink-0 bg-white border-t border-[#eaeaec] p-4 flex justify-between items-center text-[#7a8b95] uppercase font-mono text-[10px] font-bold">
               <div>Page {currentPage} | Showing {currentData.length} of {filteredData.length} records</div>
               <div className="flex gap-2">
                  <button onClick={() => setCurrentPage(Math.max(1, currentPage-1))} disabled={currentPage === 1} className="p-1.5 border rounded hover:bg-[#f8f9fa] disabled:opacity-50"><ChevronLeft size={14}/></button>
                  <button onClick={() => setCurrentPage(currentPage+1)} disabled={currentData.length < itemsPerPage} className="p-1.5 border rounded hover:bg-[#f8f9fa] disabled:opacity-50"><ChevronRight size={14}/></button>
               </div>
            </div>
          </div>
        ) : (
          <DashboardView data={data} />
        )}
      </main>

      {/* MODAL */}
      {modal.isOpen && (
        <div className="fixed inset-0 z-[500] flex justify-center items-center p-4">
          <div className="absolute inset-0 bg-[#212c46]/60 backdrop-blur-sm" onClick={() => setModal({...modal, isOpen: false})}></div>
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col overflow-hidden relative z-10 animate-slide-down border-2 border-[#b7a159]">
            <div className="px-6 py-4 bg-[#212c46] text-white flex justify-between items-center shrink-0 border-b-2 border-[#b7a159]">
              <div className="flex items-center gap-3">
                 <div className="p-1.5 bg-white/10 rounded-lg">
                   <Users size={18} className="text-[#b7a159]"/>
                 </div>
                 <div>
                   <h3 className="text-[13px] font-black tracking-widest uppercase font-mono leading-none">{modal.isNew ? 'Register New Auditor' : 'Edit Auditor Info'}</h3>
                   <p className="text-[10px] font-bold text-[#b7a159] uppercase tracking-widest mt-1">ISO COMPETENCY RECORD</p>
                 </div>
              </div>
              <button onClick={() => setModal({...modal, isOpen: false})} className="p-1 hover:bg-white/20 rounded-full transition-colors"><X size={18}/></button>
            </div>
            
            <form onSubmit={handleSave} className="p-8 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5 md:col-span-2">
                   <label className="text-[10px] font-extrabold text-[#7a8b95] uppercase tracking-widest font-mono">Full Name *</label>
                   <input type="text" name="name" required defaultValue={modal.item.name} className="w-full bg-[#f8f9fa] border border-[#eaeaec] rounded-xl px-4 py-2.5 font-bold focus:bg-white focus:border-[#b7a159] outline-none transition-all text-[12px]"/>
                </div>
                <div className="space-y-1.5">
                   <label className="text-[10px] font-extrabold text-[#7a8b95] uppercase tracking-widest font-mono">Auditor ID</label>
                   <input type="text" name="id" required defaultValue={modal.item.id} className="w-full bg-[#f8f9fa] border border-[#eaeaec] rounded-xl px-4 py-2.5 font-mono font-bold focus:border-[#b7a159] outline-none transition-all text-[12px]"/>
                </div>
                <div className="space-y-1.5">
                   <label className="text-[10px] font-extrabold text-[#7a8b95] uppercase tracking-widest font-mono">Department</label>
                   <select name="dept" defaultValue={modal.item.dept} className="w-full bg-[#f8f9fa] border border-[#eaeaec] rounded-xl px-4 py-2.5 font-bold focus:border-[#b7a159] outline-none transition-all text-[12px]">
                     {DEPTS.map(d => <option key={d} value={d}>{d}</option>)}
                   </select>
                </div>
                <div className="space-y-1.5 md:col-span-2">
                   <label className="text-[10px] font-extrabold text-[#7a8b95] uppercase tracking-widest font-mono">Auditor Role *</label>
                   <select name="role" defaultValue={modal.item.role} className="w-full bg-[#f8f9fa] border border-[#eaeaec] rounded-xl px-4 py-2.5 font-bold focus:border-[#b7a159] outline-none transition-all text-[12px]">
                     {ROLES.filter(r=>r!=='ALL').map(r => <option key={r} value={r}>{r}</option>)}
                   </select>
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[10px] font-extrabold text-[#7a8b95] uppercase tracking-widest font-mono">Standards Certified</label>
                  <div className="grid grid-cols-2 gap-3 bg-[#f8f9fa] p-4 rounded-xl border border-[#eaeaec] shadow-inner">
                    {AVAILABLE_STANDARDS.map(std => (
                      <label key={std} className="flex items-center gap-2 cursor-pointer group">
                        <input type="checkbox" name="standards" value={std} defaultChecked={modal.item.standards.includes(std)} className="w-4 h-4 text-[#4d87a8] rounded border-[#cdd0db] focus:ring-[#4d87a8]" />
                        <span className="font-bold text-[#414757] group-hover:text-[#4d87a8] transition-colors text-[12px]">{std}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="space-y-1.5">
                   <label className="text-[10px] font-extrabold text-[#7a8b95] uppercase tracking-widest font-mono">Training Date</label>
                   <input type="date" name="trainedDate" required defaultValue={modal.item.trainedDate} className="w-full bg-[#f8f9fa] border border-[#eaeaec] rounded-xl px-4 py-2.5 font-bold focus:border-[#b7a159] outline-none transition-all text-[12px]"/>
                </div>
                <div className="space-y-1.5">
                   <label className="text-[10px] font-extrabold text-[#7a8b95] uppercase tracking-widest font-mono">Expiry Date *</label>
                   <input type="date" name="expiryDate" required defaultValue={modal.item.expiryDate} className="w-full bg-[#f8f9fa] border border-[#eaeaec] rounded-xl px-4 py-2.5 font-bold focus:border-[#b7a159] outline-none transition-all text-[12px]"/>
                </div>
              </div>
              <div className="pt-6 border-t border-[#eaeaec] flex justify-between items-center">
                {!modal.isNew ? (
                  <button type="button" onClick={() => {if(window.confirm('Delete this auditor?')) { setData(data.filter(d => d.id !== modal.item.id)); setModal({ isOpen: false, isNew: false, item: null }); }}} className="text-[#932c2e] font-bold uppercase text-[10px] flex items-center gap-2 hover:bg-[#932c2e]/10 p-2 rounded-lg transition-all"><Trash2 size={14}/> Delete</button>
                ) : <div></div>}
                <div className="flex gap-3 ml-auto">
                  <button type="button" onClick={() => setModal({...modal, isOpen: false})} className="px-5 py-2 font-bold text-[#7a8b95] hover:text-[#212c46] transition-colors uppercase text-[10px]">Cancel</button>
                  <button type="submit" className="px-8 py-2.5 bg-[#212c46] text-white font-black rounded-xl shadow-md flex items-center gap-2 uppercase text-[11px] hover:bg-[#414757] transition-all"><Save size={16}/> Save Auditor</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
