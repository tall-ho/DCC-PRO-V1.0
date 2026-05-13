import React, { useState, useMemo, useEffect } from 'react';
import {
  Search, Plus, BookOpen, Download, Eye,
  ChevronLeft, ChevronRight, Filter, 
  Users, CheckCircle, Clock, AlertTriangle, 
  HardDriveDownload, HelpCircle, X,
  Network, LayoutDashboard, List, FileText,
  PieChart as PieChartIcon, BarChart3, TrendingUp, Info, RefreshCw,
  Target, Activity, ShieldCheck, ChevronDown, CheckCircle2, XCircle, MoreVertical, Edit, Printer
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
  ComposedChart, Line
} from 'recharts';

const INITIAL_DOCS = [
  { id: 'QM-01', title: 'Quality Management System Manual', type: 'Manual', dept: 'Management', rev: '05', date: '01 JAN 2025', status: 'Active', owner: 'QMR' },
  { id: 'QP-MR-01', title: 'Management Review Procedure', type: 'Procedure', dept: 'Management', rev: '03', date: '15 FEB 2024', status: 'Active', owner: 'QMR' },
  { id: 'QP-DC-01', title: 'Document and Record Control', type: 'Procedure', dept: 'QA/QC', rev: '06', date: '10 JAN 2026', status: 'Active', owner: 'DCC' },
  { id: 'QP-PD-01', title: 'Production Planning Control', type: 'Procedure', dept: 'Production', rev: '02', date: '20 MAR 2025', status: 'Active', owner: 'PD Mgr' },
  { id: 'QP-PU-01', title: 'Purchasing and Supplier Assessment', type: 'Procedure', dept: 'Purchasing', rev: '04', date: '05 MAY 2025', status: 'Active', owner: 'PU Mgr' },
  { id: 'WI-PD-001', title: 'CNC Machine Operation WI', type: 'Work Instruction', dept: 'Production', rev: '07', date: '01 FEB 2026', status: 'Active', owner: 'PD Sup' },
  { id: 'FM-PD-001', title: 'Daily Production Report Form', type: 'Form', dept: 'Production', rev: '10', date: '01 JAN 2026', status: 'Active', owner: 'PD Admin' },
  { id: 'FM-EN-001-OLD', title: 'Old Maintenance Record (Obsolete)', type: 'Form', dept: 'Engineering', rev: '05', date: '10 JAN 2022', status: 'Obsolete', owner: 'EN Sup' },
];

const DEPTS = ['ALL', 'Management', 'Production', 'QA/QC', 'Purchasing', 'Sales', 'HR', 'Engineering', 'Warehouse'];
const DOC_TYPES = ['ALL', 'Manual', 'Procedure', 'Work Instruction', 'Form'];

const DEPT_CHART_DATA = [
  { name: 'Production', value: 320, color: '#657f4d' },
  { name: 'QA/QC', value: 185, color: '#3f809e' },
  { name: 'Engineering', value: 152, color: '#932c2e' },
  { name: 'Warehouse', value: 95, color: '#b7a159' },
  { name: 'Others', value: 93, color: '#7a8b95' },
];

const TYPE_CHART_DATA = [
  { name: 'Manual', count: 5, fill: '#3f809e' },
  { name: 'Procedure', count: 124, fill: '#b58c4f' },
  { name: 'Work Instruction', count: 350, fill: '#b7a159' },
  { name: 'Form', count: 366, fill: '#657f4d' },
];

const StatusBadge = ({ status }: { status: string }) => {
  const styles: any = { 
    'Active': 'bg-[#657f4d]/10 text-[#657f4d] border-[#657f4d]/30', 
    'Obsolete': 'bg-[#932c2e]/10 text-[#932c2e] border-[#932c2e]/30',
    'Draft': 'bg-[#b7a159]/10 text-[#b7a159] border-[#b7a159]/30'
  };
  const Icons: any = { 'Active': CheckCircle2, 'Obsolete': XCircle, 'Draft': Clock };
  const BadgeIcon = Icons[status] || CheckCircle2;
  return (
    <span className={`px-2.5 py-1 rounded-lg font-black font-mono border flex items-center gap-1 w-max uppercase text-[10px] shadow-sm ${styles[status]}`}>
      <BadgeIcon size={12}/> {status}
    </span>
  );
};

