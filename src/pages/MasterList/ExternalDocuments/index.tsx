import React, { useState, useMemo, useEffect } from 'react';
import {
  Search, Plus, Globe, Download, Eye,
  ChevronLeft, ChevronRight, ChevronDown, Filter,
  Users, CheckCircle, Clock, AlertTriangle,
  FileLock2, HardDriveDownload, HelpCircle, X,
  Network, Building2, CalendarDays,
  Palette as ArtworkIcon,
  Image as ImageIcon,
  PenTool, RefreshCw, LayoutDashboard, List,
  BarChart2, PieChart as PieChartIcon, TrendingUp, Activity,
  Info, FileText, CheckCircle2, XCircle, ArrowUpRight, ArrowDownRight, Lightbulb, FileStack, Target, Edit, Printer
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
  ComposedChart, Line
} from 'recharts';

const INITIAL_EXTERNAL_DOCS = [
  { id: 'ISO 9001:2015', title: 'Quality Management Systems — Requirements', category: 'Standard', issuingOrg: 'ISO', dept: 'QA/QC', requester: 'Suda M.', issueDate: '15 SEP 2015', expiryDate: '-', status: 'Active' },
  { id: 'ISO 14001:2015', title: 'Environmental Management Systems', category: 'Standard', issuingOrg: 'ISO', dept: 'QA/QC', requester: 'Suda M.', issueDate: '15 SEP 2015', expiryDate: '-', status: 'Active' },
  { id: 'DWG-FRAME-A01', title: 'Main Frame Structure Drawing - Ver.B', category: 'Drawing/Artwork', issuingOrg: 'Engineering Design Co.', dept: 'ENGINEERING', requester: 'Narong S.', issueDate: '10 JAN 2026', expiryDate: '-', status: 'Active' },
  { id: 'ART-PKG-099', title: 'Product Packaging Artwork - Seasonal 2026', category: 'Drawing/Artwork', issuingOrg: 'Marketing Agency', dept: 'SALES/MARKETING', requester: 'Wichai T.', issueDate: '15 DEC 2025', expiryDate: '31 DEC 2026', status: 'Active' },
  { id: 'Machine-Manual-X1', title: 'CNC Machine Model X1 - Operation Manual', category: 'Machine Manual', issuingOrg: 'Fanuc Corp.', dept: 'PRODUCTION', requester: 'Somkiat P.', issueDate: '12 MAY 2024', expiryDate: '-', status: 'Active' },
  { id: 'Spec-Cust-Toyota', title: 'Toyota Supplier Quality Manual (TSQM)', category: 'Customer Spec', issuingOrg: 'Toyota Motor', dept: 'QA/QC', requester: 'Amara K.', issueDate: '01 FEB 2026', expiryDate: '31 DEC 2026', status: 'Active' },
  { id: 'IATF 16949:2016', title: 'Quality management system requirements for automotive', category: 'Standard', issuingOrg: 'IATF', dept: 'QA/QC', requester: 'Suda M.', issueDate: '01 OCT 2016', expiryDate: '-', status: 'Active' },
  { id: 'SPEC-SAMSUNG-V3', title: 'Material Restriction Specification Ver. 3.0', category: 'Customer Spec', issuingOrg: 'Samsung Electronics', dept: 'ENGINEERING', requester: 'Narong S.', issueDate: '21 JUL 2025', expiryDate: '-', status: 'Active' },
];

const DEPTS = ['ALL', 'Management', 'Production', 'QA/QC', 'Purchasing', 'Sales/Marketing', 'Engineering', 'Warehouse'];

const CATEGORY_COLORS: Record<string, string> = {
  'Standard': '#4d87a8',
  'Machine Manual': '#b7a159',
  'Drawing/Artwork': '#b58c4f',
  'Customer Spec': '#508660',
  'Other': '#748ea1',
  'Default': '#7a8b95'
};

