import React, { useState, useMemo, useEffect } from 'react';
import { Search, Plus, Eye, ChevronLeft, ChevronRight, Filter, Users, CheckCircle, Clock, AlertTriangle, HelpCircle, X, LayoutDashboard, List, ShieldAlert, Globe, ServerCrash, ShieldCheck, Activity, CheckCircle2, Lightbulb, TrendingUp, ArrowDownRight, FileText, Network, FileDown, Trash2, Printer, QrCode, ChevronDown, RefreshCw, HardDriveDownload, Info, FileStack } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, ComposedChart, Line } from 'recharts';

const INITIAL_CARS = [
  { id: 'CAR 26/001', subject: 'Labeling Mismatch on Lot #202', source: 'External Audit', ncLevel: 'Minor', dept: 'Warehouse', standard: 'ISO 9001:2015', issueDate: '2026-02-12', targetDate: '2026-02-26', status: 'Open' },
  { id: 'CAR 26/002', subject: 'Missing Inspector Signature', source: 'Internal Audit', ncLevel: 'Major', dept: 'QA/QC', standard: 'ISO 9001:2015', issueDate: '2026-02-10', targetDate: '2026-02-24', status: 'Responded' },
  { id: 'CAR 26/003', subject: 'Expired Fire Extinguishers', source: 'Internal Audit', ncLevel: 'Critical', dept: 'Safety', standard: 'ISO 45001:2018', issueDate: '2026-01-15', targetDate: '2026-01-20', status: 'Closed' },
  { id: 'CAR 26/004', subject: 'Late Calibration of Equipment', source: 'System Failure', ncLevel: 'Major', dept: 'Engineering', standard: 'ISO 9001:2015', issueDate: '2026-02-01', targetDate: '2026-02-10', status: 'Overdue' },
  { id: 'PAR 26/001', subject: 'Potential leak in cooling pipe A', source: 'OFI', ncLevel: 'OFI', dept: 'Production', standard: 'ISO 14001:2015', issueDate: '2026-02-05', targetDate: '2026-03-05', status: 'Closed' }
];

const SOURCES = ['ALL', 'Internal Audit', 'External Audit', 'System Failure', 'OFI'];
const DEPTS = ['ALL', 'Management', 'Production', 'QA/QC', 'Purchasing', 'IT', 'Safety', 'Engineering', 'Warehouse'];

const DEPT_CHART_DATA = [
  { name: 'Production', value: 35, color: '#657f4d' },
  { name: 'QA/QC', value: 25, color: '#3f809e' },
  { name: 'Engineering', value: 15, color: '#932c2e' },
  { name: 'Warehouse', value: 15, color: '#b58c4f' },
  { name: 'Safety', value: 10, color: '#d96245' },
];

const SOURCE_CHART_DATA = [
  { name: 'Internal Audit', count: 45, fill: '#932c2e' },
  { name: 'External Audit', count: 25, fill: '#3f809e' },
  { name: 'System Failure', count: 15, fill: '#d96245' },
  { name: 'OFI', count: 15, fill: '#508660' },
];

const TREND_CHART_DATA = [
  { month: 'Jan 26', issued: 30, closed: 22, prevYear: 20 },
  { month: 'Feb 26', issued: 18, closed: 12, prevYear: 15 },
  { month: 'Mar 26', issued: 10, closed: 8, prevYear: 12 },
  { month: 'Apr 26', issued: 5, closed: 4, prevYear: 10 },
];

