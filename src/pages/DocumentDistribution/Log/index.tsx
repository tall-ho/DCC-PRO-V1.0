import React, { useState, useMemo, useEffect } from 'react';
import {
  Search, Plus, Eye, ChevronLeft, ChevronRight, Filter, 
  Users, CheckCircle, Clock, AlertTriangle, HelpCircle, X,
  LayoutDashboard, List, FileText, Globe, 
  ShieldCheck, MoreHorizontal, Activity, CheckSquare, MessageSquareDiff, AlertOctagon, Target,
  PieChart as PieChartIcon, BarChart3, Printer, QrCode, ChevronDown, Check,
  FilePlus, FileEdit, FileX2, Copy, FileStack, HardDriveDownload, Trash2, ClipboardCheck,
  RefreshCw, Kanban, History, ArrowUpRight, ArrowDownRight, TrendingUp, Lightbulb, BarChart2, CheckCircle2, Info, Trash, Share2, XCircle, CalendarDays, Edit
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, 
  PieChart as RechartsPieChart, Pie, Cell, CartesianGrid,
  Line, ComposedChart, Legend
} from 'recharts';

const INITIAL_LOGS = [
  { id: 'DIST-26-001', copyNo: 'CP-01', docNo: 'QM-01', title: 'Quality Management Manual', holder: 'QMR Office', dept: 'Management', issueDate: '01 JAN 2026', status: 'Active', type: 'Controlled' },
  { id: 'DIST-26-003', copyNo: 'CP-01', docNo: 'QP-PD-01', title: 'Production Control Procedure', holder: 'PD Manager', dept: 'Production', issueDate: '20 MAR 2026', status: 'Active', type: 'Controlled' },
  { id: 'DIST-26-004', copyNo: 'CP-02', docNo: 'QP-PD-01', title: 'Production Control Procedure', holder: 'Planning Sup.', dept: 'Production', issueDate: '20 MAR 2026', status: 'Returned', type: 'Controlled' },
  { id: 'DIST-26-005', copyNo: 'CP-01', docNo: 'WI-PD-001', title: 'CNC Operation WI', holder: 'Line A Sup.', dept: 'Production', issueDate: '01 FEB 2026', status: 'Active', type: 'Controlled' },
  { id: 'DIST-26-006', copyNo: 'UC-05', docNo: 'WI-QA-05', title: 'Calibration WI', holder: 'Internal Auditor', dept: 'QA/QC', issueDate: '05 FEB 2026', status: 'Active', type: 'Uncontrolled' },
  { id: 'DIST-26-007', copyNo: 'CP-01', docNo: 'WI-WH-02', title: 'Outbound Logistics Procedure', holder: 'Warehouse Sup.', dept: 'Warehouse', issueDate: '16 APR 2026', status: 'Active', type: 'Controlled' },
];

const DEPTS = ['ALL', 'Management', 'Production', 'QA/QC', 'Purchasing', 'Sales', 'HR', 'Engineering', 'Warehouse'];

const DEPT_CHART_DATA = [
  { name: 'Production', value: 45, color: '#657f4d' }, 
  { name: 'QA/QC', value: 30, color: '#3f809e' },     
  { name: 'Warehouse', value: 20, color: '#b7a159' },  
  { name: 'Others', value: 15, color: '#7a8b95' },     
];

const TYPE_CHART_DATA = [
  { name: 'Controlled', count: 85, fill: '#932c2e' },
  { name: 'Uncontrolled', count: 15, fill: '#3f809e' },
];

