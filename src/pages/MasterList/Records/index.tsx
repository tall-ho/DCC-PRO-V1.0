import React, { useState, useMemo } from 'react';
import { 
  Database, 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  Pencil, 
  Trash2, 
  Archive, 
  ShieldCheck, 
  HardDriveDownload,
  Plus,
  HelpCircle,
  X,
  Target,
  Activity,
  FileStack,
  Lock,
  Network,
  Clock,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

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

const INITIAL_RECORDS = [
  { id: 'REC-PD-045', title: 'Daily Production Log Sheet', dept: 'Production', retention: '1 Year', location: 'Production Cabinet A', protection: 'Binding', type: 'Hardcopy', status: 'Active' },
  { id: 'REC-QA-102', title: 'IQC Form (First Article)', dept: 'QA/QC', retention: '3 Years', location: 'Server / QA Folder', protection: 'Backup', type: 'Electronic', status: 'Active' },
  { id: 'REC-HR-003', title: 'Employee Training History', dept: 'HR', retention: '5 Years', location: 'HR File Room', protection: 'Locked Cabinet', type: 'Hardcopy', status: 'Active' },
  { id: 'REC-EN-012', title: 'Machine Maintenance Record', dept: 'Engineering', retention: 'Life of Machine', location: 'Maintenance Office', protection: 'Binder', type: 'Hardcopy', status: 'Active' },
  { id: 'REC-QM-001', title: 'Management Review Minutes', dept: 'Management', retention: '10 Years', location: 'Server / MR Folder', protection: 'Password', type: 'Electronic', status: 'Active' },
];

export default function RecordList() {
  const [search, setSearch] = useState('');
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const filteredRecords = useMemo(() => {
    return INITIAL_RECORDS.filter(r => 
      r.id.toLowerCase().includes(search.toLowerCase()) || 
      r.title.toLowerCase().includes(search.toLowerCase())
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
                      <Database size={28} strokeWidth={2.5} className="text-[#3f809e]" />
                  </div>
              </div>
              <div>
                  <h3 className="font-black text-[#212c46] uppercase tracking-tighter leading-none" style={{ fontSize: '24px' }}>
                      MASTER <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3f809e] to-[#b58c4f]">RECORD</span> LIST
                  </h3>
                  <p className="text-[11px] font-bold text-[#4d5a44] uppercase tracking-[0.2em] mt-0.5 opacity-80 leading-none">
                      QUALITY RECORD REGISTRY AND RETENTION CONTROL
                  </p>
              </div>
          </div>

          <div className="flex items-center gap-4">
              <button className="bg-white text-[#212c46] px-5 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-sm border border-[#f3f3f1] hover:bg-[#f3f3f1] transition-all flex items-center gap-2">
                <HardDriveDownload size={16}/> Export List
              </button>
              <button className="bg-[#657f4d] text-white px-6 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-md hover:bg-[#508660] transition-all flex items-center gap-2 border border-[#657f4d]">
                  <Plus size={16} /> New Record Entry
              </button>
          </div>
      </div>

      <div className="px-8 mt-2 pb-8 flex-1 overflow-y-auto custom-scrollbar">
        <div className="max-w-[1500px] w-full mx-auto space-y-6">
          
          {/* SEARCH row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
            <div className="lg:col-span-5 relative group">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7a8b95] group-focus-within:text-[#212c46] transition-colors" />
                <input 
                  type="text" 
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Filter records by ID or Name..."
                  className="w-full pl-12 pr-6 py-3.5 bg-white border border-[#f3f3f1] rounded-2xl text-[12px] font-bold text-[#212c46] outline-none focus:border-[#b7a159] shadow-sm transition-all"
                />
            </div>
            <div className="lg:col-span-7 flex justify-end gap-3">
               <div className="px-5 py-3 rounded-2xl bg-white border border-[#f3f3f1] shadow-sm flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#657f4d] animate-pulse"></div>
                  <span className="text-[11px] font-black text-[#212c46] uppercase">Active: 1,450</span>
               </div>
               <div className="px-5 py-3 rounded-2xl bg-white border border-[#f3f3f1] shadow-sm flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#932c2e]"></div>
                  <span className="text-[11px] font-black text-[#212c46] uppercase">Destroyed: 82</span>
               </div>
            </div>
          </div>

          {/* MASTER TABLE */}
          <div className="bg-white/90 rounded-3xl border border-[#f3f3f1] shadow-lg overflow-hidden">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left font-sans border-collapse min-w-[1100px]">
                <thead className="bg-[#212c46] text-white">
                  <tr className="border-b-2 border-[#b7a159]">
                    <th className="py-4 px-8 font-black uppercase tracking-widest text-[11px]">RECORD ID</th>
                    <th className="py-4 px-6 font-black uppercase tracking-widest text-[11px]">RECORD TITLE</th>
                    <th className="py-4 px-6 font-black uppercase tracking-widest text-[11px] text-center">OWNER DEPT</th>
                    <th className="py-4 px-6 font-black uppercase tracking-widest text-[11px] text-center">RETENTION</th>
                    <th className="py-4 px-6 font-black uppercase tracking-widest text-[11px]">LOCATION / PROTECTION</th>
                    <th className="py-4 px-6 font-black uppercase tracking-widest text-[11px] text-center">MEDIUM</th>
                    <th className="py-4 px-6 font-black uppercase tracking-widest text-[11px] text-center">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f3f3f1]">
                  {filteredRecords.map((rec) => (
                    <tr key={rec.id} className="hover:bg-[#f3f3f1]/40 transition-colors group">
                      <td className="py-4 px-8">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${THEME.success}15`, color: THEME.success }}>
                               <FileStack size={14} />
                            </div>
                            <span className="font-black text-[#212c46] text-[12px]">{rec.id}</span>
                         </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-bold text-[#212c46] text-[13px] line-clamp-1">{rec.title}</span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="text-[11px] font-black text-[#3f809e] uppercase tracking-widest">{rec.dept}</span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex flex-col items-center">
                           <span className="text-[12px] font-black" style={{ color: THEME.danger }}>{rec.retention}</span>
                           <span className="text-[8px] font-bold text-[#7a8b95] uppercase">(ISO Limit)</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                           <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#212c46]">
                              <Network size={12} className="text-[#7a8b95]" /> {rec.location}
                           </div>
                           <div className="flex items-center gap-1.5 text-[10px] text-[#7a8b95] font-medium mt-1">
                              <ShieldCheck size={11} className="#657f4d" /> Prot: {rec.protection}
                           </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className={`px-2 py-0.5 rounded font-black text-[9px] uppercase border ${rec.type === 'Electronic' ? `bg-[${THEME.skyBlue}10] text-[${THEME.skyBlue}] border-[${THEME.skyBlue}20]` : `bg-[${THEME.gold}10] text-[${THEME.gold}] border-[${THEME.gold}20]`}`}>
                           {rec.type}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                         <div className="flex justify-center items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                            <button className="p-1.5 text-[#7a8b95] hover:text-[#212c46] hover:bg-white rounded-lg transition-all shadow-sm">
                               <Eye size={16} />
                            </button>
                            <button className="p-1.5 text-[#7a8b95] hover:text-[#212c46] hover:bg-white rounded-lg transition-all shadow-sm">
                               <Pencil size={16} />
                            </button>
                         </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* PAGINATION */}
            <div className="px-8 py-4 bg-[#f3f3f1] border-t border-[#f3f3f1] flex justify-between items-center">
               <p className="text-[11px] font-bold text-[#7a8b95] uppercase tracking-widest">Master Registry Control • 1,450 total records</p>
               <div className="flex items-center gap-2">
                  <button className="p-1.5 border border-[#eaeaec] bg-white rounded-lg text-[#7a8b95] hover:bg-[#212c46] hover:text-white transition-all"><ChevronLeft size={16}/></button>
                  <button className="p-1.5 border border-[#eaeaec] bg-white rounded-lg text-[#7a8b95] hover:bg-[#212c46] hover:text-white transition-all"><ChevronRight size={16}/></button>
               </div>
            </div>
          </div>
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
                      <h3 className="font-black text-lg tracking-widest uppercase mb-0.5">Master Registry Guide</h3>
                      <p className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em]">Record Control Compliance</p>
                    </div>
                 </div>
                 <button onClick={() => setIsGuideOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={24}/></button>
              </div>
              <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-white custom-scrollbar text-[12px] leading-relaxed">
                 <div className="bg-[#f3f3f1] p-6 rounded-2xl border border-[#f3f3f1] shadow-sm">
                    <h4 className="font-black text-[#212c46] mb-2 uppercase tracking-tight flex items-center gap-2"><Database size={16} className="text-[#657f4d]"/> Record Registry</h4>
                    <p>รวบรวมรายการบันทึกคุณภาพทั้งหมดของบริษัทตามข้อกำหนด <strong className="text-[#212c46]">ISO 9001:2015</strong> เพื่อใช้ควบคุมอายุการจัดเก็บและวิธีการทำลายที่เหมาะสม</p>
                 </div>
              </div>
              <div className="p-6 bg-white border-t border-[#f3f3f1] flex justify-end">
                 <button onClick={() => setIsGuideOpen(false)} className="px-8 py-3 bg-[#212c46] text-white font-black rounded-2xl uppercase text-[11px] hover:bg-[#414757] transition-all shadow-md tracking-wider">Understood</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
