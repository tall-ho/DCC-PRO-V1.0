import React, { useState, useMemo, useEffect } from 'react';
import { 
  Trash2, 
  Search, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  X, 
  HelpCircle, 
  ChevronLeft, 
  ChevronRight, 
  ArrowUpRight, 
  ShieldCheck, 
  FileX2, 
  ListFilter,
  Users,
  Building2,
  CalendarDays,
  Target,
  Zap,
  Check,
  MoreHorizontal,
  Flame,
  Archive,
  Megaphone,
  Activity,
  Heart,
  Plus
} from 'lucide-react';

// --- Theme Configuration (Synced with Home Palette) ---
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

const KANBAN_STAGES = [
  { id: 'drafting', label: 'Drafting', icon: Zap, color: THEME.dustyBlue, bg: '#f3f3f1' },
  { id: 'dept_review', label: 'Dept. Head Review', icon: Users, color: THEME.indigo, bg: '#41475715' },
  { id: 'mr_review', label: 'QMR Approval', icon: ShieldCheck, color: THEME.primaryLight, bg: '#4d87a815' },
  { id: 'dcc_action', label: 'DCC Processing', icon: Flame, color: THEME.burntOrange, bg: '#d9624515' },
];

const INITIAL_REQUESTS = [
  { id: 'DEST-2026-001', recordId: 'REC-PD-045', subject: 'Production Log 2024', dept: 'Production', requester: 'Somkiat P.', stage: 'dcc_action', date: '2026-04-10', aging: 2 },
  { id: 'DEST-2026-002', recordId: 'REC-HR-012', subject: 'Overtime Forms 2023', dept: 'HR', requester: 'Wichai T.', stage: 'dept_review', date: '2026-04-12', aging: 0 },
  { id: 'DEST-2026-003', recordId: 'REC-QA-099', subject: 'IQC Test Reports 2022', dept: 'QA/QC', requester: 'Suda M.', stage: 'mr_review', date: '2026-04-08', aging: 4 },
  { id: 'DEST-2026-004', recordId: 'REC-EN-022', subject: 'Machine Logs 2020', dept: 'Engineering', requester: 'Narong S.', stage: 'drafting', date: '2026-04-15', aging: 0 },
  { id: 'DEST-2026-005', recordId: 'REC-SA-008', subject: 'Customer Quotes 2021', dept: 'Sales', requester: 'Amara K.', stage: 'mr_review', date: '2026-04-09', aging: 3 },
];