const CHART_CAT_DATA = [
  { name: 'Standard', value: 45, color: '#4d87a8' },
  { name: 'Machine Manual', value: 30, color: '#b7a159' },
  { name: 'Drawing/Artwork', value: 25, color: '#b58c4f' },
  { name: 'Customer Spec', value: 35, color: '#508660' },
  { name: 'Other', value: 15, color: '#748ea1' },
];

const TREND_CHART_DATA = [
  { month: 'May 25', requests: 12, valid: 10, prevYear: 8 },
  { month: 'Jun 25', requests: 15, valid: 12, prevYear: 10 },
  { month: 'Jul 25', requests: 8, valid: 15, prevYear: 12 },
  { month: 'Aug 25', requests: 10, valid: 9, prevYear: 14 },
  { month: 'Sep 25', requests: 20, valid: 18, prevYear: 15 },
  { month: 'Oct 25', requests: 14, valid: 12, prevYear: 10 },
  { month: 'Nov 25', requests: 18, valid: 16, prevYear: 14 },
  { month: 'Dec 25', requests: 22, valid: 20, prevYear: 18 },
  { month: 'Jan 26', requests: 25, valid: 22, prevYear: 20 },
  { month: 'Feb 26', requests: 30, valid: 28, prevYear: 22 },
  { month: 'Mar 26', requests: 28, valid: 25, prevYear: 24 },
  { month: 'Apr 26', requests: 35, valid: 32, prevYear: 26 },
];

const THAI_MONTHS = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
const ENG_MONTHS_SHORT = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

const RenderIcon = ({ icon: IconComponent, size = 16, className = "", strokeWidth = 2 }: any) => {
  return IconComponent ? <IconComponent size={size} className={className} strokeWidth={strokeWidth} /> : null;
};

