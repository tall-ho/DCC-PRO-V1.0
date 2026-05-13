import React, { useState } from 'react';
import { 
  History, Search, Filter, Printer, Download, 
  ExternalLink, MoreVertical, FileText, CheckCircle2, 
  XCircle, Clock, Calendar, Users, Eye, Trash2, ArrowUpDown,
  Tag, Info, AlertTriangle, Check
} from 'lucide-react';

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
    bgMain: '#f3f3f1',
    silver: '#d7d7d7'
};

const LOG_DATA = [
    { id: 'TR-26/001', date: '2026-04-10', dept: 'Production', auditor: 'Somchai A.', findType: 'Minor', status: 'Approved', score: 95 },
    { id: 'TR-26/002', date: '2026-04-12', dept: 'Warehouse', auditor: 'Wichai B.', findType: 'Major', status: 'Pending', score: 82 },
    { id: 'TR-26/003', date: '2026-04-15', dept: 'Pest Control', auditor: 'Somchai A.', findType: 'None', status: 'Approved', score: 100 },
    { id: 'TR-26/004', date: '2026-04-18', dept: 'Lab', auditor: 'Napa C.', findType: 'Minor', status: 'Rejected', score: 88 },
];

export default function TeamReportLog() {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className="flex flex-1 w-full flex-col pb-6 animate-iaFade bg-transparent px-8">
            {/* HEADER */}
            <div className="pt-3 pb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 z-20 shrink-0">
                <div className="flex items-center gap-5">
                    <div className="relative flex items-center justify-center group cursor-default shrink-0">
                        <div className="absolute inset-0 bg-[#b58c4f] blur-[15px] opacity-20 rounded-full group-hover:opacity-60 transition-all duration-700"></div>
                        <div className="relative z-10 p-2 border border-[#b58c4f]/40 rounded-2xl bg-white/50 backdrop-blur-sm shadow-sm">
                            <History size={28} strokeWidth={2.5} className="text-[#b58c4f]" />
                        </div>
                    </div>
                    <div>
                        <h3 className="font-black text-[#212c46] uppercase tracking-tighter leading-none" style={{ fontSize: '24px' }}>
                            TEAM REPORT <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b58c4f] to-[#212c46]">LOG BOOK</span>
                        </h3>
                        <p className="text-[11px] font-bold text-[#4d5a44] uppercase tracking-[0.2em] mt-0.5 opacity-80 leading-none">
                            HISTORICAL AUDIT FEEDBACK & PERFORMANCE RECORDS
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative no-print">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7a8b95]" size={14} />
                        <input 
                            type="text" 
                            placeholder="SEARCH LOGS..." 
                            className="bg-white/80 border border-[#eaeaec] pl-9 pr-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none focus:border-[#212c46] w-48 shadow-sm transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="p-2 bg-white border border-[#eaeaec] rounded-xl text-[#7a8b95] hover:text-[#212c46] transition-colors shadow-sm"><Filter size={18}/></button>
                    <button className="bg-[#212c46] text-white px-6 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-md hover:opacity-90 flex items-center gap-2 border border-[#212c46]">
                        <Printer size={16} /> Print Log
                    </button>
                </div>
            </div>

            {/* LOG TABLE */}
            <div className="flex-1 overflow-hidden bg-white/80 backdrop-blur-md rounded-[32px] border border-[#eaeaec] shadow-xl flex flex-col">
                <div className="px-6 py-4 border-b border-[#eaeaec] flex justify-between items-center bg-transparent">
                    <div className="flex items-center gap-2">
                        <Tag size={14} className="text-[#b58c4f]"/>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#7a8b95]">Archive Repository</span>
                    </div>
                    <span className="text-[9px] font-bold text-[#b58c4f] bg-[#b58c4f]/10 px-3 py-1 rounded-full uppercase tracking-widest">{LOG_DATA.length} Entries Archived</span>
                </div>

                <div className="flex-1 overflow-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead className="sticky top-0 bg-[#212c46] z-10">
                            <tr>
                                <th className="p-4 pl-8 text-[9px] font-black text-white uppercase tracking-widest">Report Ref</th>
                                <th className="p-4 text-[9px] font-black text-white uppercase tracking-widest">Date</th>
                                <th className="p-4 text-[9px] font-black text-white uppercase tracking-widest">Department</th>
                                <th className="p-4 text-[9px] font-black text-white uppercase tracking-widest text-center">Severity</th>
                                <th className="p-4 text-[9px] font-black text-white uppercase tracking-widest text-center">Score</th>
                                <th className="p-4 text-[9px] font-black text-white uppercase tracking-widest text-center">Status</th>
                                <th className="p-4 pr-8 text-[9px] font-black text-white uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#eaeaec]">
                            {LOG_DATA.filter(item => item.id.includes(searchTerm.toUpperCase())).map((log, idx) => (
                                <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="p-4 pl-8">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-[#212c46]/5 flex items-center justify-center text-[#212c46] group-hover:bg-[#212c46] group-hover:text-white transition-all">
                                                <FileText size={16}/>
                                            </div>
                                            <span className="text-[12px] font-black text-[#212c46]">{log.id}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-col">
                                            <span className="text-[11px] font-bold text-[#212c46]">{new Date(log.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                            <span className="text-[9px] text-[#7a8b95] font-mono mt-0.5">Historical Ref</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className="text-[11px] font-black text-[#3f809e] uppercase tracking-widest">{log.dept}</span>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                                            log.findType === 'Major' ? 'bg-red-50 text-red-600 border-red-100' :
                                            log.findType === 'Minor' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                                            'bg-green-50 text-green-600 border-green-100'
                                        }`}>
                                            {log.findType}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center">
                                        <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[#f3f3f1] border border-[#eaeaec]">
                                            <div className={`w-1.5 h-1.5 rounded-full ${log.score >= 90 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                            <span className="text-[12px] font-black text-[#212c46]">{log.score}%</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                            log.status === 'Approved' ? 'bg-green-50 text-green-600 border-green-100' :
                                            log.status === 'Pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                            'bg-red-50 text-red-600 border-red-100'
                                        }`}>
                                            {log.status}
                                        </span>
                                    </td>
                                    <td className="p-4 pr-8 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button className="p-2 hover:bg-[#212c46] hover:text-white rounded-lg transition-all text-[#7a8b95]"><Eye size={16}/></button>
                                            <button className="p-2 hover:bg-[#a94228] hover:text-white rounded-lg transition-all text-[#7a8b95]"><ExternalLink size={16}/></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                <div className="px-8 py-4 bg-[#f8f9fa]/50 border-t border-[#eaeaec] flex justify-between items-center shrink-0">
                    <p className="text-[10px] font-bold text-[#7a8b95] uppercase tracking-widest">Displaying logs from All Branches • Data Sync 100%</p>
                    <div className="flex gap-1">
                        {[1, 2, 3].map(p => (
                            <button key={p} className={`w-7 h-7 rounded-lg text-[10px] font-black flex items-center justify-center transition-all ${p === 1 ? 'bg-[#212c46] text-white shadow-lg' : 'bg-white text-[#7a8b95] hover:bg-slate-50 border border-[#eaeaec]'}`}>{p}</button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