export default function DestructionPending() {
  const [activeTab, setActiveTab] = useState('kanban');
  const [activeStage, setActiveStage] = useState('all');
  const [search, setSearch] = useState('');
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [selectedReq, setSelectedReq] = useState<any>(null);

  const filteredRequests = useMemo(() => {
    return INITIAL_REQUESTS.filter(r => {
      const matchStage = activeStage === 'all' || r.stage === activeStage;
      const matchSearch = r.id.toLowerCase().includes(search.toLowerCase()) || 
                          r.subject.toLowerCase().includes(search.toLowerCase()) ||
                          r.recordId.toLowerCase().includes(search.toLowerCase());
      return matchStage && matchSearch;
    });
  }, [activeStage, search]);

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
                  <div className="absolute inset-0 bg-[#b7a159] blur-[15px] opacity-30 rounded-full group-hover:opacity-70 transition-all duration-700 animate-pulse-subtle"></div>
                  <div className="relative z-10 p-1.5 border border-[#b7a159]/50 rounded-xl bg-white/70 backdrop-blur-sm shadow-sm overflow-hidden">
                      <Trash2 size={28} strokeWidth={2.5} className="text-[#b58c4f]" />
                  </div>
              </div>
              <div>
                  <h3 className="font-black text-[#212c46] uppercase tracking-tighter leading-none" style={{ fontSize: '24px' }}>
                      DESTRUCTION <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b58c4f] to-[#8e9141]">PENDING</span> HUB
                  </h3>
                  <p className="text-[11px] font-bold text-[#b58c4f] uppercase tracking-[0.2em] mt-0.5 opacity-90 leading-none">
                      QUALITY RECORD DISPOSAL & COMPLIANCE TASKFORCE
                  </p>
              </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
              <input type="date" className="bg-white/50 border border-white/60 shadow-inner px-4 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest text-[#212c46] outline-none focus:border-[#b7a159]" />
              <div className="bg-white/50 p-1.5 rounded-xl border border-[#f3f3f1] shadow-inner flex flex-wrap items-center gap-1">
                  <button onClick={() => setActiveTab('kanban')} className={`px-5 py-2 flex items-center gap-2 font-black text-[12px] uppercase tracking-widest transition-all rounded-lg ${activeTab === 'kanban' ? 'bg-[#212c46] text-[#d7d7d7] shadow-md' : 'text-[#7a8b95] hover:text-[#932c2e]'}`}>
                    <Activity size={16} /> Approvals
                  </button>
                  <button onClick={() => setActiveTab('list')} className={`px-5 py-2 flex items-center gap-2 font-black text-[12px] uppercase tracking-widest transition-all rounded-lg ${activeTab === 'list' ? 'bg-[#212c46] text-[#d7d7d7] shadow-md' : 'text-[#7a8b95] hover:text-[#932c2e]'}`}>
                    <ListFilter size={16} /> List View
                  </button>
                  <button onClick={() => setActiveTab('dashboard')} className={`px-5 py-2 flex items-center gap-2 font-black text-[12px] uppercase tracking-widest transition-all rounded-lg ${activeTab === 'dashboard' ? 'bg-[#212c46] text-[#d7d7d7] shadow-md' : 'text-[#7a8b95] hover:text-[#932c2e]'}`}>
                    <Target size={16} /> Analytics
                  </button>
              </div>
              <button className="bg-[#932c2e] text-white px-6 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-md hover:bg-[#851c24] transition-all flex items-center gap-2 border border-[#932c2e]">
                  <Plus size={16} /> New Disposal Request
              </button>
          </div>
      </div>

      {/* CONTENT GRID */}
      <div className="px-8 mt-2 pb-8 flex-1 overflow-y-auto custom-scrollbar">
        {activeTab === 'dashboard' && (
          <div className="max-w-[1500px] w-full mx-auto space-y-6 animate-fade mt-2">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {KANBAN_STAGES.map((stage, idx) => {
                const count = INITIAL_REQUESTS.filter(r => r.stage === stage.id).length;
                return (
                  <div key={idx} className="bg-white/90 rounded-3xl p-6 shadow-sm border border-[#f3f3f1] flex flex-col justify-between h-[160px] group hover:shadow-md transition-all relative overflow-hidden cursor-default">
                    <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full opacity-40 group-hover:scale-[1.8] transition-transform duration-500 pointer-events-none" style={{backgroundColor: stage.bg}}></div>
                    <div className="flex justify-between items-start z-10 w-full">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner backdrop-blur-sm border border-white/40" style={{backgroundColor: stage.bg, color: stage.color}}>
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
          </div>
        )}

        {activeTab === 'kanban' && (
        <div className="max-w-[1500px] w-full mx-auto space-y-6 animate-fade mt-2">
          
          {/* SEARCH & STATS */}
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center bg-white/50 p-3 rounded-3xl border border-[#f3f3f1] shadow-inner mb-2">
               <div className="relative group flex-1 max-w-lg">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7a8b95] group-focus-within:text-[#212c46] transition-colors">
                    <Search size={18} strokeWidth={3} />
                  </div>
                  <input 
                    type="text" 
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search by ID, Subject or Record No..."
                    className="w-full bg-white/80 border border-[#f3f3f1] rounded-2xl pl-12 pr-6 py-3 text-sm font-bold text-[#212c46] outline-none focus:border-[#b7a159] focus:bg-white shadow-sm transition-all"
                  />
               </div>
               
               <div className="relative flex items-center bg-[#f8f9fa] px-4 py-3 rounded-2xl border border-[#eaeaec] shadow-sm hover:bg-white transition-colors">
                  <ListFilter size={16} className="text-[#7a8b95] mr-2"/>
                  <span className="text-[11px] text-[#7a8b95] font-extrabold uppercase font-mono mr-2">Filter Stage:</span>
                  <select value={activeStage} onChange={e => setActiveStage(e.target.value)} className="bg-transparent font-black text-[#212c46] outline-none cursor-pointer uppercase font-mono text-[11px] pr-8 focus:ring-0 appearance-none">
                     <option value="all">All Actions</option>
                     {KANBAN_STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                  </select>
                  <div className="absolute -top-2 -right-2 bg-[#932c2e] text-white text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-sm">
                    {filteredRequests.length}
                  </div>
               </div>
            </div>
          </div>

          {/* KANBAN / LIST GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRequests.map((req, idx) => {
              const stage = KANBAN_STAGES.find(s => s.id === req.stage);
              return (
                <div key={req.id} className="bg-white/90 rounded-3xl border border-[#f3f3f1] shadow-sm overflow-hidden group hover:border-[#b7a159] hover:shadow-xl hover:-translate-y-1 transition-all duration-500 animate-fadeIn" style={{ animationDelay: `${idx * 0.05}s` }}>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-[#7a8b95] uppercase tracking-widest mb-1 opacity-70">Disposal ID</span>
                        <span className="text-sm font-black text-[#212c46] tracking-tighter">{req.id}</span>
                      </div>
                      <div className={`p-2.5 rounded-xl shadow-inner`} style={{ backgroundColor: stage?.bg, color: stage?.color }}>
                        {stage && <stage.icon size={18} strokeWidth={2.5} />}
                      </div>
                    </div>

                    <h4 className="text-[15px] font-black text-[#212c46] leading-tight mb-4 min-h-[40px] line-clamp-2">
                       {req.subject}
                    </h4>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[#7a8b95] font-bold uppercase">Record ID</span>
                        <span className="font-black text-[#3f809e]">{req.recordId}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[#7a8b95] font-bold uppercase">Dept.</span>
                        <span className="font-black text-[#212c46] uppercase tracking-widest">{req.dept}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[#7a8b95] font-bold uppercase">Submitted</span>
                        <span className="font-bold text-[#4d87a8]">{req.date}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[#7a8b95] font-bold uppercase">Aging</span>
                        <span className={`px-2 py-0.5 rounded font-black ${req.aging > 2 ? `bg-[${THEME.danger}15] text-[${THEME.danger}]` : `bg-[${THEME.success}15] text-[${THEME.success}]`}`}>
                           {req.aging} Days
                        </span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[#f3f3f1] flex items-center justify-between">
                       <div className="flex items-center gap-2">
                          <img src={`https://i.pravatar.cc/150?u=${req.requester}`} className="w-6 h-6 rounded-lg border border-[#f3f3f1] shadow-sm" />
                          <span className="text-[10px] font-black text-[#7a8b95] uppercase tracking-wider">{req.requester}</span>
                       </div>
                       <button onClick={() => setSelectedReq(req)} className="bg-[#212c46] text-white p-2 rounded-lg hover:bg-[#3f809e] transition-colors shadow-sm group-hover:scale-110">
                          <ArrowUpRight size={14} strokeWidth={3} />
                       </button>
                    </div>
                  </div>
                  
                  {/* Stage Progress Bar */}
                  <div className="h-1.5 w-full bg-[#f3f3f1] flex">
                    {KANBAN_STAGES.map((s, sIdx) => {
                      const currentSIdx = KANBAN_STAGES.findIndex(x => x.id === req.stage);
                      const isComplete = sIdx <= currentSIdx;
                      return (
                        <div key={s.id} className={`h-full flex-1 border-r border-white/20 last:border-0 ${isComplete ? 'bg-[#657f4d]' : 'bg-transparent'}`}></div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        )}

        {activeTab === 'list' && (
          <div className="bg-white/90 border border-[#f3f3f1] shadow-sm rounded-3xl overflow-hidden flex flex-col animate-fade mt-6 max-w-[1500px] mx-auto">
             <div className="p-5 bg-white flex flex-col md:flex-row justify-between items-center gap-4 shrink-0 border-b border-[#f3f3f1]">
                <div className="relative w-full md:w-80">
                  <Search className="absolute left-4 top-3 text-[#7a8b95]" size={16} />
                  <input type="text" placeholder="Search Disposal ID..." value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-[#f3f3f1] border border-[#f3f3f1] rounded-2xl pl-12 pr-4 py-3 font-bold outline-none focus:border-[#212c46] transition-all font-mono text-sm shadow-sm"/>
                </div>
                <button className="px-5 py-3 bg-[#932c2e] text-white rounded-2xl shadow-md hover:bg-[#851c24] transition-all flex items-center gap-2 font-black text-[11px] uppercase tracking-widest font-mono cursor-pointer"><Plus size={16}/> NEW DISPOSAL</button>
             </div>
             <div className="overflow-x-auto relative w-full bg-white pb-4">
                <table className="w-full text-left border-collapse min-w-[1200px]">
                  <thead className="bg-[#212c46] border-b-[3px] border-[#b58c4f] sticky top-0 z-10 text-white font-mono text-[10px] uppercase tracking-widest">
                    <tr>
                      <th className="py-5 px-6 pl-10">Disposal Ref & Subject</th>
                      <th className="py-5 px-6 text-center">Record ID</th>
                      <th className="py-5 px-6 text-center">Dept.</th>
                      <th className="py-5 px-6 text-center">Requester</th>
                      <th className="py-5 px-6 text-center">Date</th>
                      <th className="py-5 px-6 text-center">Stage</th>
                      <th className="py-5 px-6 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f3f3f1]">
                    {filteredRequests.map(item => {
                      const stage = KANBAN_STAGES.find(s => s.id === item.stage);
                      return (
                      <tr key={item.id} className="hover:bg-[#f3f3f1] transition-colors group text-[#212c46]">
                        <td className="py-5 px-6 pl-10">
                           <div className="flex items-center gap-2 mb-1">
                             <Trash2 size={14} className="text-[#932c2e]" strokeWidth={2.5}/>
                             <span className="font-extrabold text-[#932c2e] font-mono text-[12px]">{item.id}</span>
                           </div>
                           <p className="font-bold text-[12px] leading-snug pl-6">{item.subject}</p>
                        </td>
                        <td className="py-5 px-6 text-center align-middle font-extrabold text-[#3a4e69] font-mono">{item.recordId}</td>
                        <td className="py-5 px-6 text-center align-middle font-extrabold text-[#3a4e69] uppercase font-mono">{item.dept}</td>
                        <td className="py-5 px-6 text-center align-middle font-bold text-[#7a8b95] font-mono">{item.requester}</td>
                        <td className="py-5 px-6 text-center align-middle font-bold text-[#932c2e] font-mono">{item.date}</td>
                        <td className="py-5 px-6 text-center align-middle">
                            <span className={`px-2.5 py-1 rounded-lg font-black font-mono border flex items-center justify-center gap-1.5 w-max mx-auto uppercase text-[9px]`} style={{ color: stage?.color, backgroundColor: stage?.bg }}><stage.icon size={12}/> {stage?.label}</span>
                        </td>
                        <td className="py-5 px-6 text-center align-middle">
                           <button onClick={() => setSelectedReq(item)} className="p-2 bg-white border border-[#f3f3f1] text-[#7a8b95] hover:bg-[#212c46] hover:text-white rounded-xl shadow-sm transition-all"><ArrowUpRight size={16} strokeWidth={2.5}/></button>
                        </td>
                      </tr>
                    )})}
                  </tbody>
                </table>
             </div>
          </div>
        )}
      </div>

      {/* DETAIL MODAL */}
      {selectedReq && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 bg-[#212c46]/60 backdrop-blur-sm animate-fadeIn">
           <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border-2 border-[#b7a159]/20 flex flex-col max-h-[90vh]">
              <div className="bg-[#212c46] text-white px-8 py-5 flex justify-between items-center shrink-0 border-b-2 border-[#b7a159]">
                  <div className="flex items-center gap-4">
                     <div className="p-2 bg-white/10 rounded-xl border border-white/20"><FileX2 size={24} className="text-[#b7a159]" /></div>
                     <div>
                        <h3 className="font-black text-lg tracking-widest uppercase leading-none">{selectedReq.id}</h3>
                        <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] mt-1">{selectedReq.recordId}</p>
                     </div>
                  </div>
                  <button onClick={() => setSelectedReq(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={24}/></button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-8 bg-white">
                  <div className="bg-[#f3f3f1] p-6 rounded-2xl border border-[#f3f3f1] shadow-sm">
                     <h4 className="text-[10px] font-black text-[#7a8b95] uppercase tracking-widest mb-3 flex items-center gap-2"><Target size={14} className="text-[#a54f6b]"/> Disposal Objective</h4>
                     <h2 className="text-[18px] font-black text-[#212c46] leading-snug mb-4">{selectedReq.subject}</h2>
                     <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                           <p className="text-[9px] font-black text-[#7a8b95] uppercase mb-1">Owner Dept.</p>
                           <p className="text-xs font-black text-[#212c46] uppercase">{selectedReq.dept}</p>
                        </div>
                        <div>
                           <p className="text-[9px] font-black text-[#7a8b95] uppercase mb-1">Submitted Date</p>
                           <p className="text-xs font-black text-[#212c46] uppercase">{selectedReq.date}</p>
                        </div>
                        <div>
                           <p className="text-[9px] font-black text-[#7a8b95] uppercase mb-1">Request Aging</p>
                           <p className={`text-xs font-black ${selectedReq.aging > 2 ? 'text-[#932c2e]' : 'text-[#657f4d]'}`}>{selectedReq.aging} Days</p>
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="bg-white p-6 rounded-2xl border border-[#f3f3f1] shadow-sm">
                        <h4 className="text-[10px] font-black text-[#7a8b95] uppercase tracking-widest mb-4 flex items-center gap-2 font-mono"><Activity size={14} className="text-[#3f809e]"/> Current Stage</h4>
                        <div className="flex items-center gap-4">
                           <div className={`p-4 rounded-xl shadow-inner bg-[#212c46] text-white`}>
                              {KANBAN_STAGES.find(s => s.id === selectedReq.stage)?.icon ? 
                                React.createElement(KANBAN_STAGES.find(s => s.id === selectedReq.stage)!.icon, { size: 24 }) : null}
                           </div>
                           <div>
                              <p className="text-sm font-black text-[#212c46] uppercase leading-none">{KANBAN_STAGES.find(s => s.id === selectedReq.stage)?.label}</p>
                              <p className="text-[10px] font-bold text-[#4d87a8] mt-2 italic">Awaiting action since {selectedReq.date}</p>
                           </div>
                        </div>
                     </div>
                     <div className="bg-white p-6 rounded-2xl border border-[#f3f3f1] shadow-sm">
                        <h4 className="text-[10px] font-black text-[#7a8b95] uppercase tracking-widest mb-4 flex items-center gap-2 font-mono"><ShieldCheck size={14} className="text-[#657f4d]"/> Security Check</h4>
                        <ul className="space-y-2">
                           <li className="flex items-center gap-2 text-[11px] font-bold text-[#657f4d]"><Check size={14}/> Lifecycle Expired</li>
                           <li className="flex items-center gap-2 text-[11px] font-bold text-[#657f4d]"><Check size={14}/> QMR Pre-Audited</li>
                        </ul>
                     </div>
                  </div>
              </div>

              <div className="p-6 bg-white border-t border-[#f3f3f1] flex justify-between items-center shrink-0">
                  <button onClick={() => setSelectedReq(null)} className="px-6 py-2.5 bg-[#f3f3f1] text-[#7a8b95] rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-[#eaeaec] transition-colors">Cancel</button>
                  <div className="flex gap-3">
                     <button className="px-6 py-2.5 bg-[#ab7d82]/20 text-[#ab7d82] border border-[#ab7d82]/30 rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-[#ab7d82]/30 transition-colors">Request Info</button>
                     <button className="px-8 py-2.5 bg-[#932c2e] text-white rounded-xl font-black text-[11px] uppercase tracking-widest shadow-md hover:bg-[#851c24] transition-all flex items-center gap-2"><ShieldCheck size={14}/> Approve & Process</button>
                  </div>
              </div>
           </div>
        </div>
      )}

      {/* USER GUIDE DRAWER */}
      {isGuideOpen && (
        <div className="fixed inset-0 z-[250] flex justify-end no-scrollbar bg-[#212c46]/60 backdrop-blur-sm animate-fadeIn" onClick={() => setIsGuideOpen(false)}>
           <div className="bg-white w-full md:w-[500px] h-full shadow-2xl flex flex-col border-l-4 border-[#b7a159] animate-fadeIn" onClick={e => e.stopPropagation()}>
              <div className="p-6 bg-[#212c46] text-white flex justify-between items-center border-b-2 border-[#b7a159]">
                 <div className="flex items-center gap-4">
                    <HelpCircle size={24} className="text-[#b7a159]" />
                    <div>
                      <h3 className="font-black text-lg tracking-widest uppercase mb-0.5">Destruction Guide</h3>
                      <p className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em]">Operational Excellence HUB</p>
                    </div>
                 </div>
                 <button onClick={() => setIsGuideOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={24}/></button>
              </div>
              <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-white custom-scrollbar">
                  <section className="bg-[#f3f3f1] p-6 rounded-3xl border border-[#f3f3f1] shadow-sm">
                    <h4 className="text-[13px] font-black text-[#212c46] uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-[#f3f3f1] pb-2 font-mono">
                      <Archive size={18} className="text-[#a54f6b]"/> Overview
                    </h4>
                    <p className="text-[#53728A] text-sm leading-relaxed mb-4">
                      ศูนย์กลางจัดการบันทึกคุณภาพที่ครบกำหนดอายุการจัดเก็บ ระบบจะช่วยคัดกรองรายการที่ <strong className="text-[#212c46]">Ready to Disposal</strong> โดยอัตโนมัติ
                    </p>
                  </section>

                  <section className="bg-[#f3f3f1] p-6 rounded-3xl border border-[#f3f3f1] shadow-sm">
                    <h4 className="text-[13px] font-black text-[#212c46] uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-[#f3f3f1] pb-2 font-mono">
                      <Activity size={18} className="text-[#3f809e]"/> Workflows
                    </h4>
                    <ul className="space-y-4">
                       <li className="flex gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#f3f3f1] flex items-center justify-center font-black text-xs text-[#212c46] shrink-0 border border-[#eaeaec]">1</div>
                          <div>
                             <p className="font-black text-[#212c46] uppercase text-[11px] mb-1">Dept. Head Review</p>
                             <p className="text-xs text-[#7a8b95]">หัวหน้าแผนกตรวจสอบความถูกต้องของรายการบันทึกก่อนส่งทำลาย</p>
                          </div>
                       </li>
                       <li className="flex gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#f3f3f1] flex items-center justify-center font-black text-xs text-[#212c46] shrink-0 border border-[#eaeaec]">2</div>
                          <div>
                             <p className="font-black text-[#212c46] uppercase text-[11px] mb-1">QMR Approval</p>
                             <p className="text-xs text-[#7a8b95]">ทีมบริหาร QMR อนุมัติการทำลายตามมาตรฐานความปลอดภัย</p>
                          </div>
                       </li>
                       <li className="flex gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#932c2e] flex items-center justify-center font-black text-xs text-white shrink-0 shadow-md">3</div>
                          <div>
                             <p className="font-black text-[#932c2e] uppercase text-[11px] mb-1">DCC Action</p>
                             <p className="text-xs text-[#7a8b95]">ฝ่ายควบคุมเอกสารดำเนินการย่อยทำลายและบันทึกลง LOG</p>
                          </div>
                       </li>
                    </ul>
                  </section>
              </div>
              <div className="p-6 bg-white border-t border-[#f3f3f1] flex justify-end">
                 <button onClick={() => setIsGuideOpen(false)} className="px-8 py-3 bg-[#212c46] text-white font-black rounded-2xl uppercase text-[11px] hover:bg-[#414757] transition-all shadow-md tracking-wider">Got it</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
