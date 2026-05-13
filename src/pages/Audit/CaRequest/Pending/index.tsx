import React, { useState, useMemo, useEffect } from 'react';
import {
  Search, Kanban, List, LayoutDashboard, ChevronLeft, ChevronRight, X,
  Clock, Eye, HelpCircle, ShieldAlert, ShieldCheck, Users, Activity, CheckSquare, MessageSquareDiff, AlertOctagon, Target,
  FileStack, HardDriveDownload, CalendarDays, CheckCircle2, AlertTriangle, XCircle, Info, RefreshCw, ArrowRight,
  PieChart as PieChartIcon, ArrowUpRight, Plus
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell
} from 'recharts';

const KANBAN_STAGES = [
  { id: 'issued', label: 'AWAITING RESPONSE', icon: Clock, color: 'text-[#b58c4f]', bg: 'bg-[#b58c4f]/10', border: 'border-[#b58c4f]/30' },
  { id: 'responded', label: 'AWAITING VERIFICATION', icon: ShieldCheck, color: 'text-[#3f809e]', bg: 'bg-[#3f809e]/10', border: 'border-[#3f809e]/30' },
  { id: 'verifying', label: 'VERIFICATION IN PROGRESS', icon: Activity, color: 'text-[#657f4d]', bg: 'bg-[#657f4d]/10', border: 'border-[#657f4d]/30' },
  { id: 'overdue', label: 'OVERDUE CARs', icon: AlertTriangle, color: 'text-[#932c2e]', bg: 'bg-[#932c2e]/10', border: 'border-[#932c2e]/30' },
];

const PENDING_CARS = [
  { id: 'CAR 26/001', source: 'External Audit', ncLevel: 'Minor', subject: 'Labeling Mismatch on Export Lot #202', dept: 'Warehouse', requester: 'Customer SVC', issueDate: '12 FEB 2026', due: '26 FEB 2026', status: 'issued', aging: 3 },
  { id: 'CAR 26/002', source: 'Internal Audit', ncLevel: 'Major', subject: 'Missing Inspector Signature', dept: 'QA/QC', requester: 'Internal Auditor', issueDate: '10 FEB 2026', due: '24 FEB 2026', status: 'responded', aging: 5 },
  { id: 'CAR 26/004', source: 'System Failure', ncLevel: 'Major', subject: 'Late Calibration of Equipment', dept: 'Engineering', requester: 'QA Manager', issueDate: '01 FEB 2026', due: '10 FEB 2026', status: 'overdue', aging: 15 },
  { id: 'CAR 26/005', source: 'Internal Audit', ncLevel: 'Major', subject: 'Unauthorized software installed', dept: 'IT', requester: 'IT Auditor', issueDate: '11 FEB 2026', due: '18 FEB 2026', status: 'verifying', aging: 4 },
  { id: 'CAR 26/006', source: 'External Audit', ncLevel: 'Minor', subject: 'Customer complaint: Damaged Box', dept: 'Warehouse', requester: 'CB Auditor', issueDate: '08 FEB 2026', due: '15 FEB 2026', status: 'overdue', aging: 7 },
  { id: 'CAR 26/007', source: 'Internal Audit', ncLevel: 'Minor', subject: 'Unclear work instruction for machine B', dept: 'Production', requester: 'Internal Auditor', issueDate: '14 FEB 2026', due: '28 FEB 2026', status: 'issued', aging: 1 },
];

const SIMPLE_BAR_DATA_DEPT = [
  { dept: 'Warehouse', count: 2 },
  { dept: 'Engineering', count: 1 },
  { dept: 'IT', count: 1 },
  { dept: 'QA/QC', count: 1 },
  { dept: 'Production', count: 1 },
];

const PIE_DATA_LEVEL = [
  { name: 'Critical', count: 0, fill: '#8b2c3d' },
  { name: 'Major', count: 3, fill: '#d96245' },
  { name: 'Minor', count: 3, fill: '#b58c4f' },
  { name: 'OFI', count: 0, fill: '#657f4d' },
];

