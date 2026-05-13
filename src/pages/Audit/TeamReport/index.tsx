import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Calendar, 
  ClipboardList, 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  Filter, 
  Plus, 
  FileText, 
  Printer, 
  Download, 
  TrendingUp,
  ShieldCheck,
  ChevronRight,
  MoreHorizontal,
  X,
  PlusCircle,
  Save,
  HelpCircle
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';

// --- Theme Configuration (Synced with DCC PRO Palette) ---
const THEME = {
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
  bgMain: '#f3f3f1',
  white: '#ffffff',
  slateBlue: '#748ea1',
  burntOrange: '#d96245'
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

const KpiCard = ({ icon: Icon, value, label, colorAccent, colorValue, desc }: any) => (
    <div className="bg-white/90 px-6 py-6 rounded-2xl border border-[#eaeaec] shadow-sm flex-1 min-w-[200px] relative overflow-hidden group hover:border-[#b7a159] transition-all min-h-[120px] flex flex-col justify-between animate-fadeIn">
        <div className="absolute -right-4 -bottom-6 opacity-[0.05] transform group-hover:scale-110 transition-transform duration-700 pointer-events-none">
            <Icon size={110} color={colorAccent} />
        </div>
        <div className="relative z-10 flex justify-between items-start w-full">
            <p className="text-[11px] font-bold text-[#7a8b95] uppercase tracking-[0.1em] drop-shadow-sm">{label}</p>
            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 shadow-sm transition-all group-hover:rotate-6`} style={{backgroundColor: `${colorAccent}15`, borderColor: `${colorAccent}25`, color: colorAccent}}>
                <Icon size={20} />
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

export default function TeamAuditReport() {
  const [activeTab, setActiveTab] = useState('registry');
  const [search, setSearch] = useState('');

  const reports = [
    { id: 'TAR-2024-001', date: '2024-05-10', dept: 'Production', lead: 'Somchai W.', status: 'Draft', ncCount: 3, obsCount: 5 },
    { id: 'TAR-2024-002', date: '2024-05-11', dept: 'Quality Control', lead: 'Suda Q.', status: 'Submitted', ncCount: 0, obsCount: 2 },
    { id: 'TAR-2024-003', date: '2024-05-12', dept: 'Warehouse', lead: 'Phichamon A.', status: 'Approved', ncCount: 1, obsCount: 4 }
  ];

  return (
    <div className="flex flex-1 w-full flex-col pb-6 animate-fadeIn bg-transparent px-8">
      <style dangerouslySetInnerHTML={{__html: globalStyles}} />

      {/* HEADER SECTION */}
      <div className="pt-3 pb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 z-20 shrink-0">
          <div className="flex items-center gap-5">
              <div className="relative flex items-center justify-center group cursor-default shrink-0">
                  <div className="absolute inset-0 bg-[#3f809e] blur-[15px] opacity-20 rounded-full group-hover:opacity-60 transition-all duration-700"></div>
                  <div className="relative z-10 p-1.5 border border-[#3f809e]/40 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm">
                      <Users size={28} strokeWidth={2.5} className="text-[#3f809e]" />
                  </div>
              </div>
              <div>
                  <h3 className="font-black text-[#212c46] uppercase tracking-tighter leading-none" style={{ fontSize: '24px' }}>
                      TEAM AUDIT <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3f809e] to-[#b58c4f]">REPORT</span> HUB
                  </h3>
                  <p className="text-[11px] font-bold text-[#4d5a44] uppercase tracking-[0.2em] mt-0.5 opacity-80 leading-none">
                      INTERNAL TEAM PERFORMANCE & FINDINGS LOG
                  </p>
              </div>
          </div>

          <div className="flex gap-3">
              <button className="bg-[#212c46] text-white px-6 py-2.5 rounded-full font-black text-[12px] uppercase tracking-widest shadow-md hover:bg-[#414757] transition-all flex items-center gap-2">
                <Plus size={16} /> Create Report
              </button>
          </div>
      </div>

      {/* KPI STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
          <KpiCard label="Total Reports" value="128" icon={ClipboardList} colorAccent={THEME.primaryLight} colorValue={THEME.primary} desc="Reports YTD" />
          <KpiCard label="Open NCs" value="12" icon={AlertTriangle} colorAccent={THEME.danger} colorValue={THEME.danger} desc="Requires Action" />
          <KpiCard label="Audit Hours" value="450" icon={ShieldCheck} colorAccent={THEME.success} colorValue={THEME.primary} desc="Team Effort" />
          <KpiCard label="Completion" value="94%" icon={TrendingUp} colorAccent={THEME.brightGold} colorValue={THEME.brightGold} desc="Against Plan" />
      </div>

      {/* MAIN LOG TABLE */}
      <div className="bg-white rounded-3xl shadow-lg border border-[#eaeaec] overflow-hidden flex flex-col">
          <div className="px-8 py-5 border-b border-[#eaeaec] bg-[#f8f9fa] flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex bg-[#f8f9fa] border border-[#eaeaec] p-1 rounded-full shadow-sm inline-flex">
                  <button onClick={() => setActiveTab('registry')} className={`px-5 py-2 text-[11px] font-black uppercase tracking-widest rounded-full transition-all ${activeTab === 'registry' ? 'bg-[#212c46] text-white shadow-md' : 'text-[#7a8b95] hover:text-[#a94228]'}`}>
                      Recent Reports
                  </button>
                  <button onClick={() => setActiveTab('findings')} className={`px-5 py-2 text-[11px] font-black uppercase tracking-widest rounded-full transition-all ${activeTab === 'findings' ? 'bg-[#212c46] text-white shadow-md' : 'text-[#7a8b95] hover:text-[#a94228]'}`}>
                      Global Findings
                  </button>
              </div>
              <div className="relative w-full md:w-80">
                  <Search size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-[#7a8b95]" />
                  <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search report codes..." className="w-full pl-12 pr-6 py-2.5 text-[12px] border border-[#eaeaec] rounded-full font-bold outline-none focus:border-[#b7a159] bg-white text-[#212c46]" />
              </div>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left font-sans border-collapse">
                  <thead>
                      <tr className="bg-[#212c46] text-white border-b-2 border-[#b7a159]">
                          <th className="py-4 px-6 font-black uppercase tracking-widest text-[11px] whitespace-nowrap">Report ID</th>
                          <th className="py-4 px-6 font-black uppercase tracking-widest text-[11px] whitespace-nowrap">Audit Date</th>
                          <th className="py-4 px-6 font-black uppercase tracking-widest text-[11px] whitespace-nowrap">Audited Unit</th>
                          <th className="py-4 px-6 font-black uppercase tracking-widest text-[11px] whitespace-nowrap">Lead Auditor</th>
                          <th className="py-4 px-6 font-black uppercase tracking-widest text-[11px] text-center">Findings</th>
                          <th className="py-4 px-6 font-black uppercase tracking-widest text-[11px] text-center">Status</th>
                          <th className="py-4 px-6 font-black uppercase tracking-widest text-[11px] text-center">Actions</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-[#eaeaec]">
                      {reports.map((r, i) => (
                          <tr key={r.id} className="hover:bg-[#f8f9fa] transition-colors group">
                              <td className="py-4 px-6 font-black text-[#212c46] text-[12px]">{r.id}</td>
                              <td className="py-4 px-6 font-mono text-[#7a8b95] text-[12px]">{r.date}</td>
                              <td className="py-4 px-6 font-bold text-[#4d87a8] uppercase text-[11px] tracking-wide">{r.dept}</td>
                              <td className="py-4 px-6 font-bold text-[#414757] text-[12px]">{r.lead}</td>
                              <td className="py-4 px-6">
                                  <div className="flex items-center justify-center gap-2">
                                      <span className="px-2 py-0.5 rounded bg-red-100 text-[#932c2e] text-[10px] font-black">{r.ncCount} NC</span>
                                      <span className="px-2 py-0.5 rounded bg-blue-100 text-[#3f809e] text-[10px] font-black">{r.obsCount} OBS</span>
                                  </div>
                              </td>
                              <td className="py-4 px-6 text-center">
                                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                      r.status === 'Approved' ? `bg-[${THEME.success}15] text-[${THEME.success}] border-[${THEME.success}30]` : 
                                      r.status === 'Submitted' ? `bg-[${THEME.skyBlue}15] text-[${THEME.skyBlue}] border-[${THEME.skyBlue}30]` : 
                                      `bg-[${THEME.dustyBlue}15] text-[${THEME.dustyBlue}] border-[${THEME.dustyBlue}30]`
                                  }`}>
                                      {r.status}
                                  </span>
                              </td>
                              <td className="py-4 px-6 text-center">
                                  <div className="flex justify-center gap-1">
                                      <button className="p-2 hover:bg-[#eaeaec] rounded-lg transition-all text-[#212c46]"><FileText size={16}/></button>
                                      <button className="p-2 hover:bg-[#eaeaec] rounded-lg transition-all text-[#4d87a8]"><Printer size={16}/></button>
                                      <button className="p-2 hover:bg-[#eaeaec] rounded-lg transition-all text-[#a94228]"><Download size={16}/></button>
                                  </div>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
          
          <div className="p-6 bg-[#f8f9fa] border-t border-[#eaeaec] flex justify-between items-center shrink-0">
              <span className="text-[10px] font-black text-[#7a8b95] uppercase tracking-widest">Showing 3 of 128 reports</span>
              <div className="flex gap-2">
                  <button className="px-4 py-1.5 bg-white border border-[#eaeaec] text-[#212c46] rounded-lg text-[11px] font-bold hover:bg-[#eaeaec] transition-all">Previous</button>
                  <button className="px-4 py-1.5 bg-[#212c46] text-white rounded-lg text-[11px] font-bold shadow-md">Next</button>
              </div>
          </div>
      </div>
    </div>
  );
}
