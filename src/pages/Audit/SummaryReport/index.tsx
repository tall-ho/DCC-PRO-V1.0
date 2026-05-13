import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, List, LayoutDashboard, Search, Save, 
  Printer, Check, AlertTriangle, FileText, 
  Globe, User, Building2, Box, Cpu, FileBadge,
  Users, Activity, ClipboardList, TrendingUp, X, 
  ChevronRight, HelpCircle, AlertCircle, PieChart as PieIcon,
  BookOpen
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

// --- Theme Configuration ---
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
  bgMain: 'transparent',
  white: '#ffffff',
  slateBlue: '#748ea1',
  warning: '#d96245',
  minor: '#b58c4f',
};

const SECTIONS_LIST = [
  { id: 'sec1', num: 1, label: 'SENIOR MANAGEMENT COMMITMENT', hint: 'policy, objective, communication, internal audit, management review', color: THEME.pinkAccent, icon: User, fields: ['POLICY / SOCIALIZATION', 'OBJECTIVE', 'COMMUNICATIONS', 'INTERNAL AUDIT', 'MANAGEMENT REVIEW'] },
  { id: 'sec2', num: 2, label: 'THE FOOD SAFETY PLAN - HACCP', hint: 'Hazard Analysis, HACCP Plan, CCP monitoring', color: THEME.success, icon: ShieldCheck, fields: ['HACCP TEAM', 'HAZARD ANALYSIS', 'MONITORING & CORRECTIVE ACTIONS'] },
  { id: 'sec3', num: 3, label: 'QMS & RECORDS', hint: 'Documentation, Control of records, Suppliers', color: THEME.gold, icon: FileText, fields: ['DOCUMENT CONTROL', 'RECORD KEEPING', 'SUPPLIER MANAGEMENT'] },
  { id: 'sec4', num: 4, label: 'SITE STANDARDS', hint: 'Infrastructure, Maintenance, Hygiene', color: THEME.slateBlue, icon: Building2, fields: ['BUILDING FABRIC', 'EQUIPMENT & MAINTENANCE', 'HOUSEKEEPING AND HYGIENE'] },
  { id: 'sec5', num: 5, label: 'PRODUCT CONTROL', hint: 'Product design, handling, allergen management', color: THEME.primaryLight, icon: Box, fields: ['PRODUCT DESIGN', 'ALLERGEN MANAGEMENT', 'PRODUCT HANDLING'] },
  { id: 'sec6', num: 6, label: 'PROCESS CONTROL', hint: 'Production operations, process flow', color: THEME.skyBlue, icon: Cpu, fields: ['OPERATIONS', 'PROCESS FLOW'] },
  { id: 'sec7', num: 7, label: 'PERSONNEL', hint: 'Training, competency, personal hygiene', color: THEME.brightGold, icon: Users, fields: ['TRAINING', 'COMPETENCY', 'PERSONAL HYGIENE'] },
];

const AVAILABLE_STANDARDS = ['ISO 9001:2015', 'ISO 14001:2015', 'ISO 45001:2018', 'FSSC 22000', 'GHPs&HACCP'];