const TREND_CHART_DATA = [
  { month: 'May 25', requests: 42, issue: 40, prevYear: 32 },
  { month: 'Jun 25', requests: 38, issue: 36, prevYear: 35 },
  { month: 'Jul 25', requests: 50, issue: 45, prevYear: 40 },
  { month: 'Aug 25', requests: 44, issue: 42, prevYear: 38 },
  { month: 'Sep 25', requests: 48, issue: 46, prevYear: 42 },
  { month: 'Oct 25', requests: 55, issue: 50, prevYear: 48 },
  { month: 'Nov 25', requests: 52, issue: 48, prevYear: 45 },
  { month: 'Dec 25', requests: 40, issue: 42, prevYear: 38 },
  { month: 'Jan 26', requests: 45, issue: 38, prevYear: 40 },
  { month: 'Feb 26', requests: 52, issue: 42, prevYear: 44 },
  { month: 'Mar 26', requests: 48, issue: 51, prevYear: 38 },
  { month: 'Apr 26', requests: 40, issue: 35, prevYear: 30 },
];

const StatusBadge = ({ status }: { status: string }) => {
  const styles: any = { 
    'Active': 'bg-[#657f4d]/10 text-[#657f4d] border-[#657f4d]/30', 
    'Returned': 'bg-[#3f809e]/10 text-[#3f809e] border-[#3f809e]/30',
    'Obsolete': 'bg-[#932c2e]/10 text-[#932c2e] border-[#932c2e]/30'
  };
  const Icons: any = { 'Active': CheckCircle2, 'Returned': History, 'Obsolete': XCircle };
  const BadgeIcon = Icons[status] || CheckCircle2;
  return (
    <span className={`px-2.5 py-1 rounded-lg font-black font-mono border flex items-center gap-1 w-max uppercase text-[10px] shadow-sm ${styles[status]}`}>
      <BadgeIcon size={12}/> {status}
    </span>
  );
};

