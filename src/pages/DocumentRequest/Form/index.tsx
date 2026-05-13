import React, { useState, useEffect, useMemo } from 'react';
import { 
  FilePlus, FileEdit, Trash2, Copy, Database, ChevronRight, Save,
  CheckCircle2, RefreshCw, FileText, AlertCircle, HelpCircle, X,
  ShieldCheck, Zap, Network, Globe, Settings, Plus, Pencil, FileX2, 
  ArrowRight, Info, BookOpen, History, FileSearch, Upload, MinusCircle,
  Table as TableIcon, Trash, Paperclip, Printer, QrCode, ChevronDown, Target
} from 'lucide-react';

const THEME = {
  bgMain: 'transparent',
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
  silver: '#d7d7d7'
};

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700;800&family=Noto+Sans+Thai:wght@300;400;500;600;700;800&display=swap');
  * { font-family: 'JetBrains Mono', 'Noto Sans Thai', sans-serif !important; box-sizing: border-box; }
  html, body { background-color: transparent; font-size: 12px !important; margin: 0; padding: 0; min-height: 100vh; }
  .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 6px; }
  .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
  .custom-scrollbar::-webkit-scrollbar-thumb { background: ${THEME.silver}; border-radius: 10px; }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: ${THEME.dustyBlue}; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  .animate-fade { animation: fadeIn 0.3s ease-out forwards; }
  .glass-border { border: 1px solid rgba(255, 255, 255, 0.4); }
  @media print { body { background-color: white; } .no-print { display: none !important; } #print-area { box-shadow: none !important; border: none !important; margin: 0 !important; padding: 0 !important; } }
`;

const MOCK_MASTER_LIST = [
  { id: 'QM-01', title: 'Quality Management Manual', rev: '05', date: '01-JAN-2025', dept: 'Management' },
  { id: 'QP-QA-01', title: 'Incoming Inspection', rev: '06', date: '10-JAN-2026', dept: 'QA/QC' },
];

const MOCK_RECORDS_LIST = [
  { id: 'REC-PD-001', title: 'Daily Production Report', retention: '5 Years', method: 'Shred', dept: 'Production' },
];

const hexToRgba = (hex, opacity) => {
  let r = 0, g = 0, b = 0;
  if (hex.length === 7) {
    r = parseInt(hex.slice(1, 3), 16);
    g = parseInt(hex.slice(3, 5), 16);
    b = parseInt(hex.slice(5, 7), 16);
  }
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

const GuideTrigger = ({ onClick }: any) => (
  <button onClick={onClick} className={`fixed right-0 top-32 bg-[${THEME.primary}] text-white py-4 px-2 rounded-l-xl shadow-[-4px_0_15px_rgba(0,0,0,0.15)] hover:bg-[${THEME.danger}] transition-all z-[40] flex flex-col items-center gap-3 group border border-r-0 border-white/20 no-print cursor-pointer`}>
    <HelpCircle size={18} className="shrink-0 group-hover:scale-110 transition-transform" />
    <span className="font-extrabold tracking-[0.2em] [writing-mode:vertical-rl] rotate-180 whitespace-nowrap uppercase font-mono text-xs">USER GUIDE</span>
  </button>
);

const UserGuideDrawer = ({ isOpen, onClose }: any) => (
  <>
    <div className={`fixed inset-0 bg-[${THEME.darkSlate}]/30 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'} no-print`} onClick={onClose}></div>
    <div className={`fixed top-0 right-0 h-full w-[450px] bg-white shadow-[-20px_0_50px_rgba(0,0,0,0.15)] z-[70] transform transition-transform duration-300 ease-in-out flex flex-col no-print ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className={`flex justify-between items-center p-6 border-b border-[${THEME.silver}] bg-[${THEME.primary}] text-white shrink-0 shadow-md`}>
        <h3 className="font-extrabold flex items-center gap-2 uppercase tracking-widest font-mono text-[13px]"><HelpCircle size={18} className={`text-[${THEME.brightGold}]`}/> USER GUIDE</h3>
        <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"><X size={20}/></button>
      </div>
      <div className={`p-8 overflow-y-auto flex-1 custom-scrollbar text-[${THEME.dustyBlue}] leading-relaxed space-y-7 text-[12px] bg-[${THEME.bgMain}]`}>
          <section>
            <h4 className={`text-[11px] font-black text-[${THEME.primary}] mb-3 uppercase flex items-center gap-2 border-b border-[${THEME.silver}] pb-2 font-mono`}><Zap size={16} className={`text-[${THEME.danger}]`}/> 1. Single Point Entry</h4>
            <p>หน้าจอนี้เป็นช่องทางหลักในระบบ Data Request...</p>
          </section>
      </div>
      <div className="p-6 bg-white border-t border-[${THEME.silver}] flex justify-end shrink-0 z-10">
         <button onClick={onClose} className={`px-8 py-3 bg-[${THEME.primary}] text-white font-black rounded-xl uppercase font-mono text-[11px] hover:bg-[${THEME.danger}] shadow-md transition-all cursor-pointer`}>เข้าใจแล้ว (Got it)</button>
      </div>
    </div>
  </>
);

export default function DocumentRequestForm() {
  const [entryType, setEntryType] = useState('new_doc'); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const [departments] = useState(['Management', 'Production', 'QA/QC', 'Purchasing', 'Sales', 'HR', 'Engineering', 'Warehouse']);
  const [docTypes] = useState(['Manual', 'Procedure', 'Work Instruction', 'Form', 'Supporting Document']);
  const [destroyMethods] = useState(['Shred (ย่อยทำลาย)', 'Incinerate (เผา)', 'Delete (ลบไฟล์)', 'Recycle']);
  const [externalCategories] = useState(['Standard', 'Machine Manual', 'Drawing/Artwork', 'Customer Spec', 'Other']);
  
  const [headerData, setHeaderData] = useState({ requestDate: new Date().toISOString().split('T')[0], requester: 'User', department: 'QA/QC' });
  const [globalRemarks, setGlobalRemarks] = useState('');
  
  const [darNoConfig, setDarNoConfig] = useState({ prefix: 'DAR', yearFormat: 'YY', separator: '/', digits: '3', currentSeq: 42 });
  const [showDarConfig, setShowDarConfig] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const [requestItems, setRequestItems] = useState([{}]);

  const generatedDarNo = useMemo(() => {
    const yearStr = new Date(headerData.requestDate).getFullYear().toString();
    const yearToUse = darNoConfig.yearFormat === 'YY' ? yearStr.slice(-2) : yearStr;
    const seqLength = parseInt(darNoConfig.digits);
    const seqStr = String(darNoConfig.currentSeq).padStart(seqLength, '0');
    return `${darNoConfig.prefix} ${yearToUse}${darNoConfig.separator}${seqStr}`;
  }, [darNoConfig, headerData.requestDate]);

  const formattedPdfDate = useMemo(() => {
    if (!headerData.requestDate) return '';
    return new Date(headerData.requestDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }, [headerData.requestDate]);
  
  const getLookupInfo = (docId: string) => MOCK_MASTER_LIST.find(d => d.id === docId) || MOCK_RECORDS_LIST.find(d => d.id === docId) || {};

  const txTypes = [
    { id: 'new_doc', icon: FilePlus, title: 'ขอขึ้นทะเบียนใหม่ (New)', desc: 'เอกสาร ISO ฉบับใหม่', hexColor: '#537179', bgActive: 'bg-[#537179]' },
    { id: 'revise_doc', icon: FileEdit, title: 'ขอแก้ไขเอกสาร (Revise)', desc: 'ปรับปรุงเนื้อหาเดิม', hexColor: THEME.primary, bgActive: `bg-[${THEME.primary}]` },
    { id: 'obsolete_doc', icon: Trash2, title: 'ขอยกเลิกเอกสาร (Obsolete)', desc: 'เลิกใช้งานถาวร', hexColor: THEME.danger, bgActive: `bg-[${THEME.danger}]` },
    { id: 'copy_req', icon: Copy, title: 'ขอสำเนา (Copy)', desc: 'ขอ Controlled/Uncontrolled Copy', hexColor: THEME.brightGold, bgActive: `bg-[${THEME.brightGold}]` },
    { id: 'master_record', icon: Database, title: 'ขึ้นทะเบียนบันทึก (Record)', desc: 'กำหนดอายุและสถานที่เก็บ', hexColor: THEME.dustyBlue, bgActive: `bg-[${THEME.dustyBlue}]` },
    { id: 'destroy_record', icon: FileX2, title: 'ขอทำลายบันทึก (Destroy)', desc: 'บันทึกที่ครบอายุจัดเก็บ', hexColor: THEME.pinkAccent, bgActive: `bg-[${THEME.pinkAccent}]` },
    { id: 'external_doc', icon: Globe, title: 'เอกสารภายนอก (External)', desc: 'คู่มือ, Drawing, Spec', hexColor: THEME.mutedSlate, bgActive: `bg-[${THEME.mutedSlate}]` },
  ];

  const activeTx = txTypes.find(t => t.id === entryType) || txTypes[0];

  useEffect(() => {
    if(requestItems.length > 0 && (requestItems[0] as any).docId) return; 
    setRequestItems([getInitialItem(entryType)]);
    setShowSuccess(false);
  }, [entryType]);

  const getInitialItem = (type: string) => {
    switch (type) {
      case 'new_doc': return { title: 'Incoming Inspection', docNo: 'QP-QA-01', docType: 'Procedure', fileName: 'Flowchart_QC.pdf', reason: 'New Product' };
      case 'revise_doc': 
      case 'obsolete_doc': return { docId: '', reason: '', additionalDetails: '' };
      case 'copy_req': return { docId: '', copyType: 'Controlled', copyQty: 1 };
      case 'master_record': return { title: '', docNo: '', retention: '5 Years', location: 'Server', medium: 'Electronic' };
      case 'destroy_record': return { docId: '', period: '', destroyMethod: 'Shred (ย่อยทำลาย)' };
      case 'external_doc': return { title: '', docNo: '', category: 'Standard', org: '', fileName: '' };
      default: return {};
    }
  };

  const handleHeaderChange = (e: any) => {
    const { name, value } = e.target;
    setHeaderData(prev => ({ ...prev, [name]: value }));
    if (name === 'department') setRequestItems([getInitialItem(entryType)]);
  };

  const updateItemField = (index: number, field: string, value: any) => {
    const newItems: any = [...requestItems];
    newItems[index][field] = value;
    setRequestItems(newItems);
  };

  const addNewItem = () => setRequestItems([...requestItems, getInitialItem(entryType)]);
  const removeItem = (index: number) => {
    if (requestItems.length > 1) { setRequestItems(requestItems.filter((_, i) => i !== index)); } else { setRequestItems([getInitialItem(entryType)]); }
  };

  const handleSubmit = (e: any) => { e.preventDefault(); setIsPreviewOpen(true); };

  const handleConfirmSubmit = () => {
    setIsPreviewOpen(false); setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false); setShowSuccess(true);
      setDarNoConfig(prev => ({ ...prev, currentSeq: prev.currentSeq + 1 }));
      setTimeout(() => { setShowSuccess(false); setRequestItems([getInitialItem(entryType)]); setGlobalRemarks(''); }, 3000);
    }, 1500);
  };

  const fillDemo = (action: string, docId: string, dept: string) => {
    setHeaderData(prev => ({ ...prev, department: dept }));
    let newType = 'new_doc'; let newItem = {};
    if(action === 'revise') { newType = 'revise_doc'; newItem = { docId, reason: '' }; }
    if(action === 'copy') { newType = 'copy_req'; newItem = { docId, copyType: 'Controlled', copyQty: 1 }; }
    if(action === 'obsolete') { newType = 'obsolete_doc'; newItem = { docId, reason: '' }; }
    if(action === 'destroy') { newType = 'destroy_record'; newItem = { docId, period: '', destroyMethod: 'Shred (ย่อยทำลาย)' }; }
    setEntryType(newType); setRequestItems([newItem]);
    setToastMsg(`Auto-filled: ${action.toUpperCase()} for Document ${docId}`);
    setTimeout(() => setToastMsg(''), 4000);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const incomingAction = params.get('action'); const incomingDocId = params.get('docId'); const incomingDept = params.get('dept');
    if (incomingAction && incomingDocId && incomingDept) fillDemo(incomingAction, incomingDocId, incomingDept);
  }, []);

  const availableDocs = useMemo(() => MOCK_MASTER_LIST.filter(d => d.dept === headerData.department), [headerData.department]);
  const availableRecords = useMemo(() => MOCK_RECORDS_LIST.filter(d => d.dept === headerData.department), [headerData.department]);

  return (
    <>
      <style>{globalStyles}</style>
      <div className="flex-1 h-full w-full p-0 bg-transparent flex flex-col relative font-sans min-w-0">
        <GuideTrigger onClick={() => setIsGuideOpen(true)} />
        <UserGuideDrawer isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />

        {toastMsg && (
          <div className={`fixed bottom-10 right-10 z-[200] bg-[${THEME.primary}] text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-fade border border-white/10`}>
             <Zap size={20} className={`text-[${THEME.success}]`} />
             <span className="font-bold font-mono text-[11px] uppercase tracking-widest">{toastMsg}</span>
          </div>
        )}

        <div className="w-full mx-auto px-8 py-10 flex flex-col h-full animate-fade max-w-[1600px] min-w-0">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-10 shrink-0">
            <div className="flex items-center gap-6 shrink-0">
              <div className={`relative w-14 h-14 bg-white/10 flex items-center justify-center shadow-lg rounded-xl border border-[${THEME.silver}]`}>
                <Network size={28} strokeWidth={2.5} className={`text-[${THEME.skyBlue}]`} />
              </div>
              <div className="flex flex-col justify-center font-mono leading-none">
                <h1 className="text-[26px] font-black tracking-tight uppercase flex gap-2.5">
                  <span className={`text-[${THEME.primary}]`}>DOCUMENT</span>
                  <span className={`text-transparent bg-clip-text bg-gradient-to-r from-[${THEME.skyBlue}] to-[${THEME.gold}]`}>REQUEST FORM</span>
                </h1>
                <p className={`text-[13px] font-medium uppercase tracking-[0.3em] mt-2 text-[${THEME.dustyBlue}]`}>ISO SYSTEM SINGLE POINT ENTRY</p>
              </div>
            </div>

            <div className="relative group z-[80]">
              <button type="button" className={`px-5 py-3 bg-[${THEME.brightGold}]/10 text-[${THEME.brightGold}] rounded-xl font-black uppercase tracking-widest text-[11px] flex items-center gap-2 border border-[${THEME.brightGold}]/30 hover:bg-[${THEME.brightGold}]/20 transition-colors shadow-sm font-mono cursor-pointer`}>
                 <Zap size={16} className={`text-[${THEME.brightGold}]`}/> AUTO-FILL DEMO <ChevronDown size={14}/>
              </button>
              <div className={`absolute right-0 top-full mt-2 w-72 bg-white shadow-2xl rounded-2xl border border-[${THEME.silver}] p-2 hidden group-hover:block transition-all origin-top-right`}>
                 <div className={`text-[9px] font-bold text-[${THEME.dustyBlue}] mb-2 px-3 pt-2 uppercase font-mono`}>Simulate Redirect From:</div>
                 <button type="button" onClick={() => fillDemo('revise', 'QM-01', 'Management')} className={`w-full text-left px-4 py-3 hover:bg-[${THEME.bgMain}] rounded-xl text-[12px] font-bold text-[${THEME.primary}] flex items-center gap-3 transition-colors cursor-pointer`}><FileEdit size={16}/> Revise QM-01</button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0">
            <div className="lg:col-span-3 xl:col-span-3 space-y-4 flex flex-col h-full z-10">
              <h2 className={`text-[11px] font-black text-[${THEME.dustyBlue}] uppercase tracking-widest px-1 font-mono`}>1. Select Request Type</h2>
              <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1 pb-4">
                {txTypes.map((tx) => (
                  <button 
                    key={tx.id} 
                    onClick={() => setEntryType(tx.id)} 
                    className={`w-full text-left p-6 rounded-2xl border transition-all duration-300 flex items-center gap-5 cursor-pointer ${entryType === tx.id ? `${tx.bgActive} border-transparent shadow-xl text-white scale-[1.03]` : `bg-white shadow-sm border-[${THEME.silver}] hover:bg-white/80 hover:-translate-y-0.5`}`}
                  >
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-inner ${entryType === tx.id ? 'bg-white/20' : ''}`} style={entryType !== tx.id ? { backgroundColor: hexToRgba(tx.hexColor, 0.1), color: tx.hexColor } : {}}>
                      <tx.icon size={28} />
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-black text-[13px] uppercase tracking-tight leading-none mb-1 ${entryType === tx.id ? 'text-white' : `text-[${THEME.primary}]`}`}>{tx.title}</h3>
                      <p className={`text-[10px] font-bold font-mono tracking-tighter ${entryType === tx.id ? 'text-white/70' : `text-[${THEME.dustyBlue}]`}`}>{tx.desc}</p>
                    </div>
                    {entryType === tx.id && <ChevronRight size={20} />}
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-9 xl:col-span-9 flex flex-col h-full overflow-hidden z-10">
              <h2 className={`text-[11px] font-black text-[${THEME.dustyBlue}] uppercase tracking-widest px-1 mb-4 font-mono`}>2. Fill Application Details</h2>
              <div className="backdrop-blur-xl rounded-2xl relative overflow-hidden h-full shadow-2xl flex flex-col glass-border transition-all duration-500" style={{ backgroundColor: hexToRgba(activeTx.hexColor, 0.15) }}>
                <div className="absolute top-0 left-0 w-full h-1.5 z-10 transition-colors duration-500" style={{ backgroundColor: activeTx.hexColor }}></div>

                {showSuccess && (
                   <div className="absolute inset-0 z-50 bg-white/95 backdrop-blur-md flex flex-col items-center justify-center animate-fade">
                     <div className={`w-24 h-24 bg-[${THEME.success}]/10 rounded-full flex items-center justify-center mb-6 border-[6px] border-white shadow-inner`}><CheckCircle2 size={56} className={`text-[${THEME.success}]`} /></div>
                     <h3 className={`text-2xl font-black text-[${THEME.primary}] uppercase mb-4 font-mono tracking-widest`}>SUBMISSION SUCCESS</h3>
                     <p className={`text-[12px] font-bold text-[${THEME.dustyBlue}] text-center max-w-lg tracking-wider`}>Request broad-casted to ISO workflows.</p>
                   </div>
                )}
                
                <div className="p-8 flex-1 overflow-y-auto custom-scrollbar relative z-20 flex flex-col gap-8">
                  <form onSubmit={handleSubmit} className="space-y-8 flex-1 flex flex-col">
                    <div className="bg-white/80 backdrop-blur-md p-6 rounded-xl border border-white/60 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-6 relative z-30">
                       <div className="space-y-1.5 relative">
                          <div className="flex justify-between items-center">
                             <label className={`text-[9px] font-black text-[${THEME.dustyBlue}] uppercase font-mono`}>DAR No. (Auto)</label>
                             <button type="button" onClick={() => setShowDarConfig(true)} className={`text-[${THEME.primary}] hover:text-[${THEME.danger}] transition-colors bg-white shadow-sm border border-[${THEME.silver}] rounded p-1 cursor-pointer`}><Settings size={14}/></button>
                          </div>
                          <input type="text" readOnly value={generatedDarNo} className={`w-full bg-transparent border border-[${THEME.silver}] rounded-lg px-4 py-2.5 text-[12px] font-black text-[${THEME.danger}] font-mono outline-none cursor-not-allowed`} />
                       </div>
                       <div className="space-y-1.5"><label className={`text-[9px] font-black text-[${THEME.dustyBlue}] uppercase font-mono`}>Request Date *</label><input type="date" name="requestDate" required value={headerData.requestDate} onChange={handleHeaderChange} className={`w-full bg-white border border-[${THEME.silver}] rounded-lg px-4 py-2.5 text-[12px] font-bold text-[${THEME.primary}] outline-none focus:border-[${THEME.primary}] transition-all cursor-pointer`} /></div>
                       <div className="space-y-1.5"><label className={`text-[9px] font-black text-[${THEME.dustyBlue}] uppercase font-mono`}>Department *</label><select name="department" required value={headerData.department} onChange={handleHeaderChange} className={`w-full bg-white border border-[${THEME.silver}] rounded-lg px-4 py-2.5 text-[12px] font-bold text-[${THEME.primary}] outline-none uppercase font-mono cursor-pointer`}>{departments.map(d => <option key={d} value={d}>{d}</option>)}</select></div>
                       <div className="space-y-1.5"><label className={`text-[9px] font-black text-[${THEME.dustyBlue}] uppercase font-mono`}>Requester Name *</label><input type="text" name="requester" required placeholder="ชื่อ-นามสกุล..." value={headerData.requester} onChange={handleHeaderChange} className={`w-full bg-white border border-[${THEME.silver}] rounded-lg px-4 py-2.5 text-[12px] font-bold text-[${THEME.primary}] outline-none transition-all`} /></div>
                    </div>

                    <div className="flex justify-between items-center px-2 z-20 mt-2">
                        <h3 className={`text-xl font-black text-[${THEME.primary}] uppercase tracking-widest font-mono flex items-center gap-3`}>
                           <TableIcon size={24} style={{ color: activeTx.hexColor }}/> {activeTx.title} List
                        </h3>
                        <button type="button" onClick={addNewItem} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[${THEME.primary}] text-white font-black uppercase text-[10px] shadow-lg hover:bg-[${THEME.skyBlue}] transition-all cursor-pointer`}><Plus size={16}/> Add New Item</button>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-white shadow-xl flex flex-col overflow-hidden z-20 relative">
                       <div className="overflow-x-auto custom-scrollbar overflow-visible">
                          <table className="w-full text-left border-collapse min-w-[1000px]">
                            <thead className={`bg-[${THEME.primary}] text-white font-mono text-[9px] uppercase tracking-[0.2em] relative z-20`}>
                               <tr>
                                  <th className="py-4 px-6 border-r border-white/10 w-10 text-center">#</th>
                                  <th className="py-4 px-6 border-r border-white/10">Document/Details</th>
                                  <th className="py-4 px-6 text-center w-24">Action</th>
                               </tr>
                            </thead>
                            <tbody className="divide-y divide-[${THEME.silver}]">
                               {requestItems.map((item: any, index) => (
                                 <tr key={index} className="hover:bg-white/40 transition-colors animate-fade relative z-10">
                                   <td className="py-4 px-6 font-black text-gray-400 font-mono align-top text-[11px] text-center">{index + 1}</td>
                                   <td className="py-4 px-6">
                                      <input type="text" value={item.docNo || ''} onChange={(e) => updateItemField(index, 'docNo', e.target.value)} className={`w-full bg-transparent border-b border-[${THEME.silver}] py-1 font-bold font-mono text-[${THEME.danger}] outline-none text-[12px]`} placeholder="Doc ID / Title..." />
                                   </td>
                                   <td className="py-4 px-6 text-center">
                                      <button type="button" onClick={() => removeItem(index)} className={`p-2 text-[${THEME.danger}] hover:bg-[${THEME.danger}] hover:text-white border border-[${THEME.danger}]/20 rounded-lg cursor-pointer`}><Trash size={16}/></button>
                                   </td>
                                 </tr>
                               ))}
                            </tbody>
                          </table>
                       </div>
                    </div>

                    <div className="bg-white/50 p-6 rounded-xl border border-white/40 shadow-sm space-y-3 z-20 mt-4">
                      <label className={`text-[10px] font-black text-[${THEME.primary}] uppercase tracking-widest font-mono flex items-center gap-2`}>
                        <AlertCircle size={16} className={`text-[${THEME.brightGold}]`}/> GLOBAL APPLICATION REMARKS <span className={`text-[${THEME.danger}]`}>*</span>
                      </label>
                      <textarea required value={globalRemarks} onChange={(e) => setGlobalRemarks(e.target.value)} rows={3} className={`w-full bg-white border border-[${THEME.silver}] rounded-xl px-6 py-4 text-[12px] font-medium text-[${THEME.primary}] outline-none shadow-inner`} placeholder="โปรดระบุรายละเอียดเพิ่มเติม..."></textarea>
                    </div>

                    <div className="pt-6 border-t border-white/30 flex justify-end items-center px-4 mb-2 z-20">
                      <button type="submit" disabled={isSubmitting} className="px-20 py-4 rounded-xl font-black text-white uppercase shadow-xl transition-all hover:scale-105 disabled:opacity-50 cursor-pointer flex items-center gap-2" style={{ backgroundColor: activeTx.hexColor, fontSize: '13px' }}>
                        <Printer size={20} /> PREVIEW & SUBMIT
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          
          {showDarConfig && (
            <div className={`fixed inset-0 z-[120] flex items-center justify-center p-4 bg-[${THEME.darkSlate}]/60 backdrop-blur-sm`}>
              <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl relative overflow-hidden flex flex-col">
                 <div className={`p-5 flex justify-between items-center border-b border-[${THEME.silver}]`}>
                    <h3 className={`font-extrabold text-[${THEME.primary}] uppercase font-mono`}><Settings size={18} className="inline mr-2"/> FORMAT SETUP</h3>
                    <button onClick={() => setShowDarConfig(false)} className="p-1 text-gray-400 hover:text-gray-600"><X size={20}/></button>
                 </div>
                 <div className="p-6 bg-gray-50 flex-1">
                    <label className={`text-[10px] font-black text-[${THEME.dustyBlue}] uppercase font-mono`}>PREFIX</label>
                    <input type="text" value={darNoConfig.prefix} onChange={e => setDarNoConfig({...darNoConfig, prefix: e.target.value})} className={`w-full border border-[${THEME.silver}] rounded-lg px-4 py-2 mt-1 mb-4`} />
                 </div>
                 <div className="p-5 border-t border-gray-100 bg-white">
                    <button onClick={() => setShowDarConfig(false)} className={`w-full bg-[${THEME.primary}] text-white py-3 rounded-xl font-black uppercase font-mono`}>SAVE</button>
                 </div>
              </div>
            </div>
          )}

          {isPreviewOpen && (
            <div className={`fixed inset-0 z-[120] flex justify-center items-start pt-10 pb-10 p-4 bg-[${THEME.darkSlate}]/80 backdrop-blur-sm overflow-y-auto no-print`}>
              <div className="flex flex-col max-w-full">
                  <div className={`bg-[${THEME.primary}] text-white px-6 py-4 flex justify-between items-center rounded-t-xl w-[210mm] mx-auto`}>
                    <h2 className="font-extrabold flex items-center gap-3 uppercase font-mono text-[13px]"><Printer size={18}/> PREVIEW DAR REPORT</h2>
                    <button onClick={() => setIsPreviewOpen(false)}><X size={20}/></button>
                  </div>
                  <div className="w-[210mm] min-h-[297mm] bg-white mx-auto shadow-2xl px-[8mm] py-[10mm] relative font-sans flex flex-col" id="print-area">
                    <h1 className="text-xl font-extrabold">T All Intelligence Co., Ltd.</h1>
                    <p>DAR NO: {generatedDarNo}</p>
                  </div>
                  <div className={`bg-white px-6 py-4 flex justify-end gap-4 w-[210mm] mx-auto border border-t-0 border-[${THEME.silver}] rounded-b-xl shadow-lg mt-0.5`}>
                    <button onClick={() => setIsPreviewOpen(false)} className={`px-6 py-3 font-bold text-[${THEME.dustyBlue}] uppercase font-mono`}>CANCEL</button>
                    <button onClick={handleConfirmSubmit} className={`px-8 py-3 bg-[${THEME.primary}] text-white font-black rounded-lg flex items-center gap-2 uppercase font-mono`}><Printer size={18}/> PRINT DAR</button>
                  </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