const ReviewActionModal = ({ isOpen, onClose, data }) => {
  const [remarks, setRemarks] = useState('');
  if (!isOpen || !data) return null;

  const isFinalStage = data.status === 'responded' || data.status === 'verifying';
  const actionLabel = isFinalStage ? 'Verify CAR (Auditor)' : 'Respond CAR (Auditee)';

  return (
    <div className="fixed inset-0 z-[500] flex justify-center items-center p-4">
      <div className="absolute inset-0 bg-[#212c46]/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border-2 border-[#b7a159] relative z-10 animate-fade">
        <div className="px-6 py-5 bg-[#212c46] text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="p-1.5 bg-white/10 rounded-lg">
               <CheckSquare size={18} className="text-[#b7a159]"/>
             </div>
             <h3 className="text-[13px] font-black tracking-widest uppercase font-mono flex items-center gap-2 leading-none">Review Action: {data.id}</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors"><X size={18}/></button>
        </div>
        <div className="p-8 space-y-6 text-[#212c46]">
          <div className="grid grid-cols-2 gap-6 bg-[#f3f3f1] p-6 rounded-xl border border-[#f3f3f1]">
            <div className="col-span-2"><p className="text-[10px] font-black text-[#7a8b95] uppercase font-mono mb-1">Subject / Description</p><p className="font-bold text-[13px] leading-relaxed">{data.subject}</p></div>
            <div>
              <p className="text-[10px] font-black text-[#7a8b95] uppercase font-mono mb-1">NC Level / Source</p>
              <div className="font-black text-[#932c2e] text-[14px] font-mono bg-white px-3 py-1.5 rounded-lg border border-[#f3f3f1] shadow-sm w-fit">
                {data.ncLevel} <span className="text-[10px] text-[#748ea1] uppercase ml-2 tracking-widest px-2 py-0.5 bg-[#f3f3f1] rounded border border-[#f3f3f1]">{data.source}</span>
              </div>
            </div>
            <div><p className="text-[10px] font-black text-[#7a8b95] uppercase font-mono mb-1">Auditee Dept.</p><p className="font-bold text-[12px] uppercase">{data.dept} <span className="text-[10px] text-[#7a8b95]">({data.requester})</span></p></div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-[#7a8b95] uppercase tracking-widest font-mono">Internal Memo / Notes</label>
            <textarea 
              rows={3} 
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full bg-[#f3f3f1] border border-[#f3f3f1] rounded-xl px-4 py-3 text-[12px] font-bold focus:outline-none focus:border-[#b7a159] transition-all shadow-sm" 
              placeholder="Internal notes for this review..."
            ></textarea>
          </div>
        </div>
        <div className="p-6 bg-[#f3f3f1] border-t border-[#f3f3f1] flex flex-col-reverse sm:flex-row justify-between items-center gap-4">
          <button onClick={onClose} className="px-6 py-2.5 font-bold text-[#7a8b95] hover:bg-[#f3f3f1] rounded-xl transition-colors uppercase tracking-widest font-mono text-[10px] w-full sm:w-auto">Close</button>
          <div className="flex items-center gap-3 w-full sm:w-auto">
             <button onClick={() => onClose()} className={`flex-1 sm:flex-none px-8 py-2.5 bg-[#932c2e] hover:bg-[#851c24] text-white font-black rounded-xl uppercase font-mono text-[11px] transition-colors flex items-center justify-center gap-2 shadow-md`}>
                <RefreshCw size={14}/> {actionLabel}
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const DashboardView = () => {
  return (
    <div className="flex flex-col gap-6 animate-fade pb-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {KANBAN_STAGES.map((stage, idx) => {
          const count = PENDING_CARS.filter(c => c.status === stage.id).length;
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
            <div className="flex justify-between items-center mb-6 border-b border-[#eaeaec] pb-4">
               <h4 className="text-[12px] font-black text-[#212c46] uppercase tracking-widest font-mono flex items-center gap-2">
                 <Users size={18} className="text-[#3f809e]" /> Pending By Department
               </h4>
            </div>
            <div className="flex-1 w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={SIMPLE_BAR_DATA_DEPT} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f3f1" />
                     <XAxis dataKey="dept" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#7a8b95', fontWeight: 'bold' }} dy={10}/>
                     <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#212c46', fontWeight: 'bold' }} />
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
            <div className="flex justify-between items-center mb-6 border-b border-[#eaeaec] pb-4">
               <h4 className="text-[12px] font-black text-[#212c46] uppercase tracking-widest font-mono flex items-center gap-2">
                 <Target size={18} className="text-[#b58c4f]" /> NC Level
               </h4>
            </div>
            <div className="flex-1 relative flex items-center justify-center min-h-[200px]">
               <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={PIE_DATA_LEVEL} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={5} dataKey="count" stroke="none">
                      {PIE_DATA_LEVEL.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
               </ResponsiveContainer>
               <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                 <span className="text-3xl font-black text-[#212c46] font-mono">6</span>
                 <span className="text-[10px] text-[#7a8b95] font-bold uppercase tracking-widest mt-1">Total</span>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

const QueueBoardView = ({ data, onReview }: any) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-full pb-8 items-stretch animate-fade">
    {KANBAN_STAGES.map(stage => {
      const items = data.filter((d:any) => d.status === stage.id);
      return (
        <div key={stage.id} className="flex flex-col h-full min-h-0 bg-white/40 rounded-2xl border border-white p-2">
          <div className={`p-4 flex items-center justify-between mb-2`}>
            <div className="flex items-center gap-2">
               <stage.icon size={16} className={stage.color} />
               <span className={`text-[10px] font-black uppercase tracking-widest ${stage.color} font-mono`}>{stage.label}</span>
            </div>
            <span className={`bg-white px-2 py-0.5 rounded text-[10px] font-black shadow-sm border ${stage.border} ${stage.color} font-mono`}>{items.length}</span>
          </div>
          <div className={`overflow-y-auto custom-scrollbar flex flex-col gap-3 flex-1`}>
              {items.map((item:any) => (
                  <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-[#f3f3f1] hover:border-[#b7a159] transition-all group flex flex-col cursor-pointer" onClick={() => onReview(item)}>
                    <div className="flex justify-between items-start mb-3">
                       <span className="text-[10px] font-black text-[#932c2e] font-mono bg-[#f3f3f1] px-2 py-1 rounded border border-[#f3f3f1] flex items-center gap-1"><FileStack size={12}/>{item.id}</span>
                       {item.aging > 3 && <span className="flex items-center gap-1 text-[#932c2e] bg-[#932c2e]/10 px-2 py-0.5 rounded border border-[#932c2e]/30 text-[9px] font-black uppercase font-mono animate-pulse"><AlertTriangle size={10}/> {item.aging}D Overdue</span>}
                    </div>
                    <h4 className="text-[12px] font-black text-[#212c46] leading-snug mb-2 line-clamp-2">{item.subject}</h4>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      <span className="text-[9px] bg-[#f3f3f1] text-[#7a8b95] border border-[#eaeaec] px-1.5 py-0.5 rounded uppercase font-bold">{item.source}</span>
                      <span className={`px-1.5 py-0.5 rounded font-black text-[9px] uppercase tracking-widest font-mono border ${
                         item.ncLevel === 'Critical' ? 'bg-[#8b2c3d]/10 text-[#8b2c3d] border-[#8b2c3d]/30' :
                         item.ncLevel === 'Major' ? 'bg-[#d96245]/10 text-[#d96245] border-[#d96245]/30' :
                         item.ncLevel === 'Minor' ? 'bg-[#b58c4f]/10 text-[#b58c4f] border-[#b58c4f]/30' :
                         'bg-[#657f4d]/10 text-[#657f4d] border-[#657f4d]/30'
                       }`}>{item.ncLevel}</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-[#f3f3f1] pt-3 mt-auto">
                       <span className="text-[10px] font-black text-[#7a8b95] uppercase font-mono tracking-widest">{item.dept}</span>
                       <button className="text-[#7a8b95] group-hover:text-[#932c2e] transition-colors bg-[#f3f3f1] p-1 rounded-md"><ArrowUpRight size={14} strokeWidth={2.5}/></button>
                    </div>
                  </div>
              ))}
          </div>
        </div>
      );
    })}
  </div>
);

const TableListView = ({ data, search, setSearch, currentPage, setCurrentPage, itemsPerPage, setItemsPerPage, onReview }: any) => {
  const filteredData = useMemo(() => data.filter((d:any) => d.subject.toLowerCase().includes(search.toLowerCase()) || d.id.toLowerCase().includes(search.toLowerCase())), [data, search]);
  const currentData = useMemo(() => { const start = (currentPage - 1) * itemsPerPage; return filteredData.slice(start, start + itemsPerPage); }, [filteredData, currentPage, itemsPerPage]);

  return (
    <div className="bg-white/90 rounded-2xl border border-[#f3f3f1] shadow-sm overflow-hidden flex flex-col mx-0 mb-8 animate-fade">
      <div className="p-4 bg-white flex flex-col md:flex-row justify-between items-center gap-4 shrink-0 border-b border-[#f3f3f1]">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-2.5 text-[#7a8b95]" size={16} />
            <input type="text" placeholder="Search CAR No or Subject..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 pr-4 py-2 bg-[#f3f3f1] border border-[#f3f3f1] rounded-lg w-full text-[12px] font-bold outline-none focus:border-[#b7a159] font-mono transition-all shadow-sm"/>
          </div>
      </div>
      <div className="overflow-x-auto relative w-full bg-white pb-4">
        <table className="w-full text-left border-collapse min-w-[1300px]">
          <thead className="bg-[#212c46] border-b-[3px] border-[#b58c4f] sticky top-0 z-10 text-white font-mono text-[10px] uppercase tracking-widest">
            <tr>
               <th className="py-4 px-4 pl-8 w-[280px]">CAR Ref & Subject</th>
               <th className="py-4 px-4 text-center">Source & Level</th>
               <th className="py-4 px-4 text-center">Auditee Dept.</th>
               <th className="py-4 px-4 text-center">Issue/Due Date</th>
               <th className="py-4 px-4 text-center">Current Stage</th>
               <th className="py-4 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f3f3f1]">
            {currentData.map((item:any) => {
              const stage = KANBAN_STAGES.find(s => s.id === item.status);
              return (
              <tr key={item.id} className="hover:bg-[#f3f3f1] transition-colors h-16 group text-[#212c46]">
                <td className="py-4 px-4 pl-8">
                   <div className="flex items-center gap-2 mb-1">
                     <FileStack size={14} className="text-[#932c2e]" strokeWidth={2.5}/>
                     <span className="font-extrabold text-[#932c2e] font-mono text-[12px]">{item.id}</span>
                   </div>
                   <p className="font-bold text-[12px] leading-snug pl-6">{item.subject}</p>
                </td>
                <td className="py-4 px-4 text-center flex flex-col items-center gap-1.5 pt-5">
                    <span className="text-[9px] bg-[#f3f3f1] text-[#7a8b95] border border-[#eaeaec] px-2 py-0.5 rounded uppercase font-bold">{item.source}</span>
                    <span className={`px-2.5 py-0.5 rounded font-black border text-[10px] uppercase tracking-widest font-mono whitespace-nowrap ${
                      item.ncLevel === 'Critical' ? 'bg-[#8b2c3d]/10 text-[#8b2c3d] border-[#8b2c3d]/30' :
                      item.ncLevel === 'Major' ? 'bg-[#d96245]/10 text-[#d96245] border-[#d96245]/30' :
                      item.ncLevel === 'Minor' ? 'bg-[#b58c4f]/10 text-[#b58c4f] border-[#b58c4f]/30' :
                      'bg-[#657f4d]/10 text-[#657f4d] border-[#657f4d]/30'
                    }`}>{item.ncLevel}</span>
                </td>
                <td className="py-4 px-4 text-center font-extrabold text-[#748ea1] uppercase font-mono text-[11px]">{item.dept}</td>
                <td className="py-4 px-4 text-center">
                   <p className="text-[#748b9e] font-bold font-mono text-[11px]">{item.issueDate}</p>
                   <p className="text-[#212c46] font-bold font-mono text-[11px] mt-1">{item.due}</p>
                </td>
                <td className="py-4 px-4 text-center">
                    <span className={`px-2.5 py-1 rounded-lg font-black font-mono border flex items-center justify-center gap-1.5 w-max mx-auto uppercase text-[9px] ${stage?.color} ${stage?.bg} ${stage?.border}`}><span className="w-3 h-3 flex items-center justify-center">{stage && <stage.icon size={10}/>}</span> {stage?.label}</span>
                </td>
                <td className="py-4 px-4 text-center">
                   <button onClick={() => onReview(item)} className="p-1.5 bg-white border border-[#f3f3f1] text-[#7a8b95] hover:bg-[#932c2e] hover:text-white rounded shadow-sm transition-all"><ArrowUpRight size={14} strokeWidth={2.5}/></button>
                </td>
              </tr>
            )})}
          </tbody>
        </table>
      </div>
      <div className="p-4 bg-[#f3f3f1] border-t border-[#f3f3f1] flex justify-between items-center text-[#7a8b95] uppercase font-mono text-[10px] font-bold">
         <div>Page {currentPage} | Showing {currentData.length} of {filteredData.length} records</div>
         <div className="flex gap-2">
            <button onClick={() => setCurrentPage(Math.max(1, currentPage-1))} disabled={currentPage === 1} className="p-1.5 border rounded hover:bg-[#f3f3f1] disabled:opacity-50"><ChevronLeft size={14}/></button>
            <button onClick={() => setCurrentPage(currentPage+1)} disabled={currentData.length < itemsPerPage} className="p-1.5 border rounded hover:bg-[#f3f3f1] disabled:opacity-50"><ChevronRight size={14}/></button>
         </div>
      </div>
    </div>
  );
};

export default function Pending() {
  const [activeTab, setActiveTab] = useState('kanban'); 
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);

  const TABS = [
    { id: 'dashboard', label: 'SUMMARY', icon: LayoutDashboard },
    { id: 'kanban', label: 'MY APPROVALS', icon: CheckCircle2 },
    { id: 'list', label: 'LIST VIEW', icon: List }
  ];

  return (
      <div className="flex flex-col min-h-0 w-full text-[#212c46] bg-transparent overflow-x-hidden relative font-sans">

        <div className="px-8 pt-3 pb-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shrink-0 no-print animate-fade">
          <div className="flex items-center gap-5 shrink-0">
            <div className="relative flex items-center justify-center group cursor-default shrink-0">
               <div className="absolute inset-0 bg-[#d96245] blur-[15px] opacity-20 rounded-full group-hover:opacity-60 transition-all duration-700"></div>
               <div className="relative z-10 p-1.5 border border-[#d96245]/40 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm">
                   <ShieldAlert size={28} strokeWidth={2.5} className="text-[#d96245]" />
               </div>
            </div>
            <div className="flex flex-col justify-center leading-none">
              <h1 className="text-[24px] font-black tracking-tighter flex gap-2.5 uppercase font-mono text-[#212c46]">
                CAR PENDING <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d96245] to-[#b58c4f]">APPROVALS</span>
              </h1>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] mt-0.5 text-[#7a8b95] font-mono leading-none">รายการรอดำเนินการ CA/PA</p>
            </div>
          </div>
          
          <div className="bg-white/50 p-1.5 rounded-xl border border-[#f3f3f1] shadow-inner flex flex-wrap items-center gap-1">
            {TABS.map(tab => (
               <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2 rounded-lg font-black uppercase tracking-widest flex items-center gap-2 transition-all font-mono text-[12px] relative ${
                  activeTab === tab.id ? 'bg-[#212c46] text-[#d7d7d7] shadow-md' : 'text-[#7a8b95] hover:text-[#932c2e]'
                }`}
               >
                <tab.icon size={14}/> {tab.label}
                {tab.id === 'kanban' && PENDING_CARS.length > 0 && (
                  <div className="absolute -top-1.5 -right-1.5 bg-[#932c2e] text-white text-[9px] min-w-[16px] h-[16px] px-1 flex items-center justify-center rounded-full shadow-sm font-black">
                    {PENDING_CARS.length}
                  </div>
                )}
               </button>
            ))}
          </div>
        </div>

        <main className="flex-1 w-full px-8 pb-10 flex flex-col min-h-0 overflow-y-auto custom-scrollbar">
           {activeTab === 'dashboard' && <DashboardView />}
           {activeTab === 'kanban' && <QueueBoardView data={PENDING_CARS} onReview={(car:any)=>{setSelectedCar(car); setIsActionModalOpen(true);}} />}
           {activeTab === 'list' && <TableListView data={PENDING_CARS} search={search} setSearch={setSearch} currentPage={currentPage} setCurrentPage={setCurrentPage} itemsPerPage={itemsPerPage} setItemsPerPage={setItemsPerPage} onReview={(car:any)=>{setSelectedCar(car); setIsActionModalOpen(true);}} />}
        </main>

        <ReviewActionModal isOpen={isActionModalOpen} onClose={() => setIsActionModalOpen(false)} data={selectedCar} />
      </div>
  );
}
