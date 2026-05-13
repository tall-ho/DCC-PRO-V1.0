import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  ShoppingCart, 
  TrendingDown, 
  Target, 
  Truck, 
  BarChart2, 
  Settings, 
  Menu,
  ChevronRight,
  ChevronDown,
  AlertCircle,
  Building2,
  Clock,
  PackageCheck,
  PhoneCall,
  Mail,
  Calendar,
  Library,
  DollarSign,
  PieChart,
  Award,
  Globe,
  Bell,
  Sparkles,
  Factory,
  CheckCircle2,
  FileText,
  ClipboardList,
  ShieldCheck,
  LogOut,
  Container,
  Database,
  FileSearch,
  Scale,
  CreditCard,
  Zap,
  Handshake,
  Filter,
  Megaphone,
  Briefcase,
  TrendingUp,
  MessageSquare,
  Percent,
  UserPlus,
  PartyPopper,
  Send,
  CheckSquare,
  GraduationCap,
  Info,
  User,
  AlertTriangle,
  Activity,
  Plus,
  BrainCircuit,
  Heart,
  CalendarDays,
  Banknote,
  Network
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import UserPermission from '../UserPermissions';
import SystemConfig from '../SystemConfig';
import DevPermit from '../DevPermit';
import SystemLogs from '../SystemLogs';
import CalendarHub from '../Calendar';
import SaleOrder from '../SaleOrder/index';
import ProductsCatalogue from '../ProductsCatalogue';
import CarLog from '../Audit/CaRequest/Log';
import Pending from '../Audit/CaRequest/Pending';
import QualifiedAuditors from '../Audit/Auditor/QualifiedAuditors';
import ExternalDocuments from '../MasterList/ExternalDocuments';
import DistributionLog from '../DocumentDistribution/Log';
import DistributionPending from '../DocumentDistribution/Pending';
import DocumentList from '../MasterList/DocumentList';
import DarPending from '../DocumentRequest/Pending';
import DarForm from '../DocumentRequest/Form';
import DestructPending from '../RecordDestruction/Pending';
import DestructLog from '../RecordDestruction/Log';
import RecordList from '../MasterList/Records';
import DocHistory from '../MasterList/DocHistory';
import AiCopilot from '../AiCopilot';
import TeamAuditReport from '../Audit/TeamReport';
import AuditPlan from '../Audit/YearlyPlan';
import SummaryIaReport from '../Audit/SummaryReport';
import SummaryReportLog from '../Audit/SummaryReportLog';
import TeamReportLog from '../Audit/TeamLog';
import SecondPartyReportLog from '../Audit/SecondPartyLog';
import ThirdPartyReportLog from '../Audit/ThirdPartyLog';
import CaRequestEntry from '../Audit/CaRequest/Entry';
import AuditorLog from '../Audit/AuditorLog';
import AuditSchedule from '../Audit/AuditSchedule';
import { useVisibility } from '../../context/ModuleVisibilityContext';
import { DraggableModal } from '../../components/shared/DraggableModal';

// --- Theme Configuration (Vibrant Palette) ---
const THEME = {
    bgMain: '#f3f3f1',
    bgGradient: 'linear-gradient(135deg, #f3f3f1 0%, #f3f3f1 100%)',
    sidebarBg: 'linear-gradient(180deg, #1d2636 0%, #0F172A 100%)',
    glassWhite: 'rgba(255, 255, 255, 0.88)',
    primary: '#212c46',
    primaryLight: '#4d87a8',
    accent: '#a94228',
    gold: '#b58c4f',
    brightGold: '#b7a159',
    success: '#657f4d',
    danger: '#932c2e',
    warning: '#a94228',
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
    coolGray: '#f3f3f1',
    c1: '#b22026',
    c2: '#932c2e',
    c3: '#851c24',
    c4: '#a94228',
    c5: '#d96245',
    c6: '#b58c4f',
    c7: '#b7a159',
    c8: '#8e9141',
    c9: '#5f7ab7',
    c10: '#bceadf',
    c11: '#f91a47',
    c12: '#fdda04',
    c13: '#e7dedd',
    c14: '#a74353',
    c15: '#c3924c',
    c16: '#ffa64a',
    c17: '#e8cec2',
    c18: '#f46e61',
    c19: '#972956',
    c20: '#9293c3',
    c21: '#ca649f',
    c22: '#dba1c2',
    c23: '#214573',
    c24: '#091d38',
};

// --- System Modules Data ---
import { SYSTEM_MODULES } from '../../config/modules';

const MOCK_STATS = [
    { label: 'Total Documents', value: '1,450', sub: '+12 New Docs (YTD)', icon: Users, color: THEME.c11 },
    { label: 'Pending Approval', value: '24', sub: 'Urgent: 5 docs', icon: Briefcase, color: THEME.c2 },
    { label: 'Compliance Index', value: '96.2%', sub: 'Target: 95%', icon: TrendingUp, color: THEME.c16 },
    { label: 'Overdue Reviews', value: '18', sub: 'Requires action', icon: Target, color: THEME.c21 },
];

const GlassCard = ({ children, className = '', hoverEffect = true, style = {} }: any) => (
    <div className={`rounded-2xl p-4 backdrop-blur-xl shadow-[0_8px_30px_rgba(31,42,68,0.06)] border border-white/60 ${hoverEffect ? 'hover:-translate-y-1 transition-transform duration-300' : ''} ${className}`}
        style={{ backgroundColor: THEME.glassWhite, ...style }}>
        {children}
    </div>
);