const DashboardView = () => {
  const KPIS = [
    { label: 'TOTAL ISSUED', val: '575 Copies', color: '#3f809e', icon: Share2, trend: '+4.1%', trendUp: true, iconBg: '#3f809e15' },
    { label: 'CONTROLLED', val: '450 Copies', color: '#657f4d', icon: ShieldCheck, trend: '+12.5%', trendUp: true, iconBg: '#657f4d15' },
    { label: 'UNCONTROLLED', val: '125 Copies', color: '#b7a159', icon: FileText, trend: '+3.2%', trendUp: true, iconBg: '#b7a15915' },
    { label: 'RETURNED', val: '15 Copies', color: '#932c2e', icon: History, trend: '-7.4%', trendUp: false, iconBg: '#932c2e15' }
  ];

  return (
    <div className="flex flex-col gap-8 animate-fade pb-10 w-full mt-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {KPIS.map((s, idx) => (
          <div key={idx} className="bg-white/90 rounded-3xl p-6 shadow-sm border border-[#f3f3f1] flex flex-col justify-between h-[160px] group hover:shadow-md transition-all relative overflow-hidden">
             <div className="flex justify-between items-start z-10">
               <span className="text-[10px] font-black text-[#7a8b95] uppercase tracking-[0.15em]">{s.label}</span>
               <div className="p-2.5 rounded-xl shadow-inner" style={{ backgroundColor: s.iconBg, color: s.color }}><s.icon size={20} strokeWidth={2.5}/></div>
             </div>
             <h3 className="text-3xl font-black font-mono tracking-tighter" style={{ color: s.color }}>{s.val}</h3>
             <div className="flex justify-between items-end mt-4 z-10">
               <div className={`px-2.5 py-1.5 rounded-xl text-[10px] font-black flex items-center gap-1.5 shadow-sm border ${s.trendUp ? 'bg-[#657f4d]/10 text-[#657f4d] border-[#657f4d]/30' : 'bg-[#932c2e]/10 text-[#932c2e] border-[#932c2e]/30'}`}>
                 {s.trendUp ? <TrendingUp size={12}/> : <ArrowDownRight size={12}/>} {s.trend}
               </div>
             </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/90 rounded-3xl p-8 shadow-sm border border-[#eaeaec] flex flex-col h-[400px]">
          <h4 className="text-[12px] font-black text-[#212c46] uppercase tracking-widest mb-6 flex items-center gap-2 font-mono justify-center"><Users size={18} className="text-[#3f809e]"/> Holding By Department</h4>
          <div className="flex-1 min-h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie data={DEPT_CHART_DATA} cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={5} dataKey="value" stroke="none">
                  {DEPT_CHART_DATA.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <RechartsTooltip cursor={{fill: '#f3f3f1'}} />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white/90 rounded-3xl p-8 shadow-sm border border-[#eaeaec] flex flex-col h-[400px]">
          <h4 className="text-[12px] font-black text-[#212c46] uppercase tracking-widest mb-6 flex items-center gap-2 font-mono justify-center"><ShieldCheck size={18} className="text-[#657f4d]"/> Controlled Ratio</h4>
          <div className="flex-1 relative flex items-center justify-center min-h-[180px]">
             <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie data={[{v:85, c:'#657f4d'}, {v:15, c:'#f3f3f1'}]} cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={0} dataKey="v" stroke="none">
                    <Cell fill="#657f4d"/><Cell fill="#f3f3f1"/>
                  </Pie>
                </RechartsPieChart>
             </ResponsiveContainer>
             <div className="absolute inset-0 flex flex-col items-center justify-center pt-2"><span className="text-4xl font-black text-[#657f4d] font-mono leading-none">85%</span><span className="text-[9px] font-black text-[#7a8b95] uppercase mt-2 tracking-widest">Controlled</span></div>
          </div>
        </div>
      </div>

      <div className="bg-white/90 rounded-3xl p-10 shadow-sm border border-[#f3f3f1] overflow-hidden">
        <h4 className="text-base font-black text-[#212c46] uppercase tracking-widest font-mono mb-10">Monthly Distribution Trend</h4>
        <div className="h-[350px] w-full">
           <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={TREND_CHART_DATA} margin={{ top: 0, right: 0, left: -20, bottom: 20 }}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f3f1" />
                 <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#7a8b95', fontWeight: 'bold' }} dy={10} />
                 <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#7a8b95', fontWeight: 'bold' }} />
                 <RechartsTooltip cursor={{ fill: '#f3f3f1' }} />
                 <Bar dataKey="requests" name="New Requests" radius={[4, 4, 0, 0]} barSize={28} fill="#3f809e" />
                 <Bar dataKey="issue" name="Issued" radius={[4, 4, 0, 0]} barSize={28} fill="#657f4d" />
                 <Line type="monotone" dataKey="prevYear" name="Year-on-Year" stroke="#212c46" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#FFF' }} strokeDasharray="5 5" />
              </ComposedChart>
           </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default function DistributionLog() {
  const [activeTab, setActiveTab] = useState('list'); 
  const [activeDept, setActiveDept] = useState('ALL');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); 

  const filteredData = useMemo(() => {
    return INITIAL_LOGS.filter(d => {
      const matchDept = activeDept === 'ALL' || d.dept.toUpperCase() === activeDept.toUpperCase();
      const matchSearch = d.id.toLowerCase().includes(search.toLowerCase()) || 
                          d.title.toLowerCase().includes(search.toLowerCase()) || 
                          d.docNo.toLowerCase().includes(search.toLowerCase()) ||
                          d.holder.toLowerCase().includes(search.toLowerCase());
      return matchDept && matchSearch;
    });
  }, [search, activeDept]);

  const currentData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  return (
    <div className="flex flex-col min-h-0 w-full text-[#212c46] bg-transparent relative overflow-x-hidden font-sans">
      
      <div className="px-8 pt-3 pb-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 no-print animate-fade">
        <div className="flex items-center gap-5">
          <div className="relative flex items-center justify-center group cursor-default shrink-0">
             <div className="absolute inset-0 bg-[#b7a159] blur-[15px] opacity-30 rounded-full group-hover:opacity-70 transition-all duration-700 animate-pulse-subtle"></div>
             <div className="relative z-10 p-1.5 border border-[#b7a159]/50 rounded-xl bg-white/70 backdrop-blur-sm shadow-sm overflow-hidden">
                 <Share2 size={28} strokeWidth={2.5} className="text-[#b58c4f]" />
             </div>
          </div>
          <div className="flex flex-col justify-center">
            <h1 className="text-[24px] font-black tracking-tighter flex gap-2.5 uppercase font-mono leading-none text-[#212c46]">
              DISTRIBUTION <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b58c4f] to-[#8e9141]">LOG</span>
            </h1>
            <p className="text-[#b58c4f] font-bold uppercase tracking-[0.2em] mt-0.5 text-[11px] font-mono opacity-90 leading-none">ทะเบียนประวัติการแจกจ่ายเอกสาร</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="bg-white/50 p-1.5 rounded-xl border border-[#f3f3f1] shadow-inner flex items-center gap-1">
            <button onClick={() => setActiveTab('list')} className={`px-5 py-2 flex items-center gap-2 font-black text-[12px] uppercase tracking-widest transition-all rounded-lg ${activeTab === 'list' ? 'bg-[#212c46] text-[#d7d7d7] shadow-md' : 'text-[#7a8b95] hover:text-[#932c2e]'}`}><List size={16} /> Log List</button>
            <button onClick={() => setActiveTab('dashboard')} className={`px-5 py-2 flex items-center gap-2 font-black text-[12px] uppercase tracking-widest transition-all rounded-lg ${activeTab === 'dashboard' ? 'bg-[#212c46] text-[#d7d7d7] shadow-md' : 'text-[#7a8b95] hover:text-[#932c2e]'}`}><LayoutDashboard size={16} /> Dashboard</button>
          </div>
        </div>
      </div>

      <main className="flex-1 w-full px-8 pb-8 pt-0 flex flex-col min-h-0 overflow-y-auto custom-scrollbar">
         {activeTab === 'list' && (
           <div className="bg-white/90 border border-[#f3f3f1] shadow-sm rounded-3xl overflow-hidden flex flex-col animate-fade mt-2">
             <div className="p-5 bg-white flex flex-col md:flex-row justify-between items-center gap-4 shrink-0 border-b border-[#f3f3f1]">
                <div className="flex items-center gap-3">
                   <div className="relative flex items-center bg-[#f3f3f1] px-4 py-2.5 rounded-2xl border border-[#f3f3f1] shadow-sm hover:bg-white transition-colors">
                      <Users size={14} className="text-[#3f809e] mr-2"/><span className="text-[10px] text-[#7a8b95] font-extrabold uppercase font-mono">Dept:</span><span className="mx-2 text-[#eaeaec]">|</span>
                      <select value={activeDept} onChange={(e)=>setActiveDept(e.target.value)} className="bg-transparent font-black text-[#212c46] outline-none cursor-pointer uppercase font-mono text-[11px] pr-8 focus:ring-0">
                         {DEPTS.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                      <ChevronDown size={14} className="text-[#212c46] absolute right-4 pointer-events-none" />
                   </div>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <div className="relative flex-1 md:w-80">
                    <Search className="absolute left-4 top-3 text-[#7a8b95]" size={16} />
                    <input type="text" placeholder="Search Holder, Ref or Title..." value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-[#f3f3f1] border border-[#f3f3f1] rounded-2xl pl-12 pr-4 py-3 font-bold outline-none focus:border-[#212c46] transition-all font-mono text-sm shadow-sm"/>
                  </div>
                  <button className="px-5 py-3 bg-[#932c2e] text-white rounded-2xl shadow-md hover:bg-[#851c24] transition-all flex items-center gap-2 font-black text-[11px] uppercase tracking-widest font-mono cursor-pointer"><Plus size={16}/> NEW DIST.</button>
                </div>
             </div>

             <div className="overflow-x-auto relative w-full bg-white pb-4">
                <table className="w-full text-left border-collapse min-w-[1300px]">
                  <thead className="bg-[#212c46] border-b-[3px] border-[#b58c4f] sticky top-0 z-10 text-white font-mono text-[10px] uppercase tracking-widest">
                    <tr>
                      <th className="py-5 px-6 pl-10">Dist. ID</th>
                      <th className="py-5 px-6 text-center">Copy No.</th>
                      <th className="py-5 px-6">Doc Ref & Title</th>
                      <th className="py-5 px-6 text-center">Holder Dept.</th>
                      <th className="py-5 px-6 text-center">Type</th>
                      <th className="py-5 px-6 text-center">Issue Date</th>
                      <th className="py-5 px-6 text-center">Status</th>
                      <th className="py-5 px-6 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f3f3f1]">
                    {currentData.length > 0 ? currentData.map(dest => (
                      <tr key={dest.id} className="hover:bg-[#f3f3f1] transition-colors group text-[#212c46]">
                        <td className="py-5 px-6 pl-10 align-middle font-bold font-mono text-[12px]">{dest.id}</td>
                        <td className="py-5 px-6 text-center align-middle font-black text-[#932c2e] font-mono">{dest.copyNo}</td>
                        <td className="py-5 px-6 align-top">
                           <span className="font-black text-[#932c2e] font-mono text-[11px] bg-white border border-[#f3f3f1] px-2 py-0.5 rounded-lg mb-1 inline-block shadow-sm">{dest.docNo}</span>
                           <p className="font-bold text-[12px] leading-snug">{dest.title}</p>
                        </td>
                        <td className="py-5 px-6 text-center align-middle">
                           <p className="font-extrabold text-[#3a4e69] uppercase font-mono">{dest.dept}</p>
                           <p className="text-[10px] text-[#7a8b95] font-bold">({dest.holder})</p>
                        </td>
                        <td className="py-5 px-6 text-center align-middle">
                           <span className="px-2.5 py-1 rounded-lg font-black text-white uppercase text-[9px] shadow-sm" style={{ backgroundColor: dest.type === 'Controlled' ? '#932c2e' : '#3f809e' }}>{dest.type}</span>
                        </td>
                        <td className="py-5 px-6 text-center align-middle font-bold text-[#7a8b95] font-mono">{dest.issueDate}</td>
                        <td className="py-5 px-6 text-center align-middle"><div className="flex justify-center"><StatusBadge status={dest.status}/></div></td>
                        <td className="py-5 px-6 text-center align-middle">
                           <div className="flex items-center justify-center gap-1.5 transition-opacity group-hover:opacity-100 opacity-60">
                              <button className="p-2 bg-white border border-[#f3f3f1] text-[#7a8b95] hover:bg-[#212c46] hover:text-white rounded-xl shadow-sm transition-all cursor-pointer"><Eye size={14}/></button>
                              <button className="p-2 bg-white border border-[#f3f3f1] text-[#7a8b95] hover:bg-[#932c2e] hover:text-white rounded-xl shadow-sm transition-all cursor-pointer"><Printer size={14}/></button>
                           </div>
                        </td>
                      </tr>
                    )) : <tr><td colSpan={8} className="p-10 text-center font-mono italic text-[#7a8b95]">No logs found.</td></tr>}
                  </tbody>
                </table>
             </div>
             
             <div className="p-5 bg-white border-t border-[#f3f3f1] flex justify-between items-center text-[#7a8b95] uppercase font-mono text-[10px] font-bold">
               <div>Page {currentPage} | Showing {currentData.length} records</div>
               <div className="flex gap-2">
                 <button onClick={() => setCurrentPage(Math.max(1, currentPage-1))} disabled={currentPage === 1} className="p-2 border rounded-xl hover:bg-[#f3f3f1] disabled:opacity-50 transition-all shadow-sm"><ChevronLeft size={16}/></button>
                 <button onClick={() => setCurrentPage(currentPage+1)} disabled={currentData.length < itemsPerPage} className="p-2 border rounded-xl hover:bg-[#f3f3f1] disabled:opacity-50 transition-all shadow-sm"><ChevronRight size={16}/></button>
               </div>
             </div>
           </div>
         )}

         {activeTab === 'dashboard' && <DashboardView />}
      </main>
    </div>
  );
}