const DashboardView = () => {
  const KPIS = [
    { label: 'TOTAL DOCS', val: '845 Items', color: '#212c46', icon: BookOpen, iconBg: '#212c4615' },
    { label: 'PROCEDURES', val: '124', color: '#b58c4f', icon: FileText, iconBg: '#b58c4f15' },
    { label: 'WORK INSTRUCTIONS', val: '350', color: '#b7a159', icon: Network, iconBg: '#b7a15915' },
    { label: 'FORMS & RECORDS', val: '366', color: '#657f4d', icon: LayoutDashboard, iconBg: '#657f4d15' }
  ];

  return (
    <div className="space-y-8 animate-fade mt-4 pb-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {KPIS.map((kpi, idx) => (
          <div key={idx} className="bg-white/90 rounded-3xl p-6 border border-[#f3f3f1] shadow-sm flex items-center gap-5 hover:shadow-md transition-all">
             <div className="p-4 rounded-2xl shrink-0" style={{ backgroundColor: kpi.iconBg, color: kpi.color }}>
               <kpi.icon size={28} strokeWidth={2.5}/>
             </div>
             <div>
               <p className="text-[10px] font-black text-[#7a8b95] uppercase tracking-widest mb-1">{kpi.label}</p>
               <h3 className="text-3xl font-black text-[#212c46] font-mono leading-none">{kpi.val}</h3>
             </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="bg-white/90 rounded-3xl p-8 border border-[#eaeaec] shadow-sm h-[400px] flex flex-col">
            <h4 className="text-[12px] font-black text-[#212c46] uppercase tracking-widest mb-6 flex items-center gap-2 font-mono justify-center">
              <PieChartIcon size={18} className="text-[#932c2e]"/> Documents by Department
            </h4>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={DEPT_CHART_DATA} cx="50%" cy="50%" innerRadius={80} outerRadius={120} paddingAngle={5} dataKey="value" stroke="none">
                    {DEPT_CHART_DATA.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <RechartsTooltip cursor={{fill: '#f3f3f1'}} />
                </PieChart>
              </ResponsiveContainer>
            </div>
         </div>

         <div className="bg-white/90 rounded-3xl p-8 border border-[#eaeaec] shadow-sm h-[400px] flex flex-col">
            <h4 className="text-[12px] font-black text-[#212c46] uppercase tracking-widest mb-6 flex items-center gap-2 font-mono justify-center">
              <BarChart3 size={18} className="text-[#3f809e]"/> Documents by Type
            </h4>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={TYPE_CHART_DATA} margin={{ top: 20, right: 30, left: -10, bottom: 5 }} barSize={40}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f3f1" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#7a8b95', fontFamily: 'JetBrains Mono' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#7a8b95', fontFamily: 'JetBrains Mono' }} />
                  <RechartsTooltip cursor={{ fill: '#f3f3f1' }} />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {TYPE_CHART_DATA.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
         </div>
      </div>
    </div>
  );
};

export default function DocumentList() {
  const [activeTab, setActiveTab] = useState('list'); 
  const [activeDept, setActiveDept] = useState('ALL');
  const [activeType, setActiveType] = useState('ALL');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); 

  const filteredDocs = useMemo(() => {
    return INITIAL_DOCS.filter(d => {
      const matchDept = activeDept === 'ALL' || d.dept === activeDept;
      const matchType = activeType === 'ALL' || d.type === activeType;
      const matchSearch = d.id.toLowerCase().includes(search.toLowerCase()) || d.title.toLowerCase().includes(search.toLowerCase());
      return matchDept && matchType && matchSearch;
    });
  }, [search, activeDept, activeType]);
  
  const currentDocs = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredDocs.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredDocs, currentPage, itemsPerPage]);

  return (
    <div className="flex flex-col min-h-0 w-full text-[#212c46] bg-transparent relative overflow-x-hidden font-sans">
      
      <div className="px-8 pt-3 pb-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 no-print animate-fade">
        <div className="flex items-center gap-5">
          <div className="relative flex items-center justify-center group cursor-default shrink-0">
             <div className="absolute inset-0 bg-[#b7a159] blur-[15px] opacity-30 rounded-full group-hover:opacity-70 transition-all duration-700 animate-pulse-subtle"></div>
             <div className="relative z-10 p-1.5 border border-[#b7a159]/50 rounded-xl bg-white/70 backdrop-blur-sm shadow-sm overflow-hidden">
                 <List size={28} strokeWidth={2.5} className="text-[#b58c4f]" />
             </div>
          </div>
          <div className="flex flex-col justify-center">
            <h1 className="text-[24px] font-black tracking-tighter flex gap-2.5 uppercase font-mono leading-none text-[#212c46]">
              DOCUMENT <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b58c4f] to-[#8e9141]">LIST</span>
            </h1>
            <p className="text-[#b58c4f] font-bold uppercase tracking-[0.2em] mt-0.5 text-[11px] font-mono opacity-90 leading-none">ศูนย์รวมทะเบียนเอกสารประกาศใช้</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="bg-white/50 p-1.5 rounded-xl border border-[#f3f3f1] shadow-inner flex items-center gap-1">
            <button onClick={() => setActiveTab('list')} className={`px-5 py-2 flex items-center gap-2 font-black text-[12px] uppercase tracking-widest transition-all rounded-lg ${activeTab === 'list' ? 'bg-[#212c46] text-[#d7d7d7] shadow-md' : 'text-[#7a8b95] hover:text-[#932c2e]'}`}><List size={16} /> Doc Table</button>
            <button onClick={() => setActiveTab('dashboard')} className={`px-5 py-2 flex items-center gap-2 font-black text-[12px] uppercase tracking-widest transition-all rounded-lg ${activeTab === 'dashboard' ? 'bg-[#212c46] text-[#d7d7d7] shadow-md' : 'text-[#7a8b95] hover:text-[#932c2e]'}`}><LayoutDashboard size={16} /> Analytics</button>
          </div>
        </div>
      </div>

      <main className="flex-1 w-full px-8 pb-8 pt-0 flex flex-col min-h-0 overflow-y-auto custom-scrollbar">
         {activeTab === 'list' && (
           <div className="bg-white/90 border border-[#f3f3f1] shadow-sm rounded-3xl overflow-hidden flex flex-col animate-fade mt-2">
             <div className="p-5 bg-white flex flex-col md:flex-row justify-between items-center gap-4 shrink-0 border-b border-[#f3f3f1]">
                <div className="flex items-center gap-3">
                   <div className="relative flex items-center bg-[#f8f9fa] px-4 py-2.5 rounded-2xl border border-[#eaeaec] shadow-sm hover:bg-white transition-colors">
                      <Filter size={14} className="text-[#7a8b95] mr-2"/><span className="text-[10px] text-[#7a8b95] font-extrabold uppercase font-mono">Type:</span><span className="mx-2 text-[#eaeaec]">|</span>
                      <select value={activeType} onChange={(e)=>setActiveType(e.target.value)} className="bg-transparent font-black text-[#212c46] outline-none cursor-pointer uppercase font-mono text-[11px] pr-8 focus:ring-0">
                         {DOC_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                      <ChevronDown size={14} className="text-[#212c46] absolute right-4 pointer-events-none" />
                   </div>
                   <div className="relative flex items-center bg-[#f8f9fa] px-4 py-2.5 rounded-2xl border border-[#eaeaec] shadow-sm hover:bg-white transition-colors">
                      <Users size={14} className="text-[#7a8b95] mr-2"/><span className="text-[10px] text-[#7a8b95] font-extrabold uppercase font-mono">Dept:</span><span className="mx-2 text-[#eaeaec]">|</span>
                      <select value={activeDept} onChange={(e)=>setActiveDept(e.target.value)} className="bg-transparent font-black text-[#212c46] outline-none cursor-pointer uppercase font-mono text-[11px] pr-8 focus:ring-0">
                         {DEPTS.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                      <ChevronDown size={14} className="text-[#212c46] absolute right-4 pointer-events-none" />
                   </div>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <div className="relative flex-1 md:w-80">
                    <Search className="absolute left-4 top-3 text-[#7a8b95]" size={16} />
                    <input type="text" placeholder="Search Doc No or Title..." value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-[#f3f3f1] border border-[#f3f3f1] rounded-2xl pl-12 pr-4 py-3 font-bold outline-none focus:border-[#212c46] transition-all font-mono text-sm shadow-sm"/>
                  </div>
                  <button className="px-5 py-3 bg-[#932c2e] text-white rounded-2xl shadow-md hover:bg-[#851c24] transition-all flex items-center gap-2 font-black text-[11px] uppercase tracking-widest font-mono cursor-pointer"><Plus size={16}/> NEW DAR</button>
                </div>
             </div>

             <div className="overflow-x-auto relative w-full bg-white pb-4">
                <table className="w-full text-left border-collapse min-w-[1300px]">
                  <thead className="bg-[#212c46] border-b-[3px] border-[#b58c4f] sticky top-0 z-10 text-white font-mono text-[10px] uppercase tracking-widest">
                    <tr>
                      <th className="py-5 px-6 pl-10">Doc No.</th>
                      <th className="py-5 px-6">Document Title</th>
                      <th className="py-5 px-6 text-center">Rev.</th>
                      <th className="py-5 px-6">Type</th>
                      <th className="py-5 px-6 text-center">Owner Dept.</th>
                      <th className="py-5 px-6 text-center">Effective</th>
                      <th className="py-5 px-6 text-center">Status</th>
                      <th className="py-5 px-6 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f3f3f1]">
                    {currentDocs.length > 0 ? currentDocs.map(doc => (
                      <tr key={doc.id} className="hover:bg-[#f3f3f1] transition-colors group text-[#212c46]">
                        <td className="py-5 px-6 pl-10 align-middle font-black font-mono text-[13px] text-[#212c46]">{doc.id}</td>
                        <td className="py-5 px-6 align-top">
                           <p className={`font-bold text-[13px] leading-snug ${doc.status === 'Obsolete' ? 'text-[#7a8b95] line-through' : 'text-[#212c46]'}`}>{doc.title}</p>
                        </td>
                        <td className="py-5 px-6 text-center align-middle font-black text-[#b58c4f] font-mono text-[14px]">{doc.rev}</td>
                        <td className="py-5 px-6 align-middle">
                           <span className={`px-2.5 py-1 rounded-lg font-black uppercase text-[9px] shadow-sm text-white ${
                               doc.type === 'Manual' ? 'bg-[#3f809e]' :
                               doc.type === 'Procedure' ? 'bg-[#b58c4f]' :
                               doc.type === 'Work Instruction' ? 'bg-[#b7a159]' :
                               doc.type === 'Form' ? 'bg-[#657f4d]' : 'bg-[#7a8b95]'
                           }`}>{doc.type}</span>
                        </td>
                        <td className="py-5 px-6 text-center align-middle font-extrabold text-[#3a4e69] uppercase font-mono">{doc.dept}</td>
                        <td className="py-5 px-6 text-center align-middle font-bold text-[#7a8b95] font-mono">{doc.date}</td>
                        <td className="py-5 px-6 text-center align-middle"><div className="flex justify-center"><StatusBadge status={doc.status}/></div></td>
                        <td className="py-5 px-6 text-center align-middle">
                           <div className="flex items-center justify-center gap-1.5 transition-opacity group-hover:opacity-100 opacity-60">
                              <button className="p-2 bg-white border border-[#f3f3f1] text-[#7a8b95] hover:bg-[#212c46] hover:text-white rounded-xl shadow-sm transition-all cursor-pointer"><Eye size={14}/></button>
                              <button className="p-2 bg-white border border-[#f3f3f1] text-[#7a8b95] hover:bg-[#3f809e] hover:text-white rounded-xl shadow-sm transition-all cursor-pointer"><Download size={14}/></button>
                           </div>
                        </td>
                      </tr>
                    )) : <tr><td colSpan={8} className="p-10 text-center font-mono italic text-[#7a8b95]">No documents found.</td></tr>}
                  </tbody>
                </table>
             </div>
             
             <div className="p-5 bg-white border-t border-[#f3f3f1] flex justify-between items-center text-[#7a8b95] uppercase font-mono text-[10px] font-bold">
               <div>Page {currentPage} | Showing {currentDocs.length} records</div>
               <div className="flex gap-2">
                 <button onClick={() => setCurrentPage(Math.max(1, currentPage-1))} disabled={currentPage === 1} className="p-2 border rounded-xl hover:bg-[#f3f3f1] disabled:opacity-50 transition-all shadow-sm"><ChevronLeft size={16}/></button>
                 <button onClick={() => setCurrentPage(currentPage+1)} disabled={currentDocs.length < itemsPerPage} className="p-2 border rounded-xl hover:bg-[#f3f3f1] disabled:opacity-50 transition-all shadow-sm"><ChevronRight size={16}/></button>
               </div>
             </div>
           </div>
         )}

         {activeTab === 'dashboard' && <DashboardView />}
      </main>
    </div>
  );
}