const HeroBanner = () => {
    const bgImage = "https://images.squarespace-cdn.com/content/v1/633df27af45a3748448599db/1711379914081-JO5IEEHV7FN5YXFQ5C2N/image-asset.jpeg";
    return (
      <div className="relative w-full rounded-2xl overflow-hidden shadow-xl mb-4 group bg-[#212c46] border border-[#414757]">
        <div className="absolute inset-0 transform transition-transform duration-[2000ms] group-hover:scale-105">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-60"
            style={{ backgroundImage: `url(${bgImage})`, backgroundPosition: 'center 35%' }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#212c46]/95 via-[#212c46]/70 to-transparent" />
        <div className="relative z-10 h-full flex items-center justify-between p-4 md:px-6 py-4 md:py-5 w-full">
          <div className="flex flex-col justify-center w-full">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle size={12} className="text-[#d96245]" />
              <span className="text-[9px] text-[#d96245] font-black uppercase tracking-[0.2em] drop-shadow-sm">Compliance Alert</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight leading-none mb-3 drop-shadow-md truncate">
              Audit Approaching: <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d96245] to-[#b7a159]">ISO9001 Recertification</span>
            </h2>
            <div className="mb-4">
              <p className="text-white/90 text-[11px] font-medium leading-relaxed max-w-2xl truncate">
                AI has detected an <span className="font-bold text-white">82% probability</span> of non-compliance within 30 days for 3 Quality Manuals. Primary factors: Outdated revision status and missing management review records.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              <button className="bg-[#932c2e] hover:bg-[#851c24] border border-[#a94228]/30 text-white px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-[0.1em] transition-all flex items-center gap-2 shadow-lg">
                <Zap size={12} /> Review Audit Schedule
              </button>
              <div className="bg-white/5 border border-white/10 px-3 py-1.5 text-center rounded-lg flex items-center gap-1.5 shadow-inner backdrop-blur-md">
                <Activity size={12} className="text-[#657f4d]" />
                <span className="text-white font-black tracking-tighter text-xs">98.5%</span>
                <span className="text-[8px] text-white/50 font-bold uppercase tracking-widest leading-none mt-0.5">YTD Compliance Rate</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
};

const MetricCard = ({ label, val, unit, icon: Icon, color, desc }: any) => (
  <div className="bg-white/90 rounded-2xl p-4 shadow-sm border border-[#f3f3f1] relative overflow-hidden group h-full transition-all hover:shadow-md">
    <div className="absolute -right-6 -bottom-6 opacity-[0.1] transform rotate-12 group-hover:scale-110 transition-all duration-700 pointer-events-none z-0">
        <Icon size={100} style={{color: color}} />
    </div>
    <div className="relative z-10 flex justify-between items-start">
        <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold text-[#7a8b95] uppercase tracking-wider opacity-90 truncate">{label}</p>
            <h4 className="text-2xl font-black tracking-tight mt-0.5" style={{color: THEME.primary}}>{val}</h4>
            {desc && (
                <p className="text-[10px] text-[#7a8b95] font-bold mt-2 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full" style={{backgroundColor: color}}></span>
                    {desc}
                </p>
            )}
        </div>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-white backdrop-blur-md shadow-sm" 
            style={{backgroundColor: color + '15'}}>
            <Icon size={18} style={{color: color}} />
        </div>
    </div>
  </div>
);

const SalesChartArea = () => {
  const data = [
    { name: "Quality Manuals", target: 60, actual: 64, color: THEME.c2 },
    { name: "Procedures", target: 25, actual: 20, color: THEME.c11 },
    { name: "Work Instructions", target: 15, actual: 16, color: THEME.c16 },
  ];
  return (
    <GlassCard className="lg:col-span-2 bg-gradient-to-br from-white to-[#f3f3f1] border-[#f3f3f1]">
      <div className="flex justify-between items-center mb-4 relative z-10">
        <h2 className="text-base font-black text-[#212c46] flex items-center gap-2 uppercase tracking-tight">
            <BarChart2 size={16} className="text-[#932c2e]" /> Document Distribution
        </h2>
        <span className="text-[8px] text-white font-black bg-[#3f809e] px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">Real-time</span>
      </div>
      <div className="space-y-4 relative z-10">
        {data.map((item, i) => (
            <div key={i} className="flex items-center gap-4 group/bar">
              <div className="w-28 text-[9px] font-black text-[#435665] uppercase truncate tracking-tight">{item.name}</div>
              <div className="flex-1 h-4 rounded-lg relative flex items-center bg-[#f3f3f1]/40 shadow-inner overflow-hidden">
                <div className="h-full transition-all duration-1000 relative z-10 rounded-lg"
                  style={{ width: `${item.actual}%`, background: `linear-gradient(90deg, ${item.color}, ${item.color}dd)` }} />
              </div>
              <div className="w-10 text-right">
                <span className="text-[10px] font-black text-[#212c46]">{item.actual}%</span>
              </div>
            </div>
        ))}
      </div>
    </GlassCard>
  );
};

const UrgentTasks = () => (
  <GlassCard className="bg-gradient-to-b from-white to-[#f3f3f1]/20 border-[#7a8b95]/30">
    <div className="flex justify-between items-center mb-4 relative z-10">
      <h2 className="text-base font-black text-[#212c46] flex items-center gap-2 uppercase tracking-tight">
          <AlertCircle size={16} className="text-[#932c2e]" /> Critical Action
      </h2>
      <span className="text-[8px] font-black bg-[#932c2e]/10 text-[#932c2e] px-3 py-1 rounded-full uppercase tracking-widest">3 Tasks</span>
    </div>
    <div className="space-y-2.5 relative z-10">
        {[
          { title: "Approve Quality Manual - ISO9001", type: "Document Approval", icon: ShoppingCart, urgent: true, color: 'text-[#932c2e]', bg: 'bg-[#932c2e]/10' },
          { title: "Review Audit Report - Q1", type: "Audit Review", icon: Target, urgent: true, color: 'text-[#d96245]', bg: 'bg-[#d96245]/10' },
          { title: "Review Q3 Management Cycle", type: "Management Review", icon: Megaphone, urgent: false, color: 'text-[#3f809e]', bg: 'bg-[#3f809e]/10' },
        ].map((task, i) => (
          <div key={i} className="p-3 bg-white/70 rounded-xl border border-[#f3f3f1]/30 flex gap-3 items-start hover:bg-white transition-all shadow-sm">
            <div className={`p-2 rounded-lg ${task.bg} ${task.color} shrink-0`}>
                <task.icon size={12}/>
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black text-[#1f2a44] tracking-tight truncate">{task.title}</p>
                <div className="flex justify-between items-center mt-1">
                    <p className="text-[8px] text-[#7a8b95] font-bold uppercase">{task.type}</p>
                    {task.urgent && <span className="text-[7px] font-black text-[#a94228] uppercase animate-pulse">Critical</span>}
                </div>
            </div>
          </div>
        ))}
    </div>
    <button className="w-full mt-4 py-3 bg-[#1f2a44] text-white text-[9px] font-bold uppercase rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 tracking-widest hover:bg-[#254268]">
        <Calendar size={12} /> Schedule
    </button>
  </GlassCard>
);

const NavItem = ({ item, depth = 0, activeTab, setActiveTab, expandedMenus, toggleMenu, isSidebarOpen }: any) => {
    if (item.isHeading) {
        if (!isSidebarOpen) return <div className="h-4" />;
        return (
            <div className="mt-6 mb-2 px-4">
                <span className="text-[10px] font-black text-[#7a8b95] uppercase tracking-widest opacity-80">{item.label}</span>
            </div>
        );
    }

    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isExpanded = expandedMenus[item.id];
    const isActive = activeTab === item.id;
    const isChildActive = (items: any) => items?.some((child: any) => child.id === activeTab || isChildActive(child.subItems));
    const childActive = isChildActive(item.subItems);

    if (depth === 0) {
        return (
            <div className="mb-1.5">
                <button onClick={() => hasSubItems ? toggleMenu(item.id) : setActiveTab(item.id)}
                    className={`group w-full flex items-center transition-all duration-300 relative rounded-xl mx-auto
                        ${isActive ? 'text-white shadow-[0_2px_10px_rgba(63,128,158,0.3)] bg-gradient-to-r from-[#3f809e] to-[#4d87a8]' : childActive ? 'text-white bg-white/5' : 'text-slate-400 hover:text-white hover:bg-white/5'}
                        ${!isSidebarOpen ? 'justify-center w-12 px-0' : 'w-[94%] px-3 justify-start'} py-3`}
                    >
                    <item.icon size={18} className={`relative z-10 transition-transform ${isActive ? 'text-white scale-105' : childActive ? 'text-white scale-105' : 'text-slate-400 group-hover:text-white'}`} />
                    {isSidebarOpen && (
                        <div className="relative z-10 flex items-center justify-between flex-1 ml-3 overflow-hidden">
                            <span className={`text-[11.5px] tracking-wider uppercase text-left ${isActive || childActive ? 'font-black text-white' : 'font-bold'}`}>{item.label}</span>
                            {hasSubItems && <ChevronDown size={14} className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />}
                        </div>
                    )}
                </button>
                {isSidebarOpen && hasSubItems && (
                    <div className={`overflow-hidden transition-all duration-500 ${isExpanded ? 'max-h-[500px] opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                        {item.subItems.map((sub: any) => (
                            <NavItem key={sub.id} item={sub} depth={depth + 1} activeTab={activeTab} setActiveTab={setActiveTab} expandedMenus={expandedMenus} toggleMenu={toggleMenu} isSidebarOpen={isSidebarOpen} />
                        ))}
                    </div>
                )}
            </div>
        );
    } else {
        const paddingLeft = depth * 12 + 15;
        return (
            <div className="mb-1">
                <button onClick={() => hasSubItems ? toggleMenu(item.id) : setActiveTab(item.id)}
                    className={`w-full flex items-center py-2.5 pr-3 rounded-xl transition-all relative group
                        ${isActive ? 'bg-gradient-to-r from-[#3f809e] to-[#4d87a8] text-white shadow-md shadow-[#3f809e]/20' : 'text-slate-400 hover:text-white hover:bg-white/5 font-bold'}`}
                    style={{ paddingLeft: `${paddingLeft}px` }}>
                    <div className={`w-1.5 h-1.5 rounded-full mr-2.5 transition-all ${isActive ? 'bg-white scale-125' : 'bg-slate-500 group-hover:bg-white opacity-40 group-hover:opacity-100'}`} />
                    <span className={`flex-1 text-left text-[10.5px] uppercase tracking-wider truncate ${isActive ? 'font-black' : ''}`}>{item.label}</span>
                    {hasSubItems && <ChevronDown size={12} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />}
                </button>
                {isSidebarOpen && hasSubItems && (
                    <div className={`overflow-hidden transition-all duration-500 ${isExpanded ? 'max-h-[500px] opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                        {item.subItems.map((sub: any) => (
                            <NavItem key={sub.id} item={sub} depth={depth + 1} activeTab={activeTab} setActiveTab={setActiveTab} expandedMenus={expandedMenus} toggleMenu={toggleMenu} isSidebarOpen={isSidebarOpen} />
                        ))}
                    </div>
                )}
            </div>
        );
    }
};

// --- Main App ---

const NewFamilyMembers = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<any>(null);

    const members = [
      { name: 'Quality Manual 2026', role: 'DCC-QM-01', dept: 'Quality', joinDate: '01 Jan', img: 'https://images.unsplash.com/photo-1568227451052-a5e182813580?w=150&h=150&fit=crop' },
      { name: 'Audit Procedure', role: 'DCC-PR-05', dept: 'Audit', joinDate: '02 Jan', img: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=150&h=150&fit=crop' },
      { name: 'Risk Protocol', role: 'DCC-WI-12', dept: 'Risk', joinDate: '05 Jan', img: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=150&h=150&fit=crop' },
    ];

    const openWelcome = (m: any) => {
      setSelectedMember(m);
      setIsModalOpen(true);
    };

    return (
      <>
      <GlassCard className="bg-white border-[#f3f3f1] col-span-1 lg:col-span-2 relative overflow-hidden">
        <div className="absolute right-[-5%] top-[-10%] opacity-[0.03] pointer-events-none transform rotate-12 z-0">
          <FileText size={240} />
        </div>
        <div className="flex justify-between items-center mb-6 relative z-10">
           <h2 className="text-sm font-black text-[#212c46] flex items-center gap-2 uppercase tracking-wide">
             <FileText size={16} className="text-[#3f809e]" /> OUR NEW DOCUMENTS
           </h2>
           <span className="text-[9px] font-black text-[#3f809e] bg-[#3f809e]/10 px-3 py-1.5 rounded-full uppercase tracking-widest border border-[#3f809e]/20 hover:bg-[#3f809e] hover:text-white transition-colors cursor-pointer">VIEW ALL</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
          {members.map((m, i) => (
            <div key={i} onClick={() => openWelcome(m)} className="bg-white rounded-2xl border border-[#f3f3f1]/30 hover:border-[#3f809e]/60 p-5 flex flex-col items-center relative shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group">
              <div className="relative mb-4">
                <img src={m.img} alt={m.name} className="w-16 h-16 rounded-2xl object-cover shadow-md" />
                <div className="absolute -bottom-2 -right-2 bg-[#4d87a8] p-1.5 rounded-lg text-white shadow-sm border-2 border-white group-hover:scale-110 transition-transform">
                  <Sparkles size={12} />
                </div>
              </div>
              <h3 className="text-[#212c46] font-bold text-sm mb-1">{m.name}</h3>
              <p className="text-[#4d87a8] text-[9px] font-black uppercase tracking-widest">{m.role}</p>
              <p className="text-[#7a8b95] text-[10px] font-medium mt-0.5">{m.dept}</p>
              <div className="w-full h-px bg-[#f3f3f1] my-4" />
              <div className="w-full flex justify-between items-center text-[10px] font-black text-[#7a8b95] uppercase tracking-wider">
                <span>JOIN</span>
                <span className="text-[#212c46]">{m.joinDate}</span>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      <DraggableModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={<span className="text-sm font-black uppercase text-[#022d41] tracking-widest flex items-center gap-2"><Sparkles size={16} className="text-[#b58c4f]"/> Welcome to the Team</span>}
        width="max-w-md"
      >
        <div className="p-6">
          {selectedMember && (
             <div className="text-center mb-6">
               <img src={selectedMember.img} alt={selectedMember.name} className="w-24 h-24 rounded-full object-cover border-4 border-[#3f809e]/20 shadow-md mx-auto mb-4" />
               <h3 className="text-xl font-black text-[#212c46] mb-1">{selectedMember.name}</h3>
               <p className="text-[#4d87a8] text-xs font-black uppercase tracking-widest mb-1">{selectedMember.role}</p>
               <p className="text-[#7a8b95] text-xs font-medium">{selectedMember.dept}</p>
             </div>
          )}
          
          <div className="mb-6 shrink-0">
            <label className="block text-[10px] font-black text-[#212c46] uppercase tracking-widest mb-2 text-center">Say Hello & Welcome</label>
            <div className="relative">
              <textarea 
                className="w-full h-24 p-3 pr-12 border border-[#cdd0db] rounded-xl text-sm focus:border-[#4d87a8] focus:ring-1 focus:ring-[#4d87a8] outline-none transition-all resize-none bg-[#f3f3f1]/50 font-medium shadow-inner"
                placeholder="Type a welcome message..."
              ></textarea>
              <button className="absolute bottom-3 right-3 w-8 h-8 bg-[#4d87a8] hover:bg-[#3f809e] text-white rounded-lg flex items-center justify-center transition-colors shadow-md">
                <Send size={14} />
              </button>
            </div>
          </div>

          <div className="flex-1 flex flex-col min-h-0">
             <h4 className="text-[10px] font-black text-[#7a8b95] uppercase tracking-widest mb-3 border-b border-[#f3f3f1] pb-2">Recent Greetings (3)</h4>
             <div className="space-y-3">
                <div className="bg-white p-3 rounded-xl border border-[#f3f3f1] shadow-sm relative">
                  <div className="flex items-center gap-2 mb-2">
                     <span className="text-xs font-bold text-[#212c46]">วิชัย สุขใจ</span>
                     <span className="text-[9px] text-[#7a8b95] ml-auto">10 mins ago</span>
                  </div>
                  <p className="text-xs text-[#4a5568] leading-relaxed">Welcome to the team! Glad to have you here.</p>
                </div>
                <div className="bg-[#f0f7fa] p-3 rounded-xl border border-[#bce0f0] shadow-sm relative">
                  <div className="flex items-center gap-2 mb-2">
                     <span className="text-xs font-bold text-[#212c46]">DCC Team</span>
                     <span className="text-[9px] text-[#7a8b95] ml-auto">20 mins ago</span>
                  </div>
                  <p className="text-xs text-[#4a5568] leading-relaxed">We are excited to see your impact in the Innovation department!</p>
                </div>
             </div>
          </div>
        </div>
      </DraggableModal>
      </>
    );
};

const BirthdayWishes = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPerson, setSelectedPerson] = useState<any>(null);

    const birthdays = [
      { name: 'Quality Assurance Unit', dept: 'Operations', date: '98%', img: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=150&h=150&fit=crop' },
      { name: 'Risk Assessment Team', dept: 'Safety', date: '95%', img: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=150&h=150&fit=crop' },
    ];

    const openGreeting = (person?: any) => {
      setSelectedPerson(person || birthdays[0]);
      setIsModalOpen(true);
    };

    return (
      <>
      <GlassCard className="bg-white border-[#eaeaec] flex flex-col relative overflow-hidden">
        <div className="absolute right-[-10%] bottom-[-10%] opacity-[0.03] pointer-events-none transform -rotate-12 z-0">
          <Award size={200} />
        </div>
        <div className="flex items-center gap-2 mb-6 relative z-10">
          <Award size={20} className="text-[#d96245]" />
          <h2 className="text-sm font-black text-[#212c46] uppercase tracking-wide leading-tight">
            TOP 5 HIGH<br/>PERFORMANCE
          </h2>
        </div>
        <div className="space-y-3 flex-1 relative z-10">
          {birthdays.map((b, i) => (
            <div key={i} onClick={() => openGreeting(b)} className="flex items-center gap-4 bg-white border border-[#f3f3f1]/30 hover:border-[#d96245]/60 rounded-xl p-3 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group">
              <img src={b.img} alt={b.name} className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm shadow-black/10 group-hover:scale-105 transition-transform" />
              <div className="flex-1 min-w-0">
                <h3 className="text-[#212c46] font-bold text-xs truncate">{b.name}</h3>
                <p className="text-[#7a8b95] text-[10px] font-medium truncate">{b.dept}</p>
              </div>
              <div className="text-[10px] font-black text-[#d96245] tracking-widest shrink-0">
                {b.date}
              </div>
            </div>
          ))}
        </div>
        <button onClick={() => openGreeting()} className="mt-4 w-full bg-[#b7a159] hover:bg-[#a94228] text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors flex justify-center items-center gap-2 shadow-md relative z-10">
          <Send size={14} /> POST GREETING CARD
        </button>
      </GlassCard>

      <DraggableModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={<span className="text-sm font-black uppercase text-[#022d41] tracking-widest flex items-center gap-2"><Award size={16} className="text-[#d96245]"/> Top Performance</span>}
        width="max-w-md"
      >
        <div className="p-6 max-h-[80vh] overflow-y-auto custom-scrollbar flex flex-col">
          {selectedPerson && (
             <div className="flex items-center gap-4 mb-6 bg-[#f3f3f1] p-4 rounded-xl border border-[#f3f3f1] shrink-0">
               <img src={selectedPerson.img} alt={selectedPerson.name} className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm" />
               <div>
                  <p className="text-xs text-[#7a8b95] font-bold uppercase tracking-wider mb-0.5">Awarded To</p>
                  <h3 className="text-sm font-black text-[#212c46]">{selectedPerson.name}</h3>
                  <p className="text-[10px] font-medium text-[#7a8b95]">{selectedPerson.dept} • Score: {selectedPerson.date}</p>
               </div>
             </div>
          )}
          
          <div className="mb-6 shrink-0">
            <label className="block text-[10px] font-black text-[#212c46] uppercase tracking-widest mb-2">Write a Commendation</label>
            <div className="relative">
              <textarea 
                className="w-full h-24 p-3 pr-12 border border-[#cdd0db] rounded-xl text-sm focus:border-[#3f809e] focus:ring-1 focus:ring-[#3f809e] outline-none transition-all resize-none bg-white font-medium shadow-inner"
                placeholder="Type your message..."
              ></textarea>
              <button className="absolute bottom-3 right-3 w-8 h-8 bg-[#d96245] hover:bg-[#b7a159] text-white rounded-lg flex items-center justify-center transition-colors shadow-md">
                <Send size={14} />
              </button>
            </div>
          </div>

          <div className="flex-1 flex flex-col min-h-0">
             <h4 className="text-[10px] font-black text-[#7a8b95] uppercase tracking-widest mb-3 border-b border-[#f3f3f1] pb-2">Commendations (5)</h4>
             <div className="space-y-4">
                <div className="bg-white p-3 rounded-xl border border-[#f3f3f1] shadow-sm relative">
                  <div className="flex items-center gap-2 mb-2">
                     <div className="w-6 h-6 rounded-full bg-[#f3f3f1] border border-[#f3f3f1] overflow-hidden">
                        <img src="https://i.pravatar.cc/150?u=10" alt="User" />
                     </div>
                     <span className="text-xs font-bold text-[#212c46]">วิชัย สุขใจ</span>
                     <span className="text-[9px] text-[#7a8b95] ml-auto">10 mins ago</span>
                  </div>
                  <p className="text-xs text-[#4a5568] leading-relaxed">Excellent performance in passing the internal audit with 0 non-conformities! 🎉</p>
                </div>

                <div className="bg-white p-3 rounded-xl border border-[#f3f3f1] shadow-sm relative">
                  <div className="flex items-center gap-2 mb-2">
                     <div className="w-6 h-6 rounded-full bg-[#f3f3f1] border border-[#f3f3f1] overflow-hidden">
                        <img src="https://i.pravatar.cc/150?u=11" alt="User" />
                     </div>
                     <span className="text-xs font-bold text-[#212c46]">สมศรี ยินดี</span>
                     <span className="text-[9px] text-[#7a8b95] ml-auto">1 hr ago</span>
                  </div>
                  <p className="text-xs text-[#4a5568] leading-relaxed">Great job maintaining such high standards throughout the year.</p>
                </div>
                 <div className="bg-[#fff9e6] p-3 rounded-xl border border-[#fce9aa] shadow-sm relative">
                  <div className="flex items-center gap-2 mb-2">
                     <div className="w-6 h-6 rounded-full bg-[#f3f3f1] border border-[#eaeaec] overflow-hidden">
                        <img src="https://i.pravatar.cc/150?u=12" alt="User" />
                     </div>
                     <span className="text-xs font-bold text-[#212c46]">CEO</span>
                     <span className="text-[9px] text-[#7a8b95] ml-auto">2 hrs ago</span>
                  </div>
                  <p className="text-xs text-[#4a5568] leading-relaxed">Top notch performance and dedication to our ISO standards. Keep it up!</p>
                </div>
             </div>
          </div>
        </div>
      </DraggableModal>
      </>
    );
};

const CorporateNews = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedNews, setSelectedNews] = useState<any>(null);

    const news = [
      { category: 'COMPANY UPDATE', title: 'ประกาศผลประกอบการไตรมาส 1 / 2026', date: '08 May 2026', preview: 'ผลประกอบการไตรมาสแรกเติบโตขึ้น 15% ขอบคุณพนักงานทุกท่านที่ช่วยกันอย่างเต็มที่...', fullText: 'สวัสดีพนักงานทุกคน\n\nเรามีความยินดีที่จะประกาศว่าผลประกอบการไตรมาสแรกของปี 2026 เติบโตขึ้นถึง 15% เมื่อเทียบกับปีที่ผ่านมา ความสำเร็จนี้เกิดขึ้นได้ก็เพราะความทุ่มเทและการทำงานหนักของพนักงานทุกท่าน\n\nผู้บริหารขอขอบคุณทุกความพยายาม และเราพร้อมที่จะก้าวต่อไปเพื่อบรรลุเป้าหมายที่ใหญ่ขึ้นในไตรมาสถัดไป\n\nด้วยความเคารพ\nทีมบริหาร', author: 'CEO Office', image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800' },
      { category: 'DCC ANNOUNCEMENT', title: 'อัปเดตนโยบาย Work from Anywhere', date: '05 May 2026', preview: 'นโยบายการทำงานจากที่ใดก็ได้ได้ถูกปรับปรุงเพื่อเพิ่มความยืดหยุ่นให้พนักงาน...', fullText: 'อัปเดตนโยบายการทำงาน Work from Anywhere\n\nเพื่อเป็นการสนับสนุนสมดุลระหว่างการทำงานและการใช้ชีวิตของพนักงานทุกคน ทางฝ่ายบุคคลได้ปรับปรุงนโยบาย Work from Anywhere ใหม่ โดยพนักงานสามารถเลือกทำงานจากที่ใดก็ได้สูงสุด 3 วันต่อสัปดาห์ (เพิ่มจากเดิม 2 วัน)\n\nกรุณาปรึกษาหัวหน้างานของคุณก่อนการขออนุมัติ\n\nสอบถามเพิ่มเติมได้ที่ People Team', author: 'Quality Team', image: 'https://images.unsplash.com/photo-1593642532400-2682810df593?q=80&w=800' },
      { category: 'EVENT', title: 'เชิญร่วมงาน Townhall ประจำเดือน', date: '01 May 2026', preview: 'พบปะพูดคุยกับผู้บริหารและรับฟังทิศทางของบริษัท พร้อมกิจกรรมพิเศษ...', fullText: 'คำเชิญร่วมกิจกรรม Monthly Townhall\n\nขอเชิญพนักงานทุกคนร่วมกิจกรรม Townhall ประจำเดือนพฤษภาคม เพื่อพูดคุย นำเสนอผลงาน และแชร์วิสัยทัศน์ไปกับทีมผู้บริหาร\n\nวันและเวลา: 15 พฤษภาคม 2026, 14:00 - 16:00 น.\nสถานที่: Main Auditorium ชั้น 5\n\nมีกิจกรรมถาม-ตอบ และจับรางวัลพิเศษในช่วงท้าย งานนี้ห้ามพลาด!', author: 'Internal Comms', image: 'https://images.unsplash.com/photo-1515169067868-5387ec356754?q=80&w=800' },
    ];

    const openNews = (n: any) => {
      setSelectedNews(n);
      setIsModalOpen(true);
    };

    return (
      <>
      <GlassCard className="bg-white border-[#f3f3f1] col-span-1 lg:col-span-2 flex flex-col relative overflow-hidden">
        <div className="absolute left-[35%] top-[-30%] opacity-[0.02] pointer-events-none transform rotate-12 z-0">
          <Globe size={380} />
        </div>
        <div className="flex justify-between items-center mb-6 relative z-10">
          <h2 className="text-sm font-black text-[#212c46] flex items-center gap-2 uppercase tracking-wide">
            <Globe size={16} className="text-[#3f809e]" /> CORPORATE NEWS BOARD
          </h2>
          <div className="flex gap-2">
            <button className="text-[10px] font-black text-white bg-gradient-to-r from-[#d96245] to-[#b7a159] hover:from-[#c25035] hover:to-[#a38e4a] px-4 py-2 rounded-lg uppercase tracking-widest transition-all shadow-md flex items-center gap-1.5 outline-none hover:scale-105 active:scale-95 border border-[#d96245]/20">
              <Plus size={14} /> ADD NEWS
            </button>
            <button className="text-[10px] font-black text-[#212c46] bg-white px-4 py-2 rounded-lg uppercase tracking-widest border border-[#f3f3f1] hover:bg-[#f3f3f1] transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3f809e]">ALL</button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 relative z-10">
          {news.map((n, i) => (
            <div key={i} onClick={() => openNews(n)} className="flex flex-col bg-white border border-[#f3f3f1] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group hover:-translate-y-1">
              <div className="relative h-36 w-full overflow-hidden">
                <img src={n.image} alt={n.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                   <span className="text-[9px] font-black text-white uppercase tracking-widest bg-[#3f809e] px-2.5 py-1 rounded-md shadow-sm">{n.category}</span>
                   <span className="text-white/90 text-[10px] font-bold tracking-wider drop-shadow-md">{n.date}</span>
                </div>
              </div>
              <div className="p-4 flex flex-col flex-1">
                <h3 className="text-[#212c46] font-bold text-sm mb-2 line-clamp-2 leading-snug group-hover:text-[#3f809e] transition-colors">{n.title}</h3>
                <p className="text-[#7a8b95] text-[11px] font-medium line-clamp-2 leading-relaxed flex-1">{n.preview}</p>
                <div className="mt-4 pt-3 border-t border-[#f3f3f1] flex items-center justify-between">
                  <span className="text-[10px] font-black text-[#a0abb2] uppercase tracking-widest flex items-center gap-1.5"><User size={10}/> {n.author}</span>
                  <div className="flex items-center gap-1 text-[10px] font-black text-[#d96245] opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0 duration-300">
                    READ <ChevronRight size={12} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      <DraggableModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={<span className="text-sm font-black uppercase text-[#212c46] tracking-widest flex items-center gap-2"><Globe size={16} className="text-[#3f809e]"/> Corporate News</span>}
        width="max-w-2xl"
      >
        <div className="p-0 overflow-hidden flex flex-col max-h-[85vh]">
          {selectedNews && (
             <>
                <div className="relative h-48 w-full shrink-0">
                   <img src={selectedNews.image} alt={selectedNews.title} className="w-full h-full object-cover" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-[10px] font-black text-white uppercase tracking-widest bg-[#3f809e] px-3 py-1 rounded-md shadow-sm">{selectedNews.category}</span>
                        <span className="text-white/80 text-xs font-bold">{selectedNews.date}</span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-black text-white leading-tight drop-shadow-md">{selectedNews.title}</h2>
                   </div>
                </div>
                <div className="p-6 overflow-y-auto custom-scrollbar">
                  <div className="whitespace-pre-wrap text-[#4a5568] text-sm leading-relaxed mb-8">
                    {selectedNews.fullText}
                  </div>
                  <div className="bg-[#f3f3f1] rounded-xl p-4 border border-[#f3f3f1] flex items-center gap-3">
                     <div className="w-10 h-10 bg-[#f3f3f1] rounded-full flex items-center justify-center border border-[#f3f3f1] shrink-0">
                        <User size={18} className="text-[#7a8b95]" />
                     </div>
                     <div>
                       <p className="text-[10px] font-black text-[#7a8b95] uppercase tracking-widest">Published By</p>
                       <p className="text-sm font-bold text-[#212c46]">{selectedNews.author}</p>
                     </div>
                  </div>
                </div>
             </>
          )}
        </div>
      </DraggableModal>
      </>
    );
};

const CorporateAlert = () => {
    const alerts = [
      { title: 'การประเมินผลงานรอบครึ่งปี', desc: 'Mid-year review starts Monday. Ensure all self-evaluations are done.', icon: Calendar, color: '#932c2e', bg: '#932c2e26' },
      { title: 'สวัสดิการประกันกลุ่มใหม่', desc: 'Update on group insurance plan for FY2025 available now.', icon: Info, color: '#3f809e', bg: '#3f809e26' },
    ];

    return (
      <GlassCard className="bg-white border-[#f3f3f1] flex flex-col relative overflow-hidden">
        <div className="absolute right-[-5%] bottom-[-5%] opacity-[0.02] pointer-events-none transform -rotate-12 z-0">
          <Megaphone size={220} />
        </div>
        <div className="flex items-center gap-2 mb-6 relative z-10">
          <Megaphone size={20} className="text-[#932c2e]" />
          <h2 className="text-sm font-black text-[#212c46] uppercase tracking-wide leading-tight">
            CORPORATE<br/>ALERT
          </h2>
        </div>
        <div className="space-y-4 flex-1 relative z-10">
          {alerts.map((alert, i) => (
            <div key={i} className="flex items-start gap-3 border border-transparent rounded-xl p-4 transition-all cursor-pointer group hover:-translate-y-0.5 hover:shadow-md" style={{ backgroundColor: alert.bg }}>
              <alert.icon size={16} className={`shrink-0 mt-0.5`} style={{ color: alert.color }} />
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-[13px] mb-1 leading-tight" style={{ color: alert.color }}>{alert.title}</h3>
                <p className="text-[10px] font-medium leading-relaxed font-sans" style={{ color: alert.color, opacity: 0.85 }}>{alert.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    );
};

export default function Home() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const { visibility } = useVisibility();

  // Filter SYSTEM_MODULES based on visibility state
  const visibleModules = useMemo(() => {
    return SYSTEM_MODULES.map(module => {
      // Admin injected tabs
      let finalModule: any = module;
      if (module.id === 'settings' && user?.isDev) {
        finalModule = {
          ...module,
          subItems: [
            ...(module.subItems || []),
            { id: 'dev_permit', label: 'DEV PERMIT BETA' },
            { id: 'dev_logs', label: 'System Logs' }
          ]
        };
      }
      
      // Filter out root items if visibility says false
      if (visibility[finalModule.id] === false) return null;
      
      // Filter out sub items
      if (finalModule.subItems) {
        const filteredSubs = finalModule.subItems.filter((sub: any) => visibility[sub.id] !== false);
        return { ...finalModule, subItems: filteredSubs };
      }
      return finalModule;
    }).filter(Boolean);
  }, [visibility, user]);
  const currentUser = {
      name: user?.name || 'T-DCC Developer',
      position: user?.role || 'LEAD DEVELOPER',
      avatar: user?.avatar || 'https://drive.google.com/thumbnail?id=1Z_fRbN9S4aA7OkHb3mlim_t60wIT4huY&sz=w400'
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleMenu = (menuKey: string) => {
    setExpandedMenus(prev => ({...prev, [menuKey]: !prev[menuKey]}));
    if(!sidebarOpen) setSidebarOpen(true);
  };

  return (
    <div className="flex h-screen w-full font-sans overflow-hidden flex-col md:flex-row" style={{ background: THEME.bgGradient }}>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700;800&family=Noto+Sans+Thai:wght@400;700;900&display=swap');
        body, .font-sans { font-family: 'JetBrains Mono', 'Noto Sans Thai', sans-serif; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #5372ba22; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #5372ba; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}} />

      {/* SVG Gradient Definition for Gemini Theme Icon - Optimized for Relation/Partnership */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="geminiRelationGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4285F4" />
            <stop offset="45%" stopColor="#9B72CB" />
            <stop offset="100%" stopColor="#D96570" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* SIDEBAR */}
      <aside className={`flex-shrink-0 flex flex-col transition-all duration-700 z-30 shadow-2xl relative ${sidebarOpen ? 'w-72' : 'w-24'}`} style={{ background: THEME.sidebarBg }}>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="absolute -right-3 top-10 w-7 h-7 bg-[#212c46] text-[#b58c4f] rounded-full flex items-center justify-center shadow-lg z-50 border border-[#b58c4f]/20 transition-all hover:bg-[#b58c4f] hover:text-[#212c46] hover:shadow-[0_0_15px_rgba(181,140,79,0.5)]">
            {sidebarOpen ? <ChevronRight size={12} className="rotate-180" /> : <ChevronRight size={12} />}
        </button>

        <div className="h-24 flex items-center justify-center px-4 shrink-0">
            <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#b58c4f] via-[#d4af37] to-[#f3e5ab] p-[1.5px] shadow-[0_0_15px_rgba(181,140,79,0.3)] shrink-0">
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-[#0F172A] text-[#b58c4f]">
                    <Library size={24} strokeWidth={2.5} />
                  </div>
                </div>
                {sidebarOpen && (
                    <div className="overflow-hidden">
                        <div className="flex items-center gap-[2px] text-[28px] font-black tracking-tighter font-sans transform scale-x-105 origin-left leading-none" style={{ fontFamily: "'Inter', sans-serif", textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                          <span className="text-white">DCC</span>
                          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b58c4f] to-[#f3e5ab]">PRO</span>
                        </div>
                        <div className="flex items-center mt-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                          <div className="w-3 h-[2px] bg-gradient-to-r from-[#b58c4f] to-transparent mr-2" />
                          <span className="text-[8px] font-bold text-[#7a8b95] tracking-[0.3em] uppercase leading-none">
                            ISO MANAGEMENT HUB
                          </span>
                        </div>
                    </div>
                )}
            </div>
        </div>

        <nav className="flex-1 px-3 space-y-1 overflow-y-auto custom-scrollbar py-4">
          {visibleModules.map((module: any) => (
            <NavItem key={module.id} item={module} activeTab={activeTab} setActiveTab={setActiveTab} isSidebarOpen={sidebarOpen} expandedMenus={expandedMenus} toggleMenu={toggleMenu} />
          ))}
        </nav>

        {/* SIDEBAR FOOTER - DEV PROFILE */}
        <div className="p-4 shrink-0 pb-6">
            <div className={`flex items-center gap-3 ${!sidebarOpen && 'justify-center'}`}>
                <div className="w-10 h-10 rounded-full border border-[#b58c4f]/40 overflow-hidden shadow-md bg-white/5 shrink-0">
                    <img src={currentUser.avatar} className="w-full h-full object-cover" alt="Avatar" />
                </div>
                {sidebarOpen && (
                    <div className="flex-1 min-w-0">
                        <p className="text-white text-[11px] font-black tracking-tight leading-none truncate">{currentUser.name}</p>
                        <p className="text-[#b58c4f] text-[9px] font-bold uppercase tracking-widest mt-1.5">{currentUser.position}</p>
                    </div>
                )}
                {sidebarOpen && <LogOut onClick={logout} size={16} className="text-[#a94228] opacity-70 hover:opacity-100 cursor-pointer transition-all ml-auto" />}
            </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 relative overflow-hidden flex flex-col bg-transparent">
        {/* GLOBAL SCROLLABLE AREA - ENCOMPASSES HEADER, CONTENT, AND FOOTER */}
        <div className="flex-1 custom-scrollbar overflow-y-auto flex flex-col min-h-0">
            <header className="pt-5 pb-3 px-8 flex items-center justify-between z-10 shrink-0 bg-transparent">
                <div className="flex items-center gap-6">
                    <div className="flex items-center justify-center shrink-0">
                        <svg width="0" height="0" className="absolute">
                          <linearGradient id="themeGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                            <stop stopColor="#b58c4f" offset="0%" />
                            <stop stopColor="#3f809e" offset="50%" />
                            <stop stopColor="#4d87a8" offset="100%" />
                          </linearGradient>
                        </svg>
                        <Target size={42} stroke="url(#themeGrad)" strokeWidth={2.6} className="drop-shadow-sm" />
                    </div>
                    <div className="flex flex-col justify-center">
                        <div className="flex items-center gap-2">
                            <span className="font-black text-[#212c46] text-3xl tracking-wide uppercase leading-none">DOCUMENT CONTROL</span>
                            <span className="font-bold text-[#4d87a8] text-3xl tracking-wide uppercase leading-none">CENTER</span>
                            <span className="bg-[#932c2e] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded ml-2 tracking-wider">ISO STANDARD</span>
                        </div>
                        <div className="flex items-center gap-3 mt-0.5">
                            <div className="w-10 h-[2px] bg-[#932c2e]"></div>
                            <span className="text-[10px] font-bold text-[#7a8b95] uppercase tracking-[0.2em] leading-none">INTEGRATED DOCUMENT AND COMPLIANCE MANAGEMENT</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="hidden lg:flex items-center bg-white rounded-full shadow-sm p-1 pr-1.5 pl-6 gap-5 border border-[#cdd0db]/50 h-11">
                        <div className="flex flex-col justify-center items-center">
                            <span className="text-[9px] font-black text-[#5f7ab7] uppercase tracking-[0.1em] leading-none mb-0.5">{currentTime.toLocaleDateString('en-US', { weekday: 'long' })}</span>
                            <span className="text-[11px] font-black text-transparent bg-clip-text bg-gradient-to-r from-[#022d41] to-[#214573] leading-none">{currentTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                        <div className="bg-[#212c46] text-white px-4 py-1.5 rounded-full flex items-center gap-2 shadow-inner h-full">
                            <Clock size={14} className="text-[#b58c4f]" strokeWidth={2.5} />
                            <span className="text-[12px] font-black font-mono tracking-widest mt-0.5">
                                {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                            </span>
                        </div>
                    </div>
                    <button className="relative w-11 h-11 rounded-full bg-white shadow-sm flex items-center justify-center text-[#3f809e] hover:bg-[#f8f9fa] transition-all group border border-[#cdd0db]/50 hover:scale-105">
                        <Bell size={18} className="group-hover:rotate-12 transition-transform" strokeWidth={2} />
                        <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#932c2e] rounded-full shadow-[0_0_0_2px_#ffffff]"></span>
                    </button>
                </div>
            </header>

            {/* DYNAMIC CONTENT AREA */}
            <div className={`flex-1 flex flex-col justify-start w-full`}>
            {activeTab === 'copilot' ? (
                <div className="w-full flex-1 flex flex-col overflow-hidden">
                  <AiCopilot />
                </div>
            ) : activeTab === 'dashboard' ? (
                <div className="max-w-[1500px] w-full mx-auto px-8 space-y-6 animate-fadeIn pb-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mt-4">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-black text-[#212c46] tracking-tight uppercase">
                                Morning, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b58c4f] to-[#8e9141]">{currentUser.name}!</span>
                            </h1>
                            <p className="text-[#748ea1] text-[10px] font-black uppercase tracking-widest mt-2 flex items-center gap-1.5">
                                <TrendingUp size={14} className="text-[#d96245]" /> Compliance Rate: <span className="text-[#3f809e]">High (98.2%)</span>
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button className="bg-white text-[#212c46] px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md border border-[#cdd0db]/50 transition-all flex items-center gap-2 hover:-translate-y-0.5">
                                <Megaphone size={16} className="text-[#3f809e]" /> Openings
                            </button>
                            <button className="bg-gradient-to-r from-[#3f809e] via-[#4d87a8] to-[#748ea1] text-white px-7 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:scale-105 transition-all flex items-center gap-2">
                                <Target size={16} /> New Recruit
                            </button>
                        </div>
                    </div>

                    <HeroBanner />

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {MOCK_STATS.map((stat, idx) => (
                            <MetricCard key={idx} {...stat} val={stat.value} desc={stat.sub} />
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                        <NewFamilyMembers />
                        <BirthdayWishes />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-5">
                        <CorporateNews />
                        <CorporateAlert />
                    </div>
                </div>
            ) : activeTab === 'calendar' ? (
                <div className="w-full flex-1 flex flex-col">
                <CalendarHub />
                </div>
            ) : activeTab === 'user_permission' ? (
                <div className="w-full flex-1 flex flex-col">
                <UserPermission />
                </div>
            ) : activeTab === 'system_config' ? (
                <div className="w-full flex-1 flex flex-col">
                <SystemConfig />
                </div>
            ) : activeTab === 'sales_orders' ? (
                <div className="w-full flex-1 flex flex-col">
                <SaleOrder />
                </div>
            ) : activeTab === 'products_catalogue' ? (
                <div className="w-full flex-1 flex flex-col">
                <ProductsCatalogue />
                </div>
            ) : activeTab === 'dev_permit' ? (
                <div className="w-full flex-1 flex flex-col">
                <DevPermit />
                </div>
            ) : activeTab === 'dev_logs' ? (
                <div className="w-full flex-1 flex flex-col">
                <SystemLogs />
                </div>
            ) : activeTab === 'car_log' ? (
                <div className="w-full flex-1 flex flex-col overflow-hidden">
                  <CarLog />
                </div>
            ) : activeTab === 'car_pending' ? (
                <div className="w-full flex-1 flex flex-col overflow-hidden">
                  <Pending />
                </div>
            ) : activeTab === 'ml_ext_docs' ? (
                <div className="w-full flex-1 flex flex-col overflow-hidden">
                  <ExternalDocuments />
                </div>
            ) : activeTab === 'qualified_auditors' ? (
                <div className="w-full flex-1 flex flex-col overflow-hidden">
                  <QualifiedAuditors />
                </div>
            ) : activeTab === 'dist_pending' ? (
                <div className="w-full flex-1 flex flex-col overflow-hidden">
                  <DistributionPending />
                </div>
            ) : activeTab === 'dist_log' ? (
                <div className="w-full flex-1 flex flex-col overflow-hidden">
                  <DistributionLog />
                </div>
            ) : activeTab === 'ml_doc_list' ? (
                <div className="w-full flex-1 flex flex-col overflow-hidden">
                  <DocumentList />
                </div>
            ) : activeTab === 'dar_pending' ? (
                <div className="w-full flex-1 flex flex-col overflow-hidden">
                  <DarPending />
                </div>
            ) : activeTab === 'dar_form' ? (
                <div className="w-full flex-1 flex flex-col overflow-hidden">
                  <DarForm />
                </div>
            ) : activeTab === 'destruct_pending' ? (
                <div className="w-full flex-1 flex flex-col overflow-hidden">
                  <DestructPending />
                </div>
            ) : activeTab === 'destruct_log' ? (
                <div className="w-full flex-1 flex flex-col overflow-hidden">
                  <DestructLog />
                </div>
            ) : activeTab === 'ml_record_list' ? (
                <div className="w-full flex-1 flex flex-col overflow-hidden">
                  <RecordList />
                </div>
            ) : activeTab === 'ml_doc_history' ? (
                <div className="w-full flex-1 flex flex-col overflow-hidden">
                  <DocHistory />
                </div>
            ) : activeTab === 'team_audit_report' ? (
                <div className="w-full flex-1 flex flex-col overflow-hidden">
                  <TeamAuditReport />
                </div>
            ) : activeTab === 'audit_plan_yearly' ? (
                <div className="w-full flex-1 flex flex-col overflow-hidden">
                  <AuditPlan />
                </div>
            ) : activeTab === 'summary_ia_report' ? (
                <div className="w-full flex-1 flex flex-col overflow-hidden">
                  <SummaryIaReport />
                </div>
            ) : activeTab === 'team_report_log' ? (
                <div className="w-full flex-1 flex flex-col overflow-hidden">
                  <TeamReportLog />
                </div>
            ) : activeTab === 'ca_entry' ? (
                <div className="w-full flex-1 flex flex-col overflow-hidden">
                  <CaRequestEntry />
                </div>
            ) : activeTab === '2nd_party_report' ? (
                <div className="w-full flex-1 flex flex-col overflow-hidden">
                  <SecondPartyReportLog />
                </div>
            ) : activeTab === 'summary_report_log' ? (
                <div className="w-full flex-1 flex flex-col overflow-hidden">
                  <SummaryReportLog />
                </div>
            ) : activeTab === '3rd_party_report' ? (
                <div className="w-full flex-1 flex flex-col overflow-hidden">
                  <ThirdPartyReportLog />
                </div>
            ) : activeTab === 'auditor_log' ? (
                <div className="w-full flex-1 flex flex-col overflow-hidden">
                  <AuditorLog />
                </div>
            ) : activeTab === 'audit_schedule' ? (
                <div className="w-full flex-1 flex flex-col overflow-hidden">
                  <AuditSchedule />
                </div>
            ) : (
                <div className="max-w-2xl w-full mx-auto px-8 py-12 text-center animate-fadeIn flex-1">
                    <div className="w-16 h-16 rounded-full bg-[#212c46] flex items-center justify-center mx-auto mb-6 shadow-xl border-2 border-[#b58c4f]">
                        <Database size={28} className="text-[#b58c4f]" />
                    </div>
                    <h2 className="text-xl font-black text-[#212c46] uppercase tracking-tight mb-3">{activeTab.replace(/_/g, ' ')} Module</h2>
                    <GlassCard className="max-w-sm mx-auto py-8">
                        <p className="text-[10px] text-[#7a8b95] font-black leading-relaxed mb-6 uppercase tracking-widest">
                            Workspace "{activeTab}" is loading real-time DCC data.
                        </p>
                        <button onClick={() => setActiveTab('dashboard')} className="px-6 py-2.5 bg-[#212c46] text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-[#3f809e] transition-colors shadow-lg">
                            Back to Dashboard
                        </button>
                    </GlassCard>
                </div>
            )}
            </div>

            {/* FINAL BALANCED FOOTER SHARED ACROSS ALL PAGES */}
            <footer className="mt-auto shrink-0 py-3.5 flex flex-col items-center gap-1.5 text-center px-8 text-[#212c46] w-full bg-transparent">
                <div className="flex items-center justify-center">
                    <span className="text-[12px] font-black uppercase tracking-widest opacity-80">
                        GLOBAL DCC HUB • EMPOWERING STRATEGIC CONTROL MANAGEMENT
                    </span>
                </div>
                <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1 text-[11px] font-medium text-[#7a8b95]">
                    <p className="flex items-center"><span className="font-light mr-1">System by</span> <span className="font-black text-[#212c46]">T All Intelligence</span></p>
                    <span className="hidden md:inline text-[#d7d7d7]">|</span>
                    <p className="flex items-center gap-1.5"><PhoneCall size={14} className="text-[#a54f6b]" /> 082-5695654, 091-5165999</p>
                    <span className="hidden md:inline text-[#d7d7d7]">|</span>
                    <p className="flex items-center gap-1.5"><Mail size={14} className="text-[#3f809e]" /> tallintelligence.ho@gmail.com</p>
                </div>
            </footer>
        </div>
      </main>
    </div>
  );
}