const LineSparkline = ({ points, color }) => {
  if (!points || points.length < 2) return null;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = (max - min) || 1;
  const width = 100;
  const height = 25;
  const step = width / (points.length - 1);
  const pathData = points.map((p, i) => {
    const x = i * step;
    const y = height - ((p - min) / range) * height;
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      <path d={pathData} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

const StatusBadge = ({ status }) => {
  const styles = {
    'Open': 'bg-[#f3f3f1] text-[#b58c4f] border-[#b7a159]',
    'Responded': 'bg-[#f3f3f1] text-[#3f809e] border-[#4d87a8]',
    'Closed': 'bg-[#f3f3f1] text-[#508660] border-[#508660]',
    'Overdue': 'bg-[#f3f3f1] text-[#932c2e] border-[#d96245]'
  };
  const icons = {
    'Open': <Clock size={12} />,
    'Responded': <ShieldCheck size={12} />,
    'Closed': <CheckCircle size={12} />,
    'Overdue': <AlertTriangle size={12} />
  };
  return (
    <span className={`px-2 py-0.5 rounded font-extrabold border text-[11px] uppercase tracking-widest flex items-center gap-1.5 w-max font-mono shadow-sm ${styles[status] || styles['Open']}`}>
      {icons[status]} {status}
    </span>
  );
};

const SourceBadge = ({ type }) => {
  const styles = {
    'Internal Audit': 'bg-[#932c2e]/10 text-[#932c2e] border-[#932c2e]/30',
    'External Audit': 'bg-[#3f809e]/10 text-[#3f809e] border-[#3f809e]/30',
    'System Failure': 'bg-[#d96245]/10 text-[#d96245] border-[#d96245]/30',
    'OFI': 'bg-[#508660]/10 text-[#508660] border-[#508660]/30',
  };
  return (
    <span className={`px-2 py-0.5 rounded font-black border text-[11px] uppercase tracking-widest font-mono whitespace-nowrap w-max ${styles[type] || 'bg-[#7a8b95]/10 text-[#7a8b95] border-[#7a8b95]/30'}`}>
      {type}
    </span>
  );
};

const Pagination = ({ currentPage, totalItems, itemsPerPage, onPageChange, onItemsPerPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  return (
    <div className="p-4 bg-[#f3f3f1]/80 backdrop-blur-sm border-t border-[#f3f3f1] flex justify-between items-center font-bold text-[#7a8b95] uppercase tracking-widest mt-auto shrink-0 font-mono text-[10px]">
      <div className="flex items-center gap-4">
         <div className="flex items-center gap-2">
            <span>Show:</span>
            <select 
               value={itemsPerPage} 
               onChange={(e) => onItemsPerPageChange(Number(e.target.value))} 
               className="bg-white border border-[#f3f3f1] rounded-md px-1 py-0.5 outline-none focus:border-[#212c46] text-[#212c46] cursor-pointer"
            >
               <option value={10}>10</option>
               <option value={20}>20</option>
               <option value={50}>50</option>
            </select>
         </div>
         <div>Total {totalItems} Items <span className="text-[#f3f3f1] mx-2">|</span> Page {currentPage} of {totalPages}</div>
      </div>
      <div className="flex gap-2">
        <button onClick={() => onPageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className={`p-1.5 border border-[#f3f3f1] rounded-lg transition-colors ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white text-[#212c46]'}`}><ChevronLeft size={16}/></button>
        <button onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages || totalPages === 0} className={`p-1.5 border border-[#f3f3f1] rounded-lg transition-colors ${currentPage === totalPages || totalPages === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white text-[#212c46]'}`}><ChevronRight size={16}/></button>
      </div>
    </div>
  );
};

export default function CarLog() {
  const [activeTab, setActiveTab] = useState('log'); 
  const [activeDept, setActiveDept] = useState('ALL');
  const [activeSource, setActiveSource] = useState('ALL');
  const [search, setSearch] = useState('');
  const [selectedYear, setSelectedYear] = useState('2026'); 
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); 
  
  useEffect(() => { setCurrentPage(1); }, [activeDept, activeSource, search, itemsPerPage, selectedYear]); 

  const filteredData = useMemo(() => {
    return INITIAL_CARS.filter(d => {
      return (activeDept === 'ALL' || d.dept === activeDept) && 
             (activeSource === 'ALL' || d.source === activeSource) && 
             (d.id.toLowerCase().includes(search.toLowerCase()) || d.subject.toLowerCase().includes(search.toLowerCase())) &&
             d.issueDate.startsWith(selectedYear);
    });
  }, [search, activeDept, activeSource, selectedYear]); 
  
  const currentData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  return (
    <div className="flex flex-1 flex-col min-h-0 w-full text-[#212c46] bg-transparent relative font-sans">
        
        {/* NEW HEADER - MATCHING USER PERMISSION STYLE */}
        <div className="px-8 pt-3 pb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 z-20 shrink-0">
            <div className="flex items-center gap-5">
                <div className="relative flex items-center justify-center group cursor-default shrink-0">
                    <div className="absolute inset-0 bg-[#3f809e] blur-[15px] opacity-20 rounded-full group-hover:opacity-60 transition-all duration-700"></div>
                    <div className="relative z-10 p-1.5 border border-[#3f809e]/40 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm">
                        <Activity size={28} strokeWidth={2.5} className="text-[#3f809e]" />
                    </div>
                </div>
                <div>
                    <h3 className="font-black text-[#212c46] uppercase tracking-tighter leading-none" style={{ fontSize: '24px' }}>
                        CAR <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3f809e] to-[#b58c4f]">LOG</span>
                    </h3>
                    <p className="text-[11px] font-bold text-[#4d5a44] uppercase tracking-[0.2em] mt-0.5 opacity-80 leading-none">
                        ทะเบียนประวัติการแก้ไขข้อบกพร่อง
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-[#f3f3f1] px-4 h-[46px] rounded-xl shadow-sm">
                   <span className="text-[12px] font-black text-[#7a8b95] uppercase tracking-widest font-mono">Year:</span>
                   <select 
                     value={selectedYear} 
                     onChange={(e) => setSelectedYear(e.target.value)}
                     className="bg-transparent font-black text-[#212c46] outline-none cursor-pointer font-mono text-[12px]"
                   >
                     <option value="2025">2025</option>
                     <option value="2026">2026</option>
                   </select>
                </div>

                <div className="bg-white/50 p-1.5 rounded-xl border border-[#f3f3f1] shadow-inner flex flex-wrap items-center gap-1">
                  <button 
                    onClick={() => setActiveTab('log')}
                    className={`px-5 py-2 flex items-center gap-2 font-black text-[12px] uppercase tracking-widest transition-all rounded-lg ${
                      activeTab === 'log' 
                        ? 'bg-[#212c46] text-[#d7d7d7] shadow-md' 
                        : 'text-[#7a8b95] hover:text-[#932c2e]'
                    }`}
                  >
                    <List size={16} /> CAR Log
                  </button>
                  <button 
                    onClick={() => setActiveTab('dashboard')}
                    className={`px-5 py-2 flex items-center gap-2 font-black text-[12px] uppercase tracking-widest transition-all rounded-lg ${
                      activeTab === 'dashboard' 
                        ? 'bg-[#212c46] text-[#d7d7d7] shadow-md' 
                        : 'text-[#7a8b95] hover:text-[#932c2e]'
                    }`}
                  >
                    <LayoutDashboard size={16} /> Dashboard
                  </button>
                </div>
            </div>
        </div>

        <main className="flex-1 w-full max-w-[1600px] px-8 pb-8 pt-0 no-print">
           {activeTab === 'log' && (
             <div className="bg-white border border-[#f3f3f1] shadow-sm rounded-2xl overflow-hidden flex flex-col h-[calc(100vh-140px)]">
               
               <div className="p-4 bg-white flex flex-col md:flex-row justify-between items-center gap-4 shrink-0 border-b border-[#f3f3f1]">
                  <div className="flex items-center gap-3">
                     <div className="relative flex items-center bg-[#f3f3f1] px-4 py-2 rounded-xl border border-[#eaeaec] transition-colors shadow-sm">
                        <Filter size={14} className="text-[#7a8b95] mr-2"/>
                        <span className="text-[10px] text-[#7a8b95] font-extrabold uppercase tracking-widest font-mono">Source:</span>
                        <div className="relative flex items-center ml-2">
                          <select value={activeSource} onChange={(e)=>setActiveSource(e.target.value)} className="appearance-none bg-transparent font-black text-[#932c2e] outline-none cursor-pointer uppercase font-mono text-[11px] pr-5 pl-1">
                            {SOURCES.map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                          <ChevronDown size={14} className="text-[#932c2e] absolute right-0 pointer-events-none" strokeWidth={3} />
                        </div>
                     </div>
                     <div className="relative flex items-center bg-[#f3f3f1] px-4 py-2 rounded-xl border border-[#eaeaec] transition-colors shadow-sm">
                        <Users size={14} className="text-[#7a8b95] mr-2"/>
                        <span className="text-[10px] text-[#7a8b95] font-extrabold uppercase tracking-widest font-mono">Dept:</span>
                        <div className="relative flex items-center ml-2">
                          <select value={activeDept} onChange={(e)=>setActiveDept(e.target.value)} className="appearance-none bg-transparent font-black text-[#212c46] outline-none cursor-pointer uppercase font-mono text-[11px] pr-5 pl-1">
                            {DEPTS.map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                          <ChevronDown size={14} className="text-[#212c46] absolute right-0 pointer-events-none" strokeWidth={3} />
                        </div>
                     </div>
                  </div>
                  
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-80">
                      <Search className="absolute left-3 top-2.5 text-[#7a8b95]" size={16} />
                      <input type="text" placeholder="Search CAR No or Subject..." value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-[#f3f3f1] border border-[#f3f3f1] rounded-lg pl-10 pr-4 py-2 font-medium focus:outline-none focus:border-[#212c46] focus:ring-1 focus:ring-[#212c46] transition-all font-mono text-sm text-[#212c46]"/>
                    </div>
                    <button className="px-4 py-2 bg-[#932c2e] text-white rounded-lg shadow-md hover:bg-[#851c24] transition-all flex items-center gap-2 font-black text-[11px] uppercase tracking-widest">
                      <Plus size={16}/> NEW CAR
                    </button>
                  </div>
               </div>

               <div className="overflow-x-auto custom-scrollbar flex-1 bg-white">
                  <table className="w-full text-left border-collapse min-w-[1300px]">
                    <thead className="bg-[#212c46] text-white border-b-[3px] border-[#b58c4f] sticky top-0 z-10">
                      <tr className="font-black uppercase tracking-widest text-[12px] font-mono">
                        <th className="py-4 px-4 pl-8 w-[300px]">CAR Ref & Subject</th>
                        <th className="py-4 px-4">Source & Standard</th>
                        <th className="py-4 px-4 text-center">NC Level</th>
                        <th className="py-4 px-4 text-center">Auditee Dept.</th>
                        <th className="py-4 px-4 text-center">Dates</th>
                        <th className="py-4 px-4 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f3f3f1]">
                      {currentData.length > 0 ? currentData.map(car => (
                        <tr key={car.id} className="hover:bg-[#f3f3f1] transition-colors">
                          <td className="py-3 px-4 pl-8">
                             <div className="flex items-center gap-2 mb-1">
                               <FileStack size={14} className="text-[#932c2e]" strokeWidth={2.5}/>
                               <span className="font-extrabold text-[#932c2e] font-mono text-[12px]">{car.id}</span>
                             </div>
                             <p className={`font-semibold text-[12px] pl-6 ${car.status === 'Closed' ? 'text-[#7a8b95]' : 'text-[#414757]'}`}>{car.subject}</p>
                          </td>
                          <td className="py-3 px-4">
                             <div className="flex flex-col gap-1.5 items-start">
                               <SourceBadge type={car.source} />
                               <span className="font-black text-[#748ea1] font-mono text-[11px] bg-white border border-[#f3f3f1] px-2 py-0.5 rounded w-max">{car.standard}</span>
                             </div>
                          </td>
                          <td className="py-3 px-4 text-center">
                             <span className={`font-black uppercase tracking-wider text-[11px] ${car.ncLevel === 'Critical' ? 'text-[#932c2e]' : car.ncLevel === 'Major' ? 'text-[#d96245]' : car.ncLevel === 'Minor' ? 'text-[#b7a159]' : 'text-[#508660]'}`}>{car.ncLevel}</span>
                          </td>
                          <td className="py-3 px-4 text-center">
                             <p className="font-extrabold text-[#748ea1] uppercase tracking-wider font-mono text-[12px]">{car.dept}</p>
                          </td>
                          <td className="py-3 px-4 text-center">
                              <p className="text-[#748ea1] font-bold font-mono text-[11px]">{car.issueDate}</p>
                              <p className="text-[#212c46] font-bold font-mono text-[11px] mt-1">{car.targetDate}</p>
                          </td>
                          <td className="py-3 px-4 text-center">
                             <div className="flex justify-center"><StatusBadge status={car.status} /></div>
                          </td>
                        </tr>
                      )) : (<tr><td colSpan="6" className="p-10 text-center text-[#7a8b95]">No CAR records found.</td></tr>)}
                    </tbody>
                  </table>
               </div>
               
               <Pagination currentPage={currentPage} totalItems={filteredData.length} itemsPerPage={itemsPerPage} onPageChange={setCurrentPage} onItemsPerPageChange={setItemsPerPage} />
             </div>
           )}

           {activeTab === 'dashboard' && (
             <div className="flex flex-col gap-6 pb-10 w-full mt-4">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="bg-white/90 rounded-3xl p-8 shadow-sm border border-[#eaeaec] flex flex-col h-[350px]">
                   <h4 className="text-[12px] font-black text-[#212c46] uppercase tracking-widest mb-4 flex items-center justify-center font-mono"><FileText size={18} className="text-[#932c2e] mr-2"/> CARs By Source</h4>
                   <div className="flex-1 min-h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                         <PieChart>
                           <Pie data={SOURCE_CHART_DATA} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={2} dataKey="count" stroke="none">
                             {SOURCE_CHART_DATA.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                           </Pie>
                           <RechartsTooltip cursor={{fill: '#f3f3f1'}} />
                         </PieChart>
                      </ResponsiveContainer>
                   </div>
                 </div>
                 <div className="bg-white/90 rounded-3xl p-8 shadow-sm border border-[#eaeaec] flex flex-col h-[350px]">
                   <h4 className="text-[12px] font-black text-[#212c46] uppercase tracking-widest mb-4 flex items-center justify-center font-mono"><Users size={18} className="text-[#3f809e] mr-2"/> CARs By Dept.</h4>
                   <div className="flex-1 min-h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                         <PieChart>
                           <Pie data={DEPT_CHART_DATA} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={2} dataKey="value" stroke="none">
                             {DEPT_CHART_DATA.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                           </Pie>
                           <RechartsTooltip cursor={{fill: '#f3f3f1'}} />
                         </PieChart>
                      </ResponsiveContainer>
                   </div>
                 </div>
               </div>
               
               <div className="bg-white/90 rounded-3xl p-8 shadow-sm border border-[#f3f3f1]">
                  <h4 className="text-[12px] font-black text-[#212c46] uppercase tracking-widest mb-6 font-mono flex items-center"><TrendingUp size={18} className="text-[#b58c4f] mr-2"/> Monthly trend</h4>
                  <div className="h-[300px] w-full">
                     <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={TREND_CHART_DATA} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f3f1" />
                           <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                           <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                           <RechartsTooltip cursor={{ fill: '#f3f3f1' }} />
                           <Bar dataKey="issued" fill="#932c2e" radius={[4, 4, 0, 0]} barSize={24} name="Issued" />
                           <Bar dataKey="closed" fill="#508660" radius={[4, 4, 0, 0]} barSize={24} name="Closed" />
                           <Line type="monotone" dataKey="prevYear" name="Year-on-Year" stroke="#7a8b95" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#FFF' }} strokeDasharray="5 5" />
                        </ComposedChart>
                     </ResponsiveContainer>
                  </div>
               </div>
             </div>
           )}
        </main>
      </div>
  );
}
