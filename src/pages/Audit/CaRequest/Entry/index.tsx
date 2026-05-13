import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, ShieldCheck, Save, CheckCircle2, RefreshCw, HelpCircle, X, Zap, Network, 
  FileText, Globe, ServerCrash, MoreHorizontal, Search, MessageSquareDiff, Settings, Trash2, 
  Printer, Camera, FileDown, QrCode, AlertCircle
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

const hexToRgba = (hex: string, opacity: number) => {
  let r = 0, g = 0, b = 0;
  if (hex && hex.length === 7) {
    r = parseInt(hex.slice(1, 3), 16); g = parseInt(hex.slice(3, 5), 16); b = parseInt(hex.slice(5, 7), 16);
  }
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

const MOCK_CAR_RECORDS: Record<string, any> = {
  'CAR 26/001': { 
    carNo: 'CAR 26/001', status: 'open', subject: 'Labeling Mismatch on Lot #202', department: 'WAREHOUSE TEAM', 
    ncLevel: 'MINOR', reporter: 'Customer SVC', refStandard: 'ISO 9001:2015', stdClause: '8.5.2',
    description: 'Customer reported receiving product with incorrect labels. Lot #202 has mismatching outer carton labels.',
    issueDate: '2026-02-12', sourceCategory: 'external_audit', sourceDetailType: 'Customer', sourceDetailText: 'TechCorp Inc.'
  },
  'CAR 26/002': { 
    carNo: 'CAR 26/002', status: 'responded', subject: 'Missing Inspector Signature', department: 'QA/QC', 
    ncLevel: 'MAJOR', reporter: 'Internal Auditor', refStandard: 'ISO 9001:2015', stdClause: '7.5.3',
    description: 'Found 5 production records without final inspector sign-off during line audit.',
    issueDate: '2026-02-10', sourceCategory: 'internal_audit', rootCause: 'New inspector was not fully aware of the sign-off requirement at the end of shift.',
    correction: 'Immediately reviewed and signed the missing 5 records. Recalled product verified.',
    correctiveAction: 'Update QA OJT Checklist to emphasize mandatory sign-off. Add visual reminder on desk.',
    targetDate: '2026-02-15', responderName: 'Somchai QA'
  },
};

export default function CaRequestEntry() {
  const [entryType, setEntryType] = useState('internal_audit'); 
  const [activeTab, setActiveTab] = useState('issue'); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isCarConfigOpen, setIsCarConfigOpen] = useState(false);

  const [carConfig, setCarConfig] = useState({ prefix: 'CAR', yearFormat: 'YY', separator: '/', digits: 3, currentSeq: 1 });
  const [standards] = useState(['GHPs&HACCP', 'ISO 22000:2018', 'ISO 9001:2015', 'ISO 14001:2015', 'ISO 45001:2018', 'FSSC 22000 V.6']);
  
  const [respondAttachments, setRespondAttachments] = useState<any[]>([]);

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const options: any = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const [formData, setFormData] = useState({
    carNo: '', issueDate: '2026-02-12', subject: '', reporter: '', department: 'PRODUCTION', ncLevel: 'MINOR',
    refStandard: 'ISO 9001:2015', stdClause: '', description: '', searchCarNo: '', rootCause: '', correction: '',
    correctiveAction: '', targetDate: '', responderName: '', verifyResult: 'pending', evidence: '', verifierName: '',
    verifyDate: '', newDueDate: '', sourceDetailType: '', sourceDetailText: ''
  });

  const txTypes = [
    { id: 'internal_audit', icon: ShieldAlert, title: 'CAR: INTERNAL AUDIT', desc: 'พบข้อบกพร่องจากการตรวจติดตามภายใน', hexColor: THEME.danger },
    { id: 'external_audit', icon: Globe, title: 'CAR: EXTERNAL AUDIT', desc: 'CB / ลูกค้า / กฎหมาย', hexColor: THEME.primary },
    { id: 'system_failure', icon: ServerCrash, title: 'CAR: SYSTEM FAILURE', desc: 'ระบบล้มเหลว หรือไม่เป็นไปตามเป้าหมาย', hexColor: THEME.deepPurple },
    { id: 'preventive_action', icon: ShieldCheck, title: 'PAR: PREVENTIVE ACTION', desc: 'ข้อเสนอแนะเชิงป้องกัน (OFI)', hexColor: THEME.slateBlue },
    { id: 'other', icon: MoreHorizontal, title: 'OTHER SOURCE', desc: 'แหล่งข้อบกพร่องอื่นๆ', hexColor: THEME.dustyBlue },
  ];

  const activeTx = txTypes.find(t => t.id === entryType) || txTypes[0];

  const generateCarNo = () => {
    const d = new Date(formData.issueDate || new Date());
    const yearStr = carConfig.yearFormat === 'YY' ? d.getFullYear().toString().slice(-2) : d.getFullYear().toString();
    const seqStr = carConfig.currentSeq.toString().padStart(carConfig.digits, '0');
    return `${carConfig.prefix} ${yearStr}${carConfig.separator}${seqStr}`;
  };

  useEffect(() => {
    if (activeTab === 'issue' && !formData.carNo) {
      setFormData(prev => ({ ...prev, carNo: generateCarNo() }));
    }
  }, [activeTab, carConfig]);

  useEffect(() => {
    setFormData(prev => ({ ...prev, sourceDetailType: '', sourceDetailText: '' }));
  }, [entryType]);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDropdownSelect = (e: any) => {
    const selectedCar = e.target.value;
    setFormData(prev => ({ ...prev, searchCarNo: selectedCar }));
    
    if (selectedCar && MOCK_CAR_RECORDS[selectedCar]) {
      const record = MOCK_CAR_RECORDS[selectedCar];
      setFormData(prev => ({ ...prev, ...record, searchCarNo: selectedCar }));
      if(record.sourceCategory) {
        setEntryType(record.sourceCategory);
      }
    } else {
      if (activeTab === 'respond') {
        setFormData(prev => ({...prev, rootCause: '', correction: '', correctiveAction: '', targetDate: '', responderName: ''}));
      } else if (activeTab === 'verify') {
        setFormData(prev => ({...prev, evidence: '', verifierName: '', verifyDate: '', verifyResult: 'pending'}));
      }
    }
  };

  const handleFileChange = (e: any, fileType: string) => {
    const files = Array.from(e.target.files) as File[];
    const newAttachments = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: fileType,
      preview: fileType === 'image' ? URL.createObjectURL(file) : null
    }));
    setRespondAttachments(prev => [...prev, ...newAttachments]);
    e.target.value = null;
  };

  const removeAttachment = (id: string) => {
    setRespondAttachments(prev => prev.filter(f => f.id !== id));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      if (activeTab === 'issue') {
        setCarConfig(prev => ({ ...prev, currentSeq: prev.currentSeq + 1 }));
        setFormData(prev => ({ ...prev, carNo: '' })); 
      }
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1500);
  };

  const renderSourceFields = () => {
    switch(entryType) {
      case 'external_audit':
        return (
          <div className="grid grid-cols-2 gap-6 animate-fadeIn">
            <div className="space-y-1.5"><label className="text-[10px] font-black text-[#7a8b95] uppercase font-mono tracking-widest">External Audit By *</label>
              <select name="sourceDetailType" required value={formData.sourceDetailType} onChange={handleInputChange} className="w-full bg-white/50 border border-gray-200 rounded-lg px-4 py-3 text-[12px] font-bold outline-none font-mono uppercase focus:border-[#3f809e] transition-colors"><option value="">-- Select Type --</option><option value="Customer">Customer</option><option value="Certification Body (CB)">Certification Body (CB)</option><option value="Government/Regulatory">Government / Regulatory</option><option value="Supplier">Supplier</option></select>
            </div>
            <div className="space-y-1.5"><label className="text-[10px] font-black text-[#7a8b95] uppercase font-mono tracking-widest">Organization Name *</label>
              <input type="text" name="sourceDetailText" required placeholder="Organization Name..." value={formData.sourceDetailText} onChange={handleInputChange} className="w-full bg-white/50 border border-gray-200 rounded-lg px-4 py-3 text-[12px] font-bold outline-none focus:border-[#3f809e] transition-colors"/>
            </div>
          </div>
        );
      case 'internal_audit':
        return (
          <div className="grid grid-cols-2 gap-6 animate-fadeIn">
            <div className="space-y-1.5"><label className="text-[10px] font-black text-[#7a8b95] uppercase font-mono tracking-widest">Internal Auditor Team *</label>
              <input type="text" name="sourceDetailType" required placeholder="e.g. ISO 9001 Team" value={formData.sourceDetailType} onChange={handleInputChange} className="w-full bg-white/50 border border-gray-200 rounded-lg px-4 py-3 text-[12px] font-bold outline-none focus:border-[#3f809e] transition-colors" />
            </div>
            <div className="space-y-1.5"><label className="text-[10px] font-black text-[#7a8b95] uppercase font-mono tracking-widest">Audit Plan / Ref. No *</label>
              <input type="text" name="sourceDetailText" required placeholder="Ref. No..." value={formData.sourceDetailText} onChange={handleInputChange} className="w-full bg-white/50 border border-gray-200 rounded-lg px-4 py-3 text-[12px] font-bold outline-none focus:border-[#3f809e] transition-colors" />
            </div>
          </div>
        );
      case 'system_failure':
        return (
          <div className="grid grid-cols-2 gap-6 animate-fadeIn">
            <div className="space-y-1.5"><label className="text-[10px] font-black text-[#7a8b95] uppercase font-mono tracking-widest">Failed System / Process *</label>
              <input type="text" name="sourceDetailType" required placeholder="Process Name..." value={formData.sourceDetailType} onChange={handleInputChange} className="w-full bg-white/50 border border-gray-200 rounded-lg px-4 py-3 text-[12px] font-bold outline-none focus:border-[#3f809e] transition-colors" />
            </div>
            <div className="space-y-1.5"><label className="text-[10px] font-black text-[#7a8b95] uppercase font-mono tracking-widest">Incident Report Ref *</label>
              <input type="text" name="sourceDetailText" required placeholder="Ref. No..." value={formData.sourceDetailText} onChange={handleInputChange} className="w-full bg-white/50 border border-gray-200 rounded-lg px-4 py-3 text-[12px] font-bold outline-none focus:border-[#3f809e] transition-colors" />
            </div>
          </div>
        );
      case 'preventive_action':
        return (
          <div className="grid grid-cols-2 gap-6 animate-fadeIn">
            <div className="space-y-1.5"><label className="text-[10px] font-black text-[#7a8b95] uppercase font-mono tracking-widest">Observation Area *</label>
              <input type="text" name="sourceDetailType" required placeholder="Observation Area..." value={formData.sourceDetailType} onChange={handleInputChange} className="w-full bg-white/50 border border-gray-200 rounded-lg px-4 py-3 text-[12px] font-bold outline-none focus:border-[#3f809e] transition-colors" />
            </div>
            <div className="space-y-1.5"><label className="text-[10px] font-black text-[#7a8b95] uppercase font-mono tracking-widest">Risk Assessment Ref *</label>
              <input type="text" name="sourceDetailText" required placeholder="Ref. No..." value={formData.sourceDetailText} onChange={handleInputChange} className="w-full bg-white/50 border border-gray-200 rounded-lg px-4 py-3 text-[12px] font-bold outline-none focus:border-[#3f809e] transition-colors" />
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-1.5 animate-fadeIn">
            <label className="text-[10px] font-black text-[#7a8b95] uppercase font-mono tracking-widest">Specify Source Details *</label>
            <input type="text" name="sourceDetailText" required placeholder="Specify Details..." value={formData.sourceDetailText} onChange={handleInputChange} className="w-full bg-white/50 border border-gray-200 rounded-lg px-4 py-3 text-[12px] font-bold outline-none focus:border-[#3f809e] transition-colors" />
          </div>
        );
    }
  };

  return (
    <div className="flex flex-1 w-full flex-col pb-6 bg-transparent px-8 animate-iaFade">
      
      {showSuccess && (
        <div className="fixed inset-0 z-50 bg-[#212c46]/20 backdrop-blur-md flex flex-col items-center justify-center animate-fadeIn">
          <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-xl border border-gray-200">
            <CheckCircle2 size={56} style={{ color: THEME.success }} />
          </div>
          <h3 className="text-2xl font-black text-[#212c46] uppercase mb-4 tracking-tighter">SUBMISSION SUCCESS</h3>
        </div>
      )}

      {/* Header */}
      <div className="pt-3 pb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 z-20 shrink-0">
          <div className="flex items-center gap-5">
              <div className="relative flex items-center justify-center group cursor-default shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#a94228] to-[#d96245] blur-xl opacity-40 rounded-full animate-pulse"></div>
                  <div className="relative z-10 p-3 border border-[#a94228]/40 rounded-2xl bg-gradient-to-tr from-[#a94228] to-[#d96245] shadow-xl ring-1 ring-white/20">
                      <Network size={32} className="text-white drop-shadow-md" />
                  </div>
              </div>
              <div>
                  <h3 className="font-black text-transparent bg-clip-text bg-gradient-to-r from-[#212c46] to-[#a94228] uppercase tracking-tighter leading-none" style={{ fontSize: '24px' }}>
                      CA ENTRY <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a94228] to-[#b58c4f]">FORM</span>
                  </h3>
                  <p className="text-[12px] font-bold text-[#7a8b95] uppercase tracking-[0.2em] mt-1 leading-none">
                      CORRECTIVE ACTION SINGLE POINT ENTRY
                  </p>
              </div>
          </div>
          <div className="flex items-center gap-2">
              <button onClick={() => setIsPreviewOpen(true)} className="bg-white text-[#212c46] px-6 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-sm hover:bg-gray-50 flex items-center gap-2 border border-gray-200 transition-colors">
                  <Printer size={16} /> Preview Report
              </button>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0 pt-2">
        {/* Sidebar TABS */}
        <div className="lg:col-span-3 xl:col-span-3 space-y-4 flex flex-col h-full z-10">
          <h2 className="text-[11px] font-black text-[#7a8b95] uppercase tracking-widest px-1 font-mono">1. CAR / PAR SOURCE</h2>
          <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1 pb-4">
            {txTypes.map((tx) => (
              <button 
                key={tx.id} 
                onClick={() => setEntryType(tx.id)} 
                className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 flex items-center gap-4 ${entryType === tx.id ? 'bg-white shadow-[0_8px_30px_rgb(0,0,0,0.08)] border-transparent' : 'bg-white/50 border-gray-100 hover:bg-white hover:shadow-sm'}`}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-inner" style={{ backgroundColor: hexToRgba(tx.hexColor, 0.1), color: tx.hexColor }}>
                  <tx.icon size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-black text-[12px] uppercase tracking-tight leading-none mb-1.5" style={{ color: entryType === tx.id ? THEME.primary : THEME.indigo }}>{tx.title}</h3>
                  <p className="text-[10px] font-bold font-mono tracking-tighter text-[#7a8b95]">{tx.desc}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="bg-white/80 p-6 rounded-2xl shadow-sm animate-fadeIn border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <RefreshCw size={16} className="text-[#3f809e] animate-spin-slow"/>
                <h4 className="text-[10px] font-black text-[#212c46] uppercase tracking-widest font-mono">AUTO-ROUTING FLOW:</h4>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                <div className="px-3 py-1.5 rounded-lg text-[9px] font-extrabold uppercase border font-mono tracking-tight shadow-sm bg-blue-50 text-blue-600 border-blue-200">CA LOG DB</div>
                <div className="px-3 py-1.5 rounded-lg text-[9px] font-extrabold uppercase border font-mono tracking-tight shadow-sm bg-orange-50 text-orange-600 border-orange-200">AUDITEE NOTIFY</div>
              </div>
              <div className="pt-3 border-t border-gray-100 font-bold text-[10px] text-[#7a8b95] italic">Broadcasted to ISO Workflow center.</div>
          </div>
        </div>

        {/* Main Area */}
        <div className="lg:col-span-9 xl:col-span-9 flex flex-col h-full overflow-hidden z-10">
          <div className="flex items-center gap-2 mb-4 bg-white/50 p-1.5 rounded-xl border border-gray-200 shadow-sm">
            {['issue', 'respond', 'verify'].map((tab) => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)} 
                className={`flex-1 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all font-mono ${activeTab === tab ? 'bg-gradient-to-r from-[#212c46] to-[#3f809e] text-white shadow-md' : 'text-[#7a8b95] hover:bg-white hover:text-[#212c46]'}`}
              >
                {tab === 'issue' ? 'PART 1: ISSUE (AUDITOR)' : tab === 'respond' ? 'PART 2: RESPOND (AUDITEE)' : 'PART 3: VERIFY (AUDITOR)'}
              </button>
            ))}
          </div>

          <div className="rounded-3xl relative overflow-hidden h-full shadow-lg flex flex-col border border-gray-200 bg-white/90 backdrop-blur-md">
            
            <div className="p-8 flex-1 overflow-y-auto custom-scrollbar relative z-20">
              <form onSubmit={handleSubmit} className="space-y-8 flex flex-col h-full">
                
                {/* --- PART 1: ISSUE --- */}
                {activeTab === 'issue' && (
                  <div className="animate-fadeIn space-y-6">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#a94228] to-[#d96245] text-white flex items-center justify-center shadow-md font-black text-xl">1</div>
                      <div>
                        <h2 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#212c46] to-[#a94228] uppercase tracking-tighter">NON-CONFORMANCE DESCRIPTION</h2>
                        <p className="text-[11px] text-[#7a8b95] font-bold tracking-widest uppercase">Issue details & findings by Auditor</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                       <div className="space-y-1.5">
                         <label className="text-[10px] font-black text-[#7a8b95] uppercase font-mono flex items-center justify-between tracking-widest">
                           <span>CAR NUMBER (AUTO-GEN) *</span>
                         </label>
                         <input type="text" name="carNo" readOnly value={formData.carNo} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[14px] font-black outline-none font-mono tracking-widest text-[#212c46] shadow-inner cursor-not-allowed" />
                       </div>
                       <div className="space-y-1.5"><label className="text-[10px] font-black text-[#7a8b95] uppercase font-mono tracking-widest">ISSUE DATE *</label><input type="date" name="issueDate" required value={formData.issueDate} onChange={handleInputChange} className="w-full bg-white/50 border border-gray-200 rounded-xl px-4 py-3 text-[12px] font-bold outline-none focus:border-[#3f809e] transition-colors" /></div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-1.5"><label className="text-[10px] font-black text-[#7a8b95] uppercase font-mono tracking-widest">REPORTER / AUDITOR *</label><input type="text" name="reporter" required placeholder="Auditor Name..." value={formData.reporter} onChange={handleInputChange} className="w-full bg-white/50 border border-gray-200 rounded-xl px-4 py-3 text-[12px] font-bold outline-none focus:border-[#3f809e] transition-colors" /></div>
                      <div className="space-y-1.5"><label className="text-[10px] font-black text-[#7a8b95] uppercase font-mono tracking-widest">AUDITEE DEPARTMENT *</label><select name="department" required value={formData.department} onChange={handleInputChange} className="w-full bg-white/50 border border-gray-200 rounded-xl px-4 py-3 text-[12px] font-bold outline-none uppercase font-mono focus:border-[#3f809e] transition-colors">{['PRODUCTION', 'QA/QC', 'HR', 'IT', 'WAREHOUSE TEAM'].map(d => <option key={d} value={d}>{d}</option>)}</select></div>
                    </div>
                    
                    <div className="bg-[#f8f9fa] p-6 rounded-2xl border border-gray-100 space-y-4">
                      <h4 className="text-[11px] font-black uppercase flex items-center gap-2 tracking-widest" style={{ color: activeTx.hexColor }}>
                        <activeTx.icon size={18}/> {activeTx.title.replace(/^(CAR|PAR):\s*/, '')} DETAILS
                      </h4>
                      {renderSourceFields()}
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-1.5"><label className="text-[10px] font-black text-[#7a8b95] uppercase font-mono tracking-widest">NC LEVEL *</label><select name="ncLevel" required value={formData.ncLevel} onChange={handleInputChange} className="w-full bg-white/50 border border-gray-200 rounded-xl px-4 py-3 text-[12px] font-bold outline-none font-mono uppercase focus:border-[#3f809e] transition-colors"><option value="CRITICAL">CRITICAL</option><option value="MAJOR">MAJOR</option><option value="MINOR">MINOR</option><option value="OFI">OFI</option></select></div>
                      <div className="space-y-1.5"><label className="text-[10px] font-black text-[#7a8b95] uppercase font-mono tracking-widest">REF. STANDARD *</label><select name="refStandard" required value={formData.refStandard} onChange={handleInputChange} className="w-full bg-white/50 border border-gray-200 rounded-xl px-4 py-3 text-[12px] font-bold outline-none font-mono uppercase focus:border-[#3f809e] transition-colors">{standards.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                    </div>
                    <div className="space-y-1.5"><label className="text-[10px] font-black text-[#7a8b95] uppercase font-mono tracking-widest">STANDARD CLAUSE *</label><input type="text" name="stdClause" required placeholder="Clause..." value={formData.stdClause} onChange={handleInputChange} className="w-full bg-white/50 border border-gray-200 rounded-xl px-4 py-3 text-[12px] font-bold outline-none font-mono focus:border-[#3f809e] transition-colors" /></div>
                    <div className="space-y-1.5"><label className="text-[10px] font-black text-[#7a8b95] uppercase font-mono tracking-widest">SUBJECT / FINDINGS *</label><input type="text" name="subject" required placeholder="Subject..." value={formData.subject} onChange={handleInputChange} className="w-full bg-white/50 border border-gray-200 rounded-xl px-4 py-3 text-[12px] font-bold outline-none focus:border-[#3f809e] transition-colors" /></div>
                    <div className="space-y-1.5"><label className="text-[10px] font-black text-[#7a8b95] uppercase font-mono tracking-widest">DETAILED DESCRIPTION & EVIDENCE *</label><textarea name="description" required rows={4} placeholder="Description..." value={formData.description} onChange={handleInputChange} className="w-full bg-[#f8f9fa] border border-gray-200 rounded-2xl px-5 py-4 text-[12px] font-medium outline-none focus:border-[#3f809e] transition-colors resize-y" ></textarea></div>
                  </div>
                )}

                {/* --- PART 2: RESPOND --- */}
                {activeTab === 'respond' && (
                  <div className="animate-fadeIn space-y-6">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#3f809e] to-[#4d87a8] text-white flex items-center justify-center shadow-md font-black text-xl">2</div>
                      <div>
                        <h2 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#212c46] to-[#3f809e] uppercase tracking-tighter">AUDITEE RESPONSE</h2>
                        <p className="text-[11px] text-[#7a8b95] font-bold tracking-widest uppercase">Root cause analysis & Action plan</p>
                      </div>
                    </div>

                    <div className="p-5 bg-[#f8f9fa] rounded-2xl border border-gray-200 flex flex-col md:flex-row items-start md:items-center gap-4 shadow-sm">
                      <div className="p-3 bg-white rounded-xl shadow-sm"><Search size={20} className="text-[#3f809e]"/></div>
                      <div className="flex-1 w-full">
                        <label className="text-[10px] font-black text-[#7a8b95] uppercase font-mono tracking-widest block mb-2">SELECT PENDING CAR TO RESPOND</label>
                        <select name="searchCarNo" value={formData.searchCarNo} onChange={handleDropdownSelect} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 font-black text-[#212c46] text-[13px] font-mono uppercase cursor-pointer focus:border-[#3f809e] outline-none transition-colors">
                          <option value="">-- Choose CAR Number --</option>
                          {Object.values(MOCK_CAR_RECORDS).filter(c => c.status === 'open').map(car => (
                            <option key={car.carNo} value={car.carNo}>{car.carNo} - {car.subject}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-[#7a8b95] uppercase font-mono tracking-widest">Root Cause Analysis *</label>
                      <textarea name="rootCause" required rows={4} placeholder="Root Cause Analysis using 5-why..." value={formData.rootCause} onChange={handleInputChange} className="w-full bg-[#f8f9fa] border border-red-200 rounded-2xl px-5 py-4 text-[12px] font-medium outline-none focus:border-red-400 focus:bg-white transition-colors" ></textarea>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4"><label className="text-[10px] font-black text-[#7a8b95] uppercase font-mono tracking-widest">Correction Action *</label><textarea name="correction" required rows={5} placeholder="Correction..." value={formData.correction} onChange={handleInputChange} className="w-full bg-[#f8f9fa] border border-orange-200 rounded-2xl px-5 py-4 text-[12px] font-medium outline-none focus:border-orange-400 focus:bg-white transition-colors" ></textarea></div>
                      <div className="space-y-4"><label className="text-[10px] font-black text-[#7a8b95] uppercase font-mono tracking-widest">Preventive Action *</label><textarea name="correctiveAction" required rows={5} placeholder="Preventive Action..." value={formData.correctiveAction} onChange={handleInputChange} className="w-full bg-[#f8f9fa] border border-emerald-200 rounded-2xl px-5 py-4 text-[12px] font-medium outline-none focus:border-emerald-400 focus:bg-white transition-colors" ></textarea></div>
                    </div>
                    
                    <div className="bg-white/50 p-6 rounded-2xl border border-gray-200 space-y-4">
                      <h4 className="text-[11px] font-black text-[#212c46] uppercase tracking-widest flex items-center gap-2 font-mono border-b border-gray-100 pb-3">
                        <Camera size={18} className="text-[#3f809e]"/> Attachments / Evidence
                      </h4>
                      <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="relative group">
                          <input type="file" multiple accept="image/*" className="hidden" id="photo-upload-multi" onChange={(e) => handleFileChange(e, 'image')} />
                          <label htmlFor="photo-upload-multi" className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-2xl hover:border-[#3f809e] hover:bg-white transition-all cursor-pointer bg-[#f8f9fa]">
                            <Camera size={28} className="text-gray-400 group-hover:text-[#3f809e] mb-3 transition-colors"/>
                            <span className="text-[11px] font-black text-[#7a8b95] uppercase font-mono tracking-widest">Add Photos</span>
                          </label>
                        </div>
                        <div className="relative group">
                          <input type="file" multiple accept=".pdf,.doc,.docx,.xls,.xlsx" className="hidden" id="doc-upload-multi" onChange={(e) => handleFileChange(e, 'document')} />
                          <label htmlFor="doc-upload-multi" className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-2xl hover:border-[#3f809e] hover:bg-white transition-all cursor-pointer bg-[#f8f9fa]">
                            <FileDown size={28} className="text-gray-400 group-hover:text-[#3f809e] mb-3 transition-colors"/>
                            <span className="text-[11px] font-black text-[#7a8b95] uppercase font-mono tracking-widest">Add Documents</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6"><div className="space-y-1.5"><label className="text-[10px] font-black text-[#7a8b95] uppercase font-mono tracking-widest">TARGET COMPLETE DUE DATE *</label><input type="date" name="targetDate" required value={formData.targetDate} onChange={handleInputChange} className="w-full bg-white/50 border border-gray-200 rounded-xl px-4 py-3 text-[12px] font-bold outline-none focus:border-[#3f809e] transition-colors" /></div><div className="space-y-1.5"><label className="text-[10px] font-black text-[#7a8b95] uppercase font-mono tracking-widest">RESPONDER NAME *</label><input type="text" name="responderName" required placeholder="Responder Name..." value={formData.responderName} onChange={handleInputChange} className="w-full bg-white/50 border border-gray-200 rounded-xl px-4 py-3 text-[12px] font-bold outline-none focus:border-[#3f809e] transition-colors" /></div></div>
                  </div>
                )}

                {/* --- PART 3: VERIFY --- */}
                {activeTab === 'verify' && (
                  <div className="animate-fadeIn space-y-6">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#657f4d] to-[#8e9141] text-white flex items-center justify-center shadow-md font-black text-xl">3</div>
                      <div>
                        <h2 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#212c46] to-[#657f4d] uppercase tracking-tighter">INTERNAL FOLLOW UP RESULTS</h2>
                        <p className="text-[11px] text-[#7a8b95] font-bold tracking-widest uppercase">Verification & Closing by Auditor</p>
                      </div>
                    </div>

                    <div className="p-5 bg-[#f8f9fa] rounded-2xl border border-gray-200 flex flex-col md:flex-row items-start md:items-center gap-4 shadow-sm">
                      <div className="p-3 bg-white rounded-xl shadow-sm"><Search size={20} className="text-[#657f4d]"/></div>
                      <div className="flex-1 w-full">
                        <label className="text-[10px] font-black text-[#7a8b95] uppercase font-mono tracking-widest block mb-2">SELECT RESPONDED CAR TO VERIFY</label>
                        <select name="searchCarNo" value={formData.searchCarNo} onChange={handleDropdownSelect} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 font-black text-[#212c46] text-[13px] font-mono uppercase cursor-pointer focus:border-[#657f4d] outline-none transition-colors">
                          <option value="">-- Choose CAR Number --</option>
                          {Object.values(MOCK_CAR_RECORDS).filter(c => c.status === 'responded').map(car => (
                            <option key={car.carNo} value={car.carNo}>{car.carNo} - {car.subject}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-[#7a8b95] uppercase font-mono tracking-widest">VERIFICATION RESULT *</label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <label className={`flex flex-col items-center justify-center gap-3 bg-white border-2 p-6 rounded-2xl cursor-pointer transition-all shadow-sm ${formData.verifyResult === 'pass' ? 'border-emerald-500 bg-emerald-50/50' : 'border-gray-200 hover:border-emerald-300'}`}>
                          <input type="radio" name="verifyResult" value="pass" checked={formData.verifyResult === 'pass'} onChange={handleInputChange} className="hidden" />
                          <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${formData.verifyResult === 'pass' ? 'border-emerald-500 bg-emerald-500' : 'border-gray-300'}`}>
                            {formData.verifyResult === 'pass' && <div className="w-3 h-3 bg-white rounded-full"></div>}
                          </div>
                          <span className="font-black text-[#212c46] text-[11px] uppercase font-mono tracking-widest">CLOSED OUT</span>
                        </label>
                        <label className={`flex flex-col items-center justify-center gap-3 bg-white border-2 p-6 rounded-2xl cursor-pointer transition-all shadow-sm ${formData.verifyResult === 'pending' ? 'border-blue-500 bg-blue-50/50' : 'border-gray-200 hover:border-blue-300'}`}>
                          <input type="radio" name="verifyResult" value="pending" checked={formData.verifyResult === 'pending'} onChange={handleInputChange} className="hidden" />
                          <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${formData.verifyResult === 'pending' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}>
                            {formData.verifyResult === 'pending' && <div className="w-3 h-3 bg-white rounded-full"></div>}
                          </div>
                          <span className="font-black text-[#212c46] text-[11px] uppercase font-mono tracking-widest">PENDING</span>
                        </label>
                        <label className={`flex flex-col items-center justify-center gap-3 bg-white border-2 p-6 rounded-2xl cursor-pointer transition-all shadow-sm ${formData.verifyResult === 'report' ? 'border-orange-500 bg-orange-50/50' : 'border-gray-200 hover:border-orange-300'}`}>
                          <input type="radio" name="verifyResult" value="report" checked={formData.verifyResult === 'report'} onChange={handleInputChange} className="hidden" />
                          <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${formData.verifyResult === 'report' ? 'border-orange-500 bg-orange-500' : 'border-gray-300'}`}>
                            {formData.verifyResult === 'report' && <div className="w-3 h-3 bg-white rounded-full"></div>}
                          </div>
                          <span className="font-black text-[#212c46] text-[11px] uppercase font-mono tracking-widest">REPORT MR</span>
                        </label>
                      </div>
                    </div>
                    
                    <div className="space-y-2"><label className="text-[10px] font-black text-[#7a8b95] uppercase font-mono tracking-widest">REMARKS / DETAILS *</label><textarea name="evidence" required rows={5} placeholder="Verify details..." value={formData.evidence} onChange={handleInputChange} className="w-full bg-[#f8f9fa] border border-gray-200 rounded-2xl px-5 py-4 text-[12px] font-medium outline-none focus:border-[#657f4d] focus:bg-white transition-colors" ></textarea></div>
                    
                    <div className="grid grid-cols-2 gap-6"><div className="space-y-2"><label className="text-[10px] font-black text-[#7a8b95] uppercase font-mono tracking-widest">VERIFIER NAME *</label><input type="text" name="verifierName" required placeholder="Verifier Name..." value={formData.verifierName} onChange={handleInputChange} className="w-full bg-white/50 border border-gray-200 rounded-xl px-4 py-3 text-[12px] font-bold outline-none focus:border-[#657f4d] transition-colors"/></div><div className="space-y-2"><label className="text-[10px] font-black text-[#7a8b95] uppercase font-mono tracking-widest">VERIFY DATE *</label><input type="date" name="verifyDate" required value={formData.verifyDate} onChange={handleInputChange} className="w-full bg-white/50 border border-gray-200 rounded-xl px-4 py-3 text-[12px] font-bold outline-none focus:border-[#657f4d] transition-colors font-mono"/></div></div>
                  </div>
                )}

                <div className="pt-8 mt-auto flex justify-end items-center">
                  <button type="submit" disabled={isSubmitting} className="px-12 py-4 rounded-xl font-black text-white uppercase shadow-lg transition-all hover:opacity-90 flex items-center gap-3 disabled:opacity-50 text-[12px] tracking-widest" style={{ background: `linear-gradient(to right, ${THEME.primary}, ${activeTab === 'issue' ? activeTx.hexColor : activeTab === 'respond' ? THEME.skyBlue : THEME.success})` }}>
                    {isSubmitting ? <RefreshCw size={20} className="animate-spin" /> : <Save size={20} />} 
                    CONFIRM & SUBMIT
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