export default function SummaryIaReport() {
  const [activeTab, setActiveTab] = useState('summary');
  const [activeDetailSection, setActiveDetailSection] = useState('sec1');
  
  const [formData, setFormData] = useState({
    auditNo: 'IA-26/001',
    auditDateStart: '2026-04-15',
    auditDateEnd: '2026-04-16',
    standards: ['ISO 9001:2015', 'ISO 14001:2015', 'ISO 45001:2018', 'FSSC 22000', 'GHPs&HACCP'],
    scope: 'All Production Processes and Storage Facilities',
    leadAuditor: 'Lead Auditor A',
    teamAuditors: 'Auditor B, Auditor C',
    overallConclusion: 'The quality system is implemented effectively.',
  });

  const [detailData, setDetailData] = useState({});

  const handleDetailChange = (secId, fieldIdx, value) => {
    setDetailData(prev => ({
      ...prev,
      [`${secId}_${fieldIdx}`]: value
    }));
  };

  const [ncData, setNcData] = useState(
    SECTIONS_LIST.map(sec => ({
      id: sec.id,
      label: `${sec.num}. ${sec.label}`,
      critical: 0,
      major: sec.num === 2 ? 1 : 0,
      minor: sec.num === 1 ? 1 : sec.num === 3 ? 4 : sec.num === 4 ? 2 : 0,
      pnc: sec.num === 3 ? 1 : 0,
      ofi: sec.num === 1 ? 2 : sec.num === 3 ? 3 : sec.num === 4 ? 1 : sec.num === 5 ? 1 : 0,
    }))
  );

  const totals = useMemo(() => {
    return ncData.reduce((acc, curr) => ({
      critical: acc.critical + curr.critical,
      major: acc.major + curr.major,
      minor: acc.minor + curr.minor,
      pnc: acc.pnc + curr.pnc,
      ofi: acc.ofi + curr.ofi
    }), { critical: 0, major: 0, minor: 0, pnc: 0, ofi: 0 });
  }, [ncData]);

  const radarData = useMemo(() => {
    return ncData.map(item => ({
      subject: item.label.substring(item.label.indexOf('.') + 2),
      totalNC: item.critical + item.major + item.minor + item.pnc + item.ofi
    }));
  }, [ncData]);

  const pieData = [
    { name: 'Critical', value: totals.critical, color: THEME.danger },
    { name: 'Major', value: totals.major, color: THEME.warning },
    { name: 'Minor', value: totals.minor, color: THEME.minor },
    { name: 'PNC', value: totals.pnc, color: THEME.primaryLight },
    { name: 'OFI', value: totals.ofi, color: THEME.success },
  ].filter(d => d.value > 0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStandardToggle = (std: string) => {
    setFormData(prev => {
      const current = [...prev.standards];
      if (current.includes(std)) return { ...prev, standards: current.filter(s => s !== std) };
      return { ...prev, standards: [...current, std] };
    });
  };

  const handleNcChange = (index: number, field: string, value: string) => {
    const newData = [...ncData];
    newData[index] = { ...newData[index], [field]: parseInt(value) || 0 };
    setNcData(newData);
  };

  return (
    <div className="flex flex-1 w-full flex-col pb-6 bg-transparent px-8 pt-4 custom-scrollbar overflow-y-auto">
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between z-20 shrink-0 mb-6 border-b border-gray-200 pb-4">
        <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#3f809e] to-[#4d87a8] blur-xl opacity-40 rounded-full animate-pulse"></div>
              <div className="p-3 bg-gradient-to-tr from-[#3f809e] to-[#4d87a8] rounded-xl text-white shadow-xl relative ring-1 ring-white/20">
                  <ClipboardList size={32} className="drop-shadow-md" />
              </div>
            </div>
            <div>
                <h3 className="font-black text-transparent bg-clip-text bg-gradient-to-r from-[#212c46] to-[#3f809e] uppercase text-2xl tracking-tighter leading-none mb-1">
                    INTERNAL AUDIT SUMMARY
                </h3>
                <p className="text-[12px] font-bold text-[#7a8b95] uppercase tracking-widest leading-none">
                    AUDIT RESULTS & MANAGEMENT REPORT SYSTEM
                </p>
            </div>
        </div>
        <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 text-[12px] font-black uppercase text-[#212c46] hover:text-[#3f809e] transition-colors bg-white px-4 py-2.5 rounded-lg border border-gray-200 shadow-sm">
              <BookOpen size={16} /> USER GUIDE
            </button>
            <button className="flex items-center gap-2 text-[12px] font-black uppercase text-white hover:opacity-90 transition-colors bg-gradient-to-r from-[#212c46] to-[#3f809e] px-5 py-2.5 rounded-lg shadow-md border-b-2 border-black/30">
              <Printer size={16} /> PREVIEW PDF
            </button>
        </div>
      </div>

      {/* CUSTOM TABS */}
      <div className="flex gap-2 mb-6">
        {[
          { id: 'summary', label: 'PART 1: AUDIT SUMMARY' },
          { id: 'results', label: 'PART 2: AUDIT RESULTS' },
          { id: 'details', label: 'PART 3: DETAILED REPORT' },
          { id: 'dashboard', label: 'PART 4: DASHBOARD' }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-3 rounded-lg text-[12px] font-black uppercase tracking-widest transition-all ${
              activeTab === tab.id 
                ? 'bg-gradient-to-r from-[#212c46] to-[#3f809e] text-white shadow-md border-b-4 border-black/30' 
                : 'bg-white text-[#7a8b95] border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* CONTENT: TABS */}
      <div className="flex-1">
          {activeTab === 'summary' && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden animate-iaFade">
                <div className="flex items-center gap-4 p-6 border-b border-gray-100 bg-gray-50/50">
                    <div className="w-10 h-10 bg-gradient-to-tr from-[#212c46] to-[#3f809e] rounded-xl flex items-center justify-center text-white font-black text-xl shadow-md">
                        1
                    </div>
                    <div>
                        <h4 className="font-black text-[#212c46] text-lg uppercase tracking-tight leading-none mb-1">AUDIT SUMMARY INFORMATION</h4>
                        <p className="text-[11px] font-bold text-[#7a8b95] uppercase tracking-widest">GENERAL CONTEXT & EXECUTIVE SUMMARY</p>
                    </div>
                </div>
                
                <div className="p-8">
                  <div className="bg-[#f8f9fa] rounded-xl border border-gray-200 p-6 space-y-6">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div>
                            <label className="text-[11px] font-black text-[#414757] uppercase block mb-2">REPORT NO. <span className="text-red-500">*</span></label>
                            <input type="text" name="auditNo" value={formData.auditNo} onChange={handleInputChange} className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 font-bold outline-none focus:border-[#212c46] text-[#212c46] text-[13px]" />
                         </div>
                         <div>
                            <label className="text-[11px] font-black text-[#414757] uppercase block mb-2">AUDIT PERIOD (ช่วงเวลาการตรวจ) <span className="text-red-500">*</span></label>
                            <div className="flex gap-3">
                              <input type="date" name="auditDateStart" value={formData.auditDateStart} onChange={handleInputChange} className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 font-bold outline-none focus:border-[#212c46] text-[#212c46] text-[13px]" />
                              <input type="date" name="auditDateEnd" value={formData.auditDateEnd} onChange={handleInputChange} className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 font-bold outline-none focus:border-[#212c46] text-[#212c46] text-[13px]" />
                            </div>
                         </div>
                     </div>

                     <div>
                        <label className="text-[11px] font-black text-[#414757] uppercase block mb-3">AUDIT CRITERIA / STANDARDS <span className="text-red-500">*</span></label>
                        <div className="flex flex-wrap gap-4 pt-1">
                            {AVAILABLE_STANDARDS.map(s => (
                                <label key={s} className="flex items-center gap-2 cursor-pointer bg-white px-4 py-2.5 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
                                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${formData.standards.includes(s) ? 'bg-[#212c46] border-[#212c46]' : 'border-gray-300 bg-white'}`}>
                                    {formData.standards.includes(s) && <Check size={12} className="text-white" strokeWidth={4} />}
                                  </div>
                                  <span className="text-[12px] font-black text-[#414757]">{s}</span>
                                  <input type="checkbox" checked={formData.standards.includes(s)} onChange={() => handleStandardToggle(s)} className="hidden" />
                                </label>
                            ))}
                        </div>
                     </div>

                     <div>
                        <label className="text-[11px] font-black text-[#414757] uppercase block mb-2">AUDIT SCOPE (ขอบข่ายการตรวจ) <span className="text-red-500">*</span></label>
                        <textarea name="scope" value={formData.scope} onChange={handleInputChange} rows={3} className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 font-bold outline-none focus:border-[#212c46] text-[#212c46] text-[13px] resize-none"></textarea>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div>
                            <label className="text-[11px] font-black text-[#414757] uppercase block mb-2">LEAD AUDITOR <span className="text-red-500">*</span></label>
                            <input type="text" name="leadAuditor" value={formData.leadAuditor} onChange={handleInputChange} className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 font-bold outline-none focus:border-[#212c46] text-[#212c46] text-[13px]" />
                         </div>
                         <div>
                            <label className="text-[11px] font-black text-[#414757] uppercase block mb-2">TEAM MEMBERS</label>
                            <input type="text" name="teamAuditors" value={formData.teamAuditors} onChange={handleInputChange} className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 font-bold outline-none focus:border-[#212c46] text-[#212c46] text-[13px]" />
                         </div>
                     </div>

                     <div>
                        <label className="text-[11px] font-black text-[#414757] uppercase block mb-2">OVERALL CONCLUSION (สรุปภาพรวม)</label>
                        <textarea name="overallConclusion" value={formData.overallConclusion} onChange={handleInputChange} rows={3} className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 font-bold outline-none focus:border-[#212c46] text-[#212c46] text-[13px] resize-none"></textarea>
                     </div>
                  </div>
                </div>
            </div>
          )}

          {activeTab === 'results' && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden animate-iaFade">
                <div className="flex items-center gap-4 p-6 border-b border-gray-100 bg-gray-50/50">
                    <div className="w-10 h-10 bg-gradient-to-tr from-[#212c46] to-[#3f809e] rounded-xl flex items-center justify-center text-white font-black text-xl shadow-md">
                        2
                    </div>
                    <div>
                        <h4 className="font-black text-[#212c46] text-lg uppercase tracking-tight leading-none mb-1">NON-CONFORMITY SUMMARY SHEET</h4>
                        <p className="text-[11px] font-bold text-[#7a8b95] uppercase tracking-widest">QUANTITATIVE NC BREAKDOWN</p>
                    </div>
                </div>

                <div className="p-8">
                  <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm text-[12px]">
                    <div className="bg-[#212c46] text-white p-3 font-black uppercase text-[12px] tracking-wider text-center">
                      QUANTITATIVE ANALYSIS BY REQUIREMENTS
                    </div>
                    <table className="w-full text-left">
                        <thead className="bg-[#f1f3f5] border-b-2 border-gray-300 uppercase font-black text-[#414757]">
                            <tr>
                                <th className="px-4 py-3 border-r border-gray-200 w-1/2">STANDARD REQUIREMENT / SECTION</th>
                                <th className="px-3 py-3 text-center border-r border-gray-200" style={{ color: THEME.danger }}>CRI</th>
                                <th className="px-3 py-3 text-center border-r border-gray-200" style={{ color: THEME.warning }}>MAJ</th>
                                <th className="px-3 py-3 text-center border-r border-gray-200" style={{ color: THEME.minor }}>MIN</th>
                                <th className="px-3 py-3 text-center border-r border-gray-200" style={{ color: THEME.primaryLight }}>PNC</th>
                                <th className="px-3 py-3 text-center" style={{ color: THEME.success }}>OFI</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white font-bold text-[#414757]">
                            {ncData.map((row, index) => (
                                <tr key={row.id} className={index % 2 === 0 ? 'bg-white' : 'bg-[#fafafa]'}>
                                    <td className="px-4 py-3 border-r border-gray-200">{row.label}</td>
                                    {['critical', 'major', 'minor', 'pnc', 'ofi'].map(field => (
                                        <td key={field} className="px-2 py-2 border-r border-gray-200 last:border-0">
                                            <input 
                                              type="number" 
                                              value={row[field as keyof typeof row]}
                                              onChange={(e) => handleNcChange(index, field, e.target.value)}
                                              className="w-full bg-transparent border-0 rounded-md px-1 py-1 text-center font-black outline-none focus:bg-white focus:ring-1 focus:ring-[#212c46] transition-all"
                                              min="0"
                                            />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="bg-[#f1f3f5] border-t-2 border-gray-300 font-black text-[13px] uppercase">
                            <tr>
                                <td className="px-4 py-4 text-right border-r border-gray-200 text-[#414757]">GRAND TOTAL NCS FOUND</td>
                                <td className="px-4 py-4 text-center border-r border-gray-200" style={{ color: THEME.danger, backgroundColor: `${THEME.danger}15` }}>{totals.critical}</td>
                                <td className="px-4 py-4 text-center border-r border-gray-200" style={{ color: THEME.warning, backgroundColor: `${THEME.warning}15` }}>{totals.major}</td>
                                <td className="px-4 py-4 text-center border-r border-gray-200" style={{ color: THEME.minor, backgroundColor: `${THEME.minor}15` }}>{totals.minor}</td>
                                <td className="px-4 py-4 text-center border-r border-gray-200" style={{ color: THEME.primaryLight, backgroundColor: `${THEME.primaryLight}15` }}>{totals.pnc}</td>
                                <td className="px-4 py-4 text-center" style={{ color: THEME.success, backgroundColor: `${THEME.success}15` }}>{totals.ofi}</td>
                            </tr>
                        </tfoot>
                    </table>
                  </div>
                </div>
            </div>
          )}

          {activeTab === 'details' && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-iaFade">
                <div className="lg:col-span-1 flex flex-col gap-2">
                    <div className="bg-gradient-to-r from-[#212c46] to-[#3f809e] text-white rounded-xl p-4 shadow-md mb-2 flex items-center gap-3 relative overflow-hidden">
                       <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
                       <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center font-black text-lg relative z-10">3</div>
                       <h4 className="font-black uppercase tracking-tight relative z-10">DETAILED AUDIT REPORT</h4>
                    </div>
                    {SECTIONS_LIST.map(sec => (
                        <button 
                          key={sec.id}
                          onClick={() => setActiveDetailSection(sec.id)}
                          className={`w-full text-left px-5 py-4 rounded-xl transition-all border font-bold text-[11px] uppercase flex items-center gap-3 ${
                            activeDetailSection === sec.id 
                                ? 'bg-white shadow-[0_4px_15px_rgb(0,0,0,0.05)] border-l-4' 
                                : 'bg-[#f0f2f5] border-transparent text-[#7a8b95] hover:bg-white'
                          }`}
                          style={{ borderLeftColor: activeDetailSection === sec.id ? sec.color : 'transparent', color: activeDetailSection === sec.id ? sec.color : undefined }}
                        >
                            <span className="shrink-0">{sec.num}.</span>
                            <span className="leading-snug">{sec.label}</span>
                        </button>
                    ))}
                </div>
                <div className="lg:col-span-3">
                    {SECTIONS_LIST.map(sec => sec.id === activeDetailSection && (
                        <div key={sec.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 animate-iaFade">
                            <h2 className="text-xl font-black uppercase mb-1" style={{ color: sec.color }}>{sec.num}. {sec.label}</h2>
                            <p className="text-[#7a8b95] text-[12px] font-bold uppercase tracking-widest mb-8 pb-4 border-b border-gray-100">{sec.hint}</p>
                            
                            <div className="space-y-6">
                                {sec.fields.map((field, idx) => (
                                    <div key={idx}>
                                        <label className="text-[12px] font-black text-[#414757] uppercase block mb-2">{field}</label>
                                        <textarea 
                                          value={(detailData as any)[`${sec.id}_${idx}`] || ''}
                                          onChange={(e) => handleDetailChange(sec.id, idx, e.target.value)}
                                          rows={3} 
                                          placeholder="ระบุผลการประเมิน หรือสิ่งที่พบ..."
                                          className="w-full bg-[#f8f9fa] border border-gray-300 rounded-lg px-4 py-3 font-bold outline-none focus:border-[#212c46] text-[#212c46] text-[13px] resize-y"
                                        ></textarea>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
          )}

          {activeTab === 'dashboard' && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden animate-iaFade">
                <div className="flex items-center gap-4 p-6 border-b border-gray-100 bg-gray-50/50">
                    <div className="w-10 h-10 bg-gradient-to-tr from-[#212c46] to-[#3f809e] rounded-xl flex items-center justify-center text-white font-black text-xl shadow-md">
                        4
                    </div>
                    <div>
                        <h4 className="font-black text-[#212c46] text-lg uppercase tracking-tight leading-none mb-1">ANALYTICS & DASHBOARD</h4>
                    </div>
                </div>

                <div className="p-8">
                    {/* KPI CARDS */}
                    <div className="grid grid-cols-5 gap-4 mb-8">
                        {[
                          { label: 'CRITICAL', value: totals.critical, color: THEME.danger },
                          { label: 'MAJOR', value: totals.major, color: THEME.warning },
                          { label: 'MINOR', value: totals.minor, color: THEME.minor },
                          { label: 'PNC', value: totals.pnc, color: THEME.primaryLight },
                          { label: 'OFI', value: totals.ofi, color: THEME.success },
                        ].map(kpi => (
                            <div key={kpi.label} className="rounded-xl border border-gray-200 bg-white p-4 flex flex-col relative overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                                <div className="absolute top-0 left-0 w-1.5 h-full opacity-80" style={{ backgroundColor: kpi.color }}></div>
                                <div className="absolute top-3 right-3 opacity-20 transition-transform group-hover:scale-110 group-hover:opacity-40" style={{ color: kpi.color }}><AlertCircle size={28}/></div>
                                <span className="text-[11px] font-black uppercase tracking-widest opacity-80 mb-1 ml-2" style={{ color: kpi.color }}>{kpi.label}</span>
                                <span className="text-3xl font-black leading-none ml-2 text-[#212c46]">{kpi.value}</span>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="border border-gray-200 rounded-xl p-6 shadow-sm bg-white">
                            <h4 className="text-[12px] font-black uppercase text-[#414757] border-b border-gray-100 pb-3 mb-4">FINDINGS PER SECTION (RADAR)</h4>
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                                        <PolarGrid stroke="#eaeaec" />
                                        <PolarAngleAxis dataKey="subject" tick={{fontSize: 9, fontWeight: 'bold', fill: '#7a8b95'}} />
                                        <PolarRadiusAxis angle={30} domain={[0, 'dataMax + 2']} tick={false} />
                                        <Radar name="Findings" dataKey="totalNC" stroke={THEME.primary} strokeWidth={2} fill={THEME.primaryLight} fillOpacity={0.4} />
                                        <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', fontWeight: 'bold', fontSize: '11px', color: THEME.primary, textTransform: 'uppercase' }} />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        <div className="border border-gray-200 rounded-xl p-6 shadow-sm bg-white">
                            <h4 className="text-[12px] font-black uppercase text-[#414757] border-b border-gray-100 pb-3 mb-4">NC SEVERITY BREAKDOWN</h4>
                            <div className="h-[300px] flex items-center justify-center">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={pieData} cx="50%" cy="50%" innerRadius={75} outerRadius={105} paddingAngle={4} dataKey="value" stroke="none">
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', fontWeight: 'bold', fontSize: '11px', color: THEME.primary, textTransform: 'uppercase' }} />
                                        <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 'bold', color: '#414757', paddingTop: '10px' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          )}
      </div>
    </div>
  );
}
