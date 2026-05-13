import React, { useState, useMemo, useEffect } from 'react';
import {
  Search, Kanban, List, LayoutDashboard, ChevronLeft, ChevronRight, X,
  Clock, Eye, HelpCircle, ShieldAlert, ShieldCheck, Users, Activity, CheckSquare, MessageSquareDiff, AlertOctagon, Target,
  FileStack, HardDriveDownload, CalendarDays, CheckCircle2, AlertTriangle, XCircle, Info, RefreshCw, ArrowRight,
  PieChart as PieChartIcon, ArrowUpRight, Plus, FilePlus, FileEdit, FileX2, Copy, BarChart3, ChevronDown
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell
} from 'recharts';

const DAR_STAGES = [
  { id: 'head_approval', label: 'AWAITING DEPT HEAD', icon: Clock, color: 'text-[#b58c4f]', bg: 'bg-[#b58c4f]/10', border: 'border-[#b58c4f]/30' },
  { id: 'dcc_review', label: 'AWAITING DCC REVIEW', icon: ShieldCheck, color: 'text-[#3f809e]', bg: 'bg-[#3f809e]/10', border: 'border-[#3f809e]/30' },
  { id: 'processing', label: 'DCC PROCESSING', icon: Activity, color: 'text-[#657f4d]', bg: 'bg-[#657f4d]/10', border: 'border-[#657f4d]/30' },
  { id: 'overdue', label: 'OVERDUE DARs', icon: AlertTriangle, color: 'text-[#932c2e]', bg: 'bg-[#932c2e]/10', border: 'border-[#932c2e]/30' },
];

const PENDING_DARS = [
  { id: 'DAR 26/042', type: 'New', subject: 'Incoming Inspection Quality Test Procedure', dept: 'QA/QC', requester: 'Quality Eng.', requestDate: '12 FEB 2026', due: '26 FEB 2026', status: 'head_approval', aging: 3 },
  { id: 'DAR 26/050', type: 'Revise', subject: 'Board Assembly v4 Work Instruction', dept: 'Production', requester: 'Production Sup.', requestDate: '10 FEB 2026', due: '24 FEB 2026', status: 'dcc_review', aging: 5 },
  { id: 'DAR 26/038', type: 'Revise', subject: 'Machine Preventive Maintenance Plan', dept: 'Engineering', requester: 'Maintenance Mgr', requestDate: '01 FEB 2026', due: '10 FEB 2026', status: 'overdue', aging: 15 },
  { id: 'DAR 26/055', type: 'New', subject: 'Overtime Request Form (Revised Layout)', dept: 'HR', requester: 'HR Officer', requestDate: '11 FEB 2026', due: '18 FEB 2026', status: 'processing', aging: 4 },
  { id: 'DAR 26/061', type: 'Obsolete', subject: 'Old Quality Manual Rev.05', dept: 'Management', requester: 'QMR', requestDate: '08 FEB 2026', due: '15 FEB 2026', status: 'overdue', aging: 7 },
  { id: 'DAR 26/046', type: 'Copy', subject: 'CMM Measurement Method (Copy Request)', dept: 'QA/QC', requester: 'QC Inspector', requestDate: '14 FEB 2026', due: '28 FEB 2026', status: 'head_approval', aging: 1 },
];

const SIMPLE_BAR_DATA_DEPT = [
  { dept: 'QA/QC', count: 2 },
  { dept: 'Production', count: 1 },
  { dept: 'Engineering', count: 1 },
  { dept: 'HR', count: 1 },
  { dept: 'Management', count: 1 },
];

const PIE_DATA_TYPE = [
  { name: 'New', count: 2, fill: '#657f4d' },
  { name: 'Revise', count: 2, fill: '#3f809e' },
  { name: 'Obsolete', count: 1, fill: '#932c2e' },
  { name: 'Copy', count: 1, fill: '#b58c4f' },
];