const LineSparkline = ({ points, color }: {points: number[], color: string}) => {
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

const StatusBadge = ({ status }: {status: string}) => {
  const styles: any = {
    'Active': 'bg-[#657f4d]/10 text-[#657f4d] border-[#657f4d]/30',
    'Obsolete': 'bg-[#932c2e]/10 text-[#932c2e] border-[#932c2e]/30',
    'Expired': 'bg-[#b7a159]/10 text-[#b7a159] border-[#b7a159]/30',
  };
  const Icons: any = { 'Active': CheckCircle2, 'Obsolete': XCircle, 'Expired': Clock };
  const BadgeIcon = Icons[status] || CheckCircle2;
  return (
    <span className={`px-2.5 py-1 rounded-lg font-black border text-[9px] uppercase tracking-widest font-mono flex items-center justify-center gap-1.5 shadow-sm ${styles[status]}`}>
      <BadgeIcon size={10} strokeWidth={3} /> {status}
    </span>
  );
};

const DashboardView = ({ selectedMonthDisplay }: {selectedMonthDisplay: string}) => {
  const KPIS = [
    { label: 'TOTAL EXTERNAL', val: '185 Docs', color: '#4d87a8', icon: Globe, spark: [12, 18, 15, 28, 45], trend: '+4.1%', trendUp: true, iconBg: '#4d87a815' },
    { label: 'CUSTOMER SPECS', val: '45 Cases', color: '#508660', icon: Building2, spark: [25, 12, 18, 22, 30], trend: '+12.5%', trendUp: true, iconBg: '#50866015' },
    { label: 'ISO STANDARDS', val: '12 Docs', color: '#b7a159', icon: FileLock2, spark: [18, 22, 19, 32, 38], trend: '+3.2%', trendUp: true, iconBg: '#b7a15915' },
    { label: 'EXPIRING SOON', val: '04 Tasks', color: '#932c2e', icon: Clock, spark: [35, 28, 45, 18, 12], trend: '-7.4%', trendUp: false, iconBg: '#932c2e15' }
  ];

  return (
    <div className="flex flex-col gap-8 animate-fade pb-10 w-full mt-4">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-2">
        <div>
          <h2 className="text-2xl font-black text-[#212c46] uppercase tracking-tight">EXTERNAL DOC DASHBOARD</h2>
          <p className="text-[#7a8b95] font-bold text-[11px] uppercase tracking-widest mt-1.5 flex items-center gap-2">
            <CalendarDays size={14}/> OVERVIEW FOR {selectedMonthDisplay} 2026
          </p>
        </div>
        <div className="bg-white/90 px-6 py-4 rounded-3xl shadow-sm border border-[#f3f3f1] flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className="bg-[#4d87a8]/10 w-12 h-12 rounded-2xl flex items-center justify-center text-[#4d87a8]">
            <Target size={24} strokeWidth={2.5} />
          </div>
          <div>
             <div className="text-3xl font-black font-mono leading-none text-[#212c46]">185</div>
             <div className="text-[10px] font-black text-[#7a8b95] uppercase tracking-widest mt-1">Total External Assets</div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-stretch">
        <div className="w-full lg:w-[300px] flex flex-col gap-4 shrink-0">
          {KPIS.map((s, idx) => (
            <div key={idx} className="bg-white/90 rounded-2xl p-6 shadow-sm border border-[#f3f3f1] flex flex-col justify-between h-[155px] group hover:shadow-md transition-all relative overflow-hidden">
               <div className="flex justify-between items-start z-10">
                 <span className="text-[10px] font-black text-[#7a8b95] uppercase tracking-[0.15em]">{s.label}</span>
                 <div className="p-2.5 rounded-xl shadow-inner" style={{ backgroundColor: s.iconBg, color: s.color }}><RenderIcon icon={s.icon} size={20} strokeWidth={2.5}/></div>
               </div>
               <h3 className="text-3xl font-black font-mono tracking-tighter" style={{ color: s.color }}>{s.val}</h3>
               <div className="flex justify-between items-end mt-4 z-10">
                 <div className="w-24 h-8"><LineSparkline points={s.spark} color={s.color} /></div>
                 <div className={`px-2.5 py-1.5 rounded-xl text-[10px] font-black flex items-center gap-1.5 shadow-sm border ${s.trendUp ? 'bg-[#657f4d]/10 text-[#657f4d] border-[#657f4d]/30' : 'bg-[#932c2e]/10 text-[#932c2e] border-[#932c2e]/30'}`}>
                   {s.trendUp ? <TrendingUp size={12}/> : <ArrowDownRight size={12}/>} {s.trend}
                 </div>
               </div>
            </div>
          ))}
        </div>

        <div className="flex-1 flex flex-col gap-6 min-w-0">
          <div className="bg-white/90 rounded-2xl border border-[#f3f3f1] p-6 flex flex-col xl:flex-row gap-6 shadow-sm h-fit">
            <div className="flex-1 space-y-4 text-[#212c46]">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-[#3f809e]/10 rounded-2xl shadow-sm flex items-center justify-center text-[#3f809e]"><RenderIcon icon={Activity} size={28} /></div>
                <div>
                   <h3 className="text-xl font-black text-[#212c46] uppercase font-mono tracking-tight leading-none">Integrity Analysis</h3>
                   <p className="text-[10px] font-bold text-[#b7a159] mt-2 uppercase tracking-widest flex items-center gap-2"><CheckCircle2 size={14}/> Operational Insights</p>
                </div>
              </div>
              <div className="bg-[#f3f3f1] p-6 rounded-2xl border border-[#f3f3f1] shadow-inner">
                 <p className="text-[13px] font-medium text-[#414757] leading-relaxed">
                    External Validity Score 98% - สถานะเอกสารจากภายนอกอยู่ในเกณฑ์สมบูรณ์มาก <br/>
                   <span className="font-bold text-[#b58c4f] mt-1 block tracking-tight italic">ข้อสังเกต: มีเอกสาร ISO 9001:2015 ใกล้ถึงรอบทบทวนความเป็นปัจจุบัน (Review)</span>
                 </p>
              </div>
            </div>
            <div className="hidden xl:block w-px bg-[#f3f3f1] my-2"></div>
            <div className="w-full xl:w-[480px] space-y-3 flex flex-col justify-center">
              <h4 className="text-[10px] font-black text-[#212c46] uppercase tracking-[0.2em] mb-1 flex items-center gap-2 font-mono"><RenderIcon icon={Lightbulb} size={18} className="text-[#b7a159]"/> Recommended Actions:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                 {["เช็ค Revision ISO ล่าสุด", "ติดตาม Spec จากลูกค้า", "อัปเดตทะเบียนคู่มือเครื่อง", "จัดเก็บใบ Certificate"].map((action, i) => (
                   <div key={i} className="bg-white p-4 rounded-xl border border-[#f3f3f1] flex gap-3 shadow-sm hover:shadow-md transition-all group">
                      <div className="w-2 h-2 rounded-full bg-[#4d87a8] mt-1.5 shrink-0 shadow-sm"></div>
                      <span className="text-[11px] font-bold text-[#7a8b95] leading-tight">{action}</span>
                   </div>
                 ))}
              </div>
            </div>
          </div>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            <div className="bg-white/90 rounded-2xl p-7 shadow-sm border border-[#eaeaec] flex flex-col h-full min-h-[300px]">
              <h4 className="text-[10px] font-black text-[#7a8b95] uppercase tracking-widest mb-4 flex items-center justify-center font-mono"><PieChartIcon size={18} className="text-[#212c46] mr-2"/> Document Categories</h4>
              <div className="flex-1 min-h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={CHART_CAT_DATA} cx="50%" cy="50%" innerRadius={70} outerRadius={105} paddingAngle={5} dataKey="value" stroke="none">
                      {CHART_CAT_DATA.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                    <RechartsTooltip cursor={{fill: '#f3f3f1'}}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-white/90 rounded-2xl p-7 shadow-sm border border-[#eaeaec] flex flex-col h-full min-h-[300px]">
              <h4 className="text-[10px] font-black text-[#7a8b95] uppercase tracking-widest mb-4 flex items-center justify-center font-mono"><Activity size={18} className="text-[#657f4d] mr-2"/> Validity Ratio</h4>
              <div className="flex-1 relative flex items-center justify-center min-h-[180px]">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={[{v:95, c:'#4d87a8'}, {v:5, c:'#f8f9fa'}]} cx="50%" cy="50%" innerRadius={70} outerRadius={105} paddingAngle={0} dataKey="v" stroke="none">
                        <Cell fill="#4d87a8"/><Cell fill="#f3f3f1"/>
                      </Pie>
                    </PieChart>
                 </ResponsiveContainer>
                 <div className="absolute inset-0 flex flex-col items-center justify-center pt-2"><span className="text-4xl font-black text-[#4d87a8] font-mono leading-none">95%</span><span className="text-[9px] font-black text-[#7a8b95] uppercase mt-2 tracking-widest">Valid</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/90 rounded-3xl p-10 shadow-sm border border-[#eaeaec] shrink-0 mb-10 overflow-hidden text-[#212c46]">
        <div className="flex justify-between items-center mb-10">
           <h4 className="text-base font-black text-[#212c46] uppercase tracking-widest font-mono">Monthly Registration Trend</h4>
           <div className="flex gap-6 font-mono text-[9px] font-black uppercase">
              <span className="flex items-center gap-2"><div className="w-4 h-4 bg-[#4d87a8] rounded-sm shadow-sm"></div> Current Registered</span>
              <span className="flex items-center gap-2 text-[#7a8b95]"><div className="w-4 h-4 bg-[#4d87a8]/40 rounded-sm shadow-sm"></div> Previous Registered</span>
           </div>
        </div>
        <div className="h-[350px] w-full">
           <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={TREND_CHART_DATA} margin={{ top: 0, right: 0, left: -20, bottom: 20 }}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f3f1" />
                 <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#7a8b95', fontWeight: 'bold' }} dy={10} />
                 <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#7a8b95', fontWeight: 'bold' }} domain={[0, 40]}/>
                 <RechartsTooltip cursor={{ fill: '#f3f3f1' }} />
                 <Bar dataKey="requests" name="Registered" radius={[4, 4, 0, 0]} barSize={28}>
                    {TREND_CHART_DATA.map((entry, index) => (
                      <Cell key={`cell-req-${index}`} fill={index === TREND_CHART_DATA.length - 1 ? '#4d87a8' : 'rgba(77,135,168,0.4)'} />
                    ))}
                 </Bar>
                 <Line type="monotone" dataKey="prevYear" name="Year-on-Year" stroke="#212c46" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#FFF' }} strokeDasharray="5 5" />
              </ComposedChart>
           </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default function ExternalDocuments() {
  const [activeTab, setActiveTab] = useState('list'); 
  const [activeDept, setActiveDept] = useState('ALL');
  const [search, setSearch] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('2026-04'); 
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); 
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);

  const filteredDocs = useMemo(() => {
    return INITIAL_EXTERNAL_DOCS.filter(d => {
      const matchDept = activeDept === 'ALL' || d.dept.toUpperCase() === activeDept.toUpperCase();
      const matchSearch = d.id.toLowerCase().includes(search.toLowerCase()) || d.title.toLowerCase().includes(search.toLowerCase());
      return matchDept && matchSearch;
    });
  }, [search, activeDept]);

  useEffect(() => { setCurrentPage(1); }, [activeDept, search, itemsPerPage]);

  const currentDocs = useMemo(() => {
    return filteredDocs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  }, [filteredDocs, currentPage, itemsPerPage]);

  const displayMonthName = THAI_MONTHS[parseInt(selectedMonth.split('-')[1], 10) - 1].toUpperCase();

  return (
      <div className="flex flex-col min-h-0 w-full text-[#212c46] bg-transparent relative overflow-x-hidden">

        <div className="px-8 pt-3 pb-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 no-print animate-fade">
          <div className="flex items-center gap-5">
            <div className="relative flex items-center justify-center group cursor-default shrink-0">
               <div className="absolute inset-0 bg-[#3f809e] blur-[15px] opacity-20 rounded-full group-hover:opacity-60 transition-all duration-700"></div>
               <div className="relative z-10 p-1.5 border border-[#3f809e]/40 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm">
                   <Globe size={28} strokeWidth={2.5} className="text-[#3f809e]" />
               </div>
            </div>
            <div className="flex flex-col justify-center">
              <h1 className="text-[24px] font-black tracking-tighter flex gap-2.5 uppercase font-mono leading-none text-[#212c46]">
                EXTERNAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3f809e] to-[#b58c4f]">DOCUMENTS</span>
              </h1>
              <p className="text-[#4d5a44] font-bold uppercase tracking-[0.2em] mt-0.5 text-[11px] font-mono opacity-80 leading-none">ระบบทะเบียนเอกสารภายนอก</p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="bg-white/50 p-1.5 rounded-xl border border-[#f3f3f1] shadow-inner flex flex-wrap items-center gap-1">
              <button onClick={() => setActiveTab('list')} className={`px-5 py-2 flex items-center gap-2 font-black text-[12px] uppercase tracking-widest transition-all rounded-lg ${activeTab === 'list' ? 'bg-[#212c46] text-[#d7d7d7] shadow-md' : 'text-[#7a8b95] hover:text-[#932c2e]'}`}><List size={16} /> Master List</button>
              <button onClick={() => setActiveTab('dashboard')} className={`px-5 py-2 flex items-center gap-2 font-black text-[12px] uppercase tracking-widest transition-all rounded-lg ${activeTab === 'dashboard' ? 'bg-[#212c46] text-[#d7d7d7] shadow-md' : 'text-[#7a8b95] hover:text-[#932c2e]'}`}><LayoutDashboard size={16} /> Dashboard</button>
            </div>
          </div>
        </div>

           {activeTab === 'list' && (
             <div className="bg-white/90 border border-[#f3f3f1] shadow-sm rounded-2xl overflow-hidden flex flex-col mx-8 mb-8 animate-fade mt-2">
               <div className="p-4 bg-white flex flex-col md:flex-row justify-between items-center gap-4 shrink-0 border-b border-[#f3f3f1]">
                  <div className="flex items-center gap-3">
                     <div className="relative flex items-center bg-[#f3f3f1] px-4 py-2 rounded-xl border border-[#f3f3f1] shadow-sm hover:bg-white transition-colors">
                        <Users size={14} className="text-[#3f809e] mr-2"/>
                        <span className="text-[10px] text-[#7a8b95] font-extrabold uppercase font-mono">Custodian Dept:</span><span className="mx-2 text-[#f3f3f1]">|</span>
                        <select value={activeDept} onChange={(e)=>setActiveDept(e.target.value)} className="bg-transparent font-black text-[#212c46] outline-none cursor-pointer uppercase font-mono text-[11px] pr-8">
                           {DEPTS.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                        <ChevronDown size={14} className="text-[#212c46] absolute right-4 pointer-events-none" />
                     </div>
                  </div>
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-80">
                      <Search className="absolute left-3 top-2.5 text-[#7a8b95]" size={16} />
                      <input type="text" placeholder="Search No, Title..." value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-[#f3f3f1] border border-[#f3f3f1] rounded-lg pl-10 pr-4 py-2 font-bold outline-none focus:border-[#b7a159] transition-all font-mono text-sm shadow-sm"/>
                    </div>
                    <button className="px-4 py-2 bg-[#932c2e] text-white rounded-lg shadow-md hover:bg-[#851c24] transition-all flex items-center gap-2 font-black text-[11px] uppercase tracking-widest font-mono cursor-pointer"><Plus size={16}/> NEW EXT. DOC</button>
                  </div>
               </div>

               <div className="overflow-x-auto relative w-full bg-white pb-4">
                  <table className="w-full text-left border-collapse min-w-[1300px]">
                    <thead className="bg-[#212c46] border-b-[3px] border-[#b58c4f] sticky top-0 z-10 text-white font-mono text-[10px] uppercase tracking-widest">
                      <tr>
                        <th className="py-4 px-4 pl-8">Document ID (Ref)</th>
                        <th className="py-4 px-4">External Doc Title</th>
                        <th className="py-4 px-4">Issuing Organization</th>
                        <th className="py-4 px-4">Category</th>
                        <th className="py-4 px-4 text-center">Effective</th>
                        <th className="py-4 px-4 text-center">Status</th>
                        <th className="py-4 px-4 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f3f3f1]">
                      {currentDocs.length > 0 ? currentDocs.map(doc => (
                        <tr key={doc.id} className="hover:bg-[#f3f3f1] transition-colors group text-[#212c46]">
                          <td className="py-4 px-4 pl-8 align-middle font-black font-mono text-[12px] text-[#212c46]">{doc.id}</td>
                          <td className="py-4 px-4 align-top">
                             <p className="font-bold text-[12px] leading-snug">{doc.title}</p>
                             <p className="text-[10px] text-[#7a8b95] font-bold mt-1 uppercase tracking-wider">{doc.dept}</p>
                          </td>
                          <td className="py-4 px-4 align-middle font-extrabold text-[#748ea1] uppercase font-mono text-[11px]">{doc.issuingOrg}</td>
                          <td className="py-4 px-4 align-middle">
                             <span className="px-2.5 py-1 rounded font-black text-white uppercase text-[9px] shadow-sm" style={{ backgroundColor: CATEGORY_COLORS[doc.category] || CATEGORY_COLORS.Default }}>{doc.category}</span>
                          </td>
                          <td className="py-4 px-4 text-center align-middle font-bold text-[#748b9e] font-mono">{doc.issueDate}</td>
                          <td className="py-4 px-4 text-center align-middle"><div className="flex justify-center"><StatusBadge status={doc.status}/></div></td>
                          <td className="py-4 px-4 text-center align-middle">
                             <div className="flex items-center justify-center gap-1.5 transition-opacity group-hover:opacity-100 opacity-60">
                                <button onClick={() => { setSelectedDoc(doc); setIsViewModalOpen(true); }} className="p-1.5 bg-white border border-[#f3f3f1] text-[#7a8b95] hover:bg-[#212c46] hover:text-white rounded shadow-sm transition-all cursor-pointer"><Eye size={14}/></button>
                                <button className="p-1.5 bg-white border border-[#f3f3f1] text-[#7a8b95] hover:bg-[#3f809e] hover:text-white rounded shadow-sm transition-all cursor-pointer"><Download size={14}/></button>
                             </div>
                          </td>
                        </tr>
                      )) : <tr><td colSpan={7} className="p-10 text-center font-mono italic text-[#7a8b95]">No external documents found.</td></tr>}
                    </tbody>
                  </table>
               </div>
               
               <div className="p-4 bg-white border-t border-[#f3f3f1] flex justify-between items-center text-[#7a8b95] uppercase font-mono text-[10px] font-bold">
                  <div>Page {currentPage} | Showing {currentDocs.length} of {filteredDocs.length} records</div>
                  <div className="flex gap-2">
                     <button onClick={() => setCurrentPage(Math.max(1, currentPage-1))} disabled={currentPage === 1} className="p-1.5 border rounded hover:bg-[#f3f3f1] disabled:opacity-50"><ChevronLeft size={14}/></button>
                     <button onClick={() => setCurrentPage(currentPage+1)} disabled={currentDocs.length < itemsPerPage} className="p-1.5 border rounded hover:bg-[#f3f3f1] disabled:opacity-50"><ChevronRight size={14}/></button>
                  </div>
               </div>
             </div>
           )}
           {activeTab === 'dashboard' && <div className="px-8"><DashboardView selectedMonthDisplay={displayMonthName} /></div>}

        {isViewModalOpen && selectedDoc && (
          <div className="fixed inset-0 z-[500] flex justify-center items-center p-4">
            <div className="absolute inset-0 bg-[#212c46]/60 backdrop-blur-sm" onClick={() => setIsViewModalOpen(false)}></div>
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border-2 border-[#b7a159] relative z-10 animate-fade">
              <div className="px-6 py-5 bg-[#212c46] text-white flex justify-between items-center">
                <div className="flex items-center gap-3">
                   <div className="p-1.5 bg-white/10 rounded-lg">
                     <Globe size={18} className="text-[#b7a159]"/>
                   </div>
                   <h3 className="text-[13px] font-black tracking-widest uppercase font-mono leading-none">External Doc Detail</h3>
                </div>
                <button onClick={() => setIsViewModalOpen(false)} className="p-1 hover:bg-white/20 rounded-full transition-colors"><X size={18}/></button>
              </div>
              <div className="p-8 space-y-6 text-[#212c46]">
                <div className="grid grid-cols-2 gap-6 bg-[#f3f3f1] p-6 rounded-xl border border-[#f3f3f1] text-xs">
                  <div className="col-span-2"><p className="text-[10px] font-black text-[#7a8b95] uppercase font-mono mb-1">Subject</p><p className="font-bold text-[13px]">{selectedDoc.title}</p></div>
                  <div><p className="text-[10px] font-black text-[#7a8b95] uppercase font-mono mb-1">Document ID</p><p className="font-black text-[#932c2e] text-[14px] font-mono">{selectedDoc.id}</p></div>
                  <div><p className="text-[10px] font-black text-[#7a8b95] uppercase font-mono mb-1">Category</p><span className="px-2.5 py-1 rounded text-white text-[9px] font-black uppercase shadow-sm" style={{ backgroundColor: CATEGORY_COLORS[selectedDoc.category] || CATEGORY_COLORS.Default }}>{selectedDoc.category}</span></div>
                  <div><p className="text-[10px] font-black text-[#7a8b95] uppercase font-mono mb-1">Custodian Dept.</p><p className="font-bold uppercase">{selectedDoc.dept} ({selectedDoc.requester})</p></div>
                  <div><p className="text-[10px] font-black text-[#7a8b95] uppercase font-mono mb-1">Issue / Expiry</p><p className="font-bold">{selectedDoc.issueDate} / {selectedDoc.expiryDate}</p></div>
                  <div><p className="text-[10px] font-black text-[#7a8b95] uppercase font-mono mb-1">Status</p><StatusBadge status={selectedDoc.status} /></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
  );
}