const DashboardView = () => {
  return (
    <div className="space-y-8 animate-fade mt-4 pb-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {DAR_STAGES.map((stage, idx) => {
          const count = PENDING_DARS.filter(c => c.status === stage.id).length;
          return (
            <div key={idx} className="bg-white/90 rounded-3xl p-6 shadow-sm border border-[#f3f3f1] flex flex-col justify-between h-[160px] group hover:shadow-md transition-all relative overflow-hidden cursor-default">
              <div className={`absolute -right-6 -top-6 w-28 h-28 rounded-full opacity-40 group-hover:scale-[1.8] transition-transform duration-500 pointer-events-none ${stage.bg}`}></div>
              <div className="flex justify-between items-start z-10 w-full">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner backdrop-blur-sm ${stage.bg} ${stage.color} border border-white/40`}>
                  <stage.icon size={22} strokeWidth={2.5}/>
                </div>
                <span className={`text-4xl font-black font-mono tracking-tighter transition-colors ${count > 0 ? 'text-[#212c46]' : 'text-[#cdd0db]'}`}>
                  {count}
                </span>
              </div>
              <div className="z-10 mt-auto">
                <span className="text-[11px] font-black text-[#212c46] uppercase tracking-widest block leading-tight">
                  {stage.label}
                </span>
                <span className="text-[10px] font-bold text-[#7a8b95] mt-1.5 flex items-center gap-1">
                  <Activity size={12}/> Active Tasks
                </span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
         <div className="bg-white/90 rounded-3xl p-8 shadow-sm border border-[#f3f3f1] lg:col-span-8 flex flex-col h-[400px]">
            <h4 className="text-[12px] font-black text-[#212c46] uppercase tracking-widest font-mono flex items-center gap-2 mb-6 justify-center">
              <BarChart3 size={18} className="text-[#3f809e]" /> Pending By Department
            </h4>
            <div className="flex-1 w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={SIMPLE_BAR_DATA_DEPT} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f3f1" />
                     <XAxis dataKey="dept" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#7a8b95', fontWeight: 'bold' }} dy={10}/>
                     <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#212c46', fontWeight: 'bold' }} />
                     <RechartsTooltip cursor={{ fill: '#f3f3f1' }} />
                     <Bar dataKey="count" fill="#3f809e" radius={[4, 4, 0, 0]} barSize={40}>
                        {SIMPLE_BAR_DATA_DEPT.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={index === 0 ? '#932c2e' : '#3f809e'} />
                        ))}
                     </Bar>
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </div>
         
         <div className="bg-white/90 rounded-3xl p-8 shadow-sm border border-[#f3f3f1] lg:col-span-4 flex flex-col h-[400px]">
            <h4 className="text-[12px] font-black text-[#212c46] uppercase tracking-widest font-mono flex items-center gap-2 mb-6 justify-center">
              <PieChartIcon size={18} className="text-[#b58c4f]" /> DAR Type Breakdown
            </h4>
            <div className="flex-1 relative flex items-center justify-center min-h-[200px]">
               <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={PIE_DATA_TYPE} cx="50%" cy="50%" innerRadius={70} outerRadius={105} paddingAngle={5} dataKey="count" stroke="none">
                      {PIE_DATA_TYPE.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
               </ResponsiveContainer>
               <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                 <span className="text-3xl font-black text-[#212c46] font-mono">{PENDING_DARS.length}</span>
                 <span className="text-[10px] text-[#7a8b95] font-bold uppercase tracking-widest mt-1">Total</span>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default function DarPending() {
  const [activeTab, setActiveTab] = useState('kanban'); 
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredData = useMemo(() => PENDING_DARS.filter(d => d.subject.toLowerCase().includes(search.toLowerCase()) || d.id.toLowerCase().includes(search.toLowerCase())), [search]);
  const currentData = useMemo(() => filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage), [filteredData, currentPage, itemsPerPage]);

  return (
      <div className="flex flex-col min-h-0 w-full text-[#212c46] bg-transparent relative overflow-x-hidden font-sans">

        <div className="px-8 pt-3 pb-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 no-print animate-fade">
          <div className="flex items-center gap-5">
            <div className="relative flex items-center justify-center group cursor-default shrink-0">
               <div className="absolute inset-0 bg-[#b7a159] blur-[15px] opacity-30 rounded-full group-hover:opacity-70 transition-all duration-700 animate-pulse-subtle"></div>
               <div className="relative z-10 p-1.5 border border-[#b7a159]/50 rounded-xl bg-white/70 backdrop-blur-sm shadow-sm overflow-hidden">
                   <ShieldAlert size={28} strokeWidth={2.5} className="text-[#b58c4f]" />
               </div>
            </div>
            <div className="flex flex-col justify-center">
              <h1 className="text-[24px] font-black tracking-tighter flex gap-2.5 uppercase font-mono leading-none text-[#212c46]">
                DAR PENDING <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b58c4f] to-[#8e9141]">APPROVALS</span>
              </h1>
              <p className="text-[#b58c4f] font-bold uppercase tracking-[0.2em] mt-0.5 text-[11px] font-mono opacity-90 leading-none">รายการรอดำเนินการเอกสาร (DAR)</p>
            </div>
          </div>
          
          <div className="bg-white/50 p-1.5 rounded-xl border border-[#f3f3f1] shadow-inner flex items-center gap-1">
            <button onClick={() => setActiveTab('kanban')} className={`px-5 py-2 flex items-center gap-2 font-black text-[12px] uppercase tracking-widest transition-all rounded-lg ${activeTab === 'kanban' ? 'bg-[#212c46] text-[#d7d7d7] shadow-md' : 'text-[#7a8b95] hover:text-[#932c2e]'}`}><Kanban size={16} /> Approvals</button>
            <button onClick={() => setActiveTab('list')} className={`px-5 py-2 flex items-center gap-2 font-black text-[12px] uppercase tracking-widest transition-all rounded-lg ${activeTab === 'list' ? 'bg-[#212c46] text-[#d7d7d7] shadow-md' : 'text-[#7a8b95] hover:text-[#932c2e]'}`}><List size={16} /> List View</button>
            <button onClick={() => setActiveTab('dashboard')} className={`px-5 py-2 flex items-center gap-2 font-black text-[12px] uppercase tracking-widest transition-all rounded-lg ${activeTab === 'dashboard' ? 'bg-[#212c46] text-[#d7d7d7] shadow-md' : 'text-[#7a8b95] hover:text-[#932c2e]'}`}><LayoutDashboard size={16} /> Analytics</button>
          </div>
        </div>

        <main className="flex-1 w-full px-8 pb-10 flex flex-col min-h-0 overflow-y-auto custom-scrollbar">
           {activeTab === 'dashboard' && <DashboardView />}
           
           {activeTab === 'kanban' && (
             <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-full pb-8 items-stretch animate-fade mt-4">
                {DAR_STAGES.map(stage => {
                  const items = PENDING_DARS.filter(d => d.status === stage.id);
                  return (
                    <div key={stage.id} className="flex flex-col h-full min-h-0 bg-white/40 rounded-3xl border border-white/50 p-2">
                       <div className="p-4 flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                             <stage.icon size={16} className={stage.color} strokeWidth={2.5} />
                             <span className={`text-[10px] font-black uppercase tracking-widest ${stage.color} font-mono`}>{stage.label}</span>
                          </div>
                          <span className={`bg-white px-2 py-0.5 rounded-lg text-[10px] font-black shadow-sm border ${stage.border} ${stage.color} font-mono`}>{items.length}</span>
                       </div>
                       <div className="overflow-y-auto custom-scrollbar flex flex-col gap-3 flex-1 px-2">
                          {items.map(item => (
                            <div key={item.id} className="bg-white p-5 rounded-2xl shadow-sm border border-[#f3f3f1] hover:border-[#b58c4f] transition-all group flex flex-col cursor-pointer relative overflow-hidden">
                               <div className="flex justify-between items-start mb-3">
                                  <span className="text-[10px] font-black text-[#932c2e] font-mono bg-[#f3f3f1] px-2 py-1 rounded-lg border border-[#f3f3f1] flex items-center gap-1"><FileStack size={12}/>{item.id}</span>
                                  {item.aging > 3 && <span className="flex items-center gap-1 text-[#932c2e] bg-[#932c2e]/10 px-2 py-0.5 rounded-lg border border-[#932c2e]/30 text-[9px] font-black font-mono animate-pulse shadow-sm tracking-tighter">! {item.aging}D</span>}
                               </div>
                               <h4 className="text-[12px] font-black text-[#212c46] leading-snug mb-3 line-clamp-2">{item.subject}</h4>
                               <div className="flex flex-wrap gap-1.5 mb-4">
                                 <span className={`px-2 py-0.5 rounded-md font-black text-[9px] uppercase tracking-widest font-mono border ${
                                    item.type === 'New' ? 'bg-[#657f4d]/10 text-[#657f4d] border-[#657f4d]/30' :
                                    item.type === 'Revise' ? 'bg-[#3f809e]/10 text-[#3f809e] border-[#3f809e]/30' :
                                    item.type === 'Obsolete' ? 'bg-[#932c2e]/10 text-[#932c2e] border-[#932c2e]/30' :
                                    'bg-[#b58c4f]/10 text-[#b58c4f] border-[#b58c4f]/30'
                                  }`}>{item.type}</span>
                               </div>
                               <div className="flex items-center justify-between border-t border-[#f3f3f1] pt-3 mt-auto">
                                  <span className="text-[10px] font-black text-[#7a8b95] uppercase font-mono tracking-widest">{item.dept}</span>
                                  <button className="text-[#7a8b95] group-hover:text-[#212c46] transition-colors"><ArrowUpRight size={16} strokeWidth={2.5}/></button>
                               </div>
                            </div>
                          ))}
                       </div>
                    </div>
                  )
                })}
             </div>
           )}

           {activeTab === 'list' && (
             <div className="bg-white/90 border border-[#f3f3f1] shadow-sm rounded-3xl overflow-hidden flex flex-col animate-fade mt-6">
               <div className="p-5 bg-white flex flex-col md:flex-row justify-between items-center gap-4 shrink-0 border-b border-[#f3f3f1]">
                  <div className="relative w-full md:w-80">
                    <Search className="absolute left-4 top-3 text-[#7a8b95]" size={16} />
                    <input type="text" placeholder="Search DAR No or Subject..." value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-[#f3f3f1] border border-[#f3f3f1] rounded-2xl pl-12 pr-4 py-3 font-bold outline-none focus:border-[#212c46] transition-all font-mono text-sm shadow-sm"/>
                  </div>
                  <button className="px-5 py-3 bg-[#932c2e] text-white rounded-2xl shadow-md hover:bg-[#851c24] transition-all flex items-center gap-2 font-black text-[11px] uppercase tracking-widest font-mono cursor-pointer"><Plus size={16}/> NEW DAR</button>
               </div>
               <div className="overflow-x-auto relative w-full bg-white pb-4">
                  <table className="w-full text-left border-collapse min-w-[1300px]">
                    <thead className="bg-[#212c46] border-b-[3px] border-[#b58c4f] sticky top-0 z-10 text-white font-mono text-[10px] uppercase tracking-widest">
                      <tr>
                        <th className="py-5 px-6 pl-10">DAR Ref & Item</th>
                        <th className="py-5 px-6 text-center">Type</th>
                        <th className="py-5 px-6 text-center">Dept.</th>
                        <th className="py-5 px-6 text-center">Request Date</th>
                        <th className="py-5 px-6 text-center">Due Date</th>
                        <th className="py-5 px-6 text-center">Stage</th>
                        <th className="py-5 px-6 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f3f3f1]">
                      {currentData.map(item => {
                        const stage = DAR_STAGES.find(s => s.id === item.status);
                        return (
                        <tr key={item.id} className="hover:bg-[#f3f3f1] transition-colors group text-[#212c46]">
                          <td className="py-5 px-6 pl-10">
                             <div className="flex items-center gap-2 mb-1">
                               <FileStack size={14} className="text-[#932c2e]" strokeWidth={2.5}/>
                               <span className="font-extrabold text-[#932c2e] font-mono text-[12px]">{item.id}</span>
                             </div>
                             <p className="font-bold text-[12px] leading-snug pl-6">{item.subject}</p>
                          </td>
                          <td className="py-5 px-6 text-center align-middle">
                             <span className={`px-2.5 py-1 rounded-lg font-black border text-[9px] uppercase tracking-widest font-mono ${
                               item.type === 'New' ? 'bg-[#657f4d]/10 text-[#657f4d] border-[#657f4d]/30' :
                               item.type === 'Revise' ? 'bg-[#3f809e]/10 text-[#3f809e] border-[#3f809e]/30' :
                               item.type === 'Obsolete' ? 'bg-[#932c2e]/10 text-[#932c2e] border-[#932c2e]/30' :
                               'bg-[#b58c4f]/10 text-[#b58c4f] border-[#b58c4f]/30'
                             }`}>{item.type}</span>
                          </td>
                          <td className="py-5 px-6 text-center align-middle font-extrabold text-[#3a4e69] uppercase font-mono">{item.dept}</td>
                          <td className="py-5 px-6 text-center align-middle font-bold text-[#7a8b95] font-mono">{item.requestDate}</td>
                          <td className="py-5 px-6 text-center align-middle font-bold text-[#932c2e] font-mono">{item.due}</td>
                          <td className="py-5 px-6 text-center align-middle">
                              <span className={`px-2.5 py-1 rounded-lg font-black font-mono border flex items-center justify-center gap-1.5 w-max mx-auto uppercase text-[9px] ${stage?.color} ${stage?.bg} ${stage?.border}`}><stage.icon size={12}/> {stage?.label}</span>
                          </td>
                          <td className="py-5 px-6 text-center align-middle">
                             <button className="p-2 bg-white border border-[#f3f3f1] text-[#7a8b95] hover:bg-[#212c46] hover:text-white rounded-xl shadow-sm transition-all"><ArrowUpRight size={16} strokeWidth={2.5}/></button>
                          </td>
                        </tr>
                      )})}
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
        </main>
      </div>
  );
}
