import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Search, History, FileText, BookOpen, Clock,
  ChevronRight, GitCommit, FilePlus, FileEdit, 
  Copy, Trash2, HelpCircle, X, ShieldCheck, User,
  CalendarDays, Network, FileStack, ArrowDown, CheckCircle2,
  FileSearch, ChevronDown, Zap, Target, Activity
} from 'lucide-react';

// --- Global Styles ---
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700;800&family=Noto+Sans+Thai:wght@300;400;500;600;700;800&display=swap');

  :root {
    --font-mixed: 'JetBrains Mono', 'Noto Sans Thai', sans-serif;
  }

  * { 
    font-family: var(--font-mixed) !important; 
    box-sizing: border-box;
  }

  .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
  .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
  .custom-scrollbar::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 10px; }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94A3B8; }
  
  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  .animate-fade { animation: fadeIn 0.4s ease-out forwards; }
  @keyframes slideDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
  .animate-slide-down { animation: slideDown 0.3s ease-out forwards; }
`;

// --- Mock Data (Synced from Master List & Distribution) ---
const MOCK_MASTER_LIST = [
  { id: 'QP-PD-01', title: 'การวางแผนและควบคุมการผลิต (Production Planning)', type: 'Procedure', dept: 'Production', rev: '02', date: '20-MAR-2025', status: 'Active', owner: 'PD Mgr' },
  { id: 'WI-PD-001', title: 'วิธีปฏิบัติงานเดินเครื่อง CNC (CNC Operation)', type: 'Work Instruction', dept: 'Production', rev: '07', date: '01-FEB-2026', status: 'Active', owner: 'PD Sup' },
  { id: 'QM-01', title: 'คู่มือระบบบริหารคุณภาพ (Quality Management System Manual)', type: 'Manual', dept: 'Management', rev: '05', date: '01-JAN-2025', status: 'Active', owner: 'QMR' },
  { id: 'QP-QA-01', title: 'การควบคุมเอกสารและบันทึก (Document Control)', type: 'Procedure', dept: 'QA/QC', rev: '06', date: '10-JAN-2026', status: 'Active', owner: 'DCC' },
  { id: 'WI-QA-001', title: 'การตรวจสอบวัตถุดิบรับเข้า (Incoming Inspection)', type: 'Work Instruction', dept: 'QA/QC', rev: '02', date: '22-OCT-2025', status: 'Active', owner: 'IQC Sup' },
  { id: 'FM-EN-001-OLD', title: 'แบบบันทึก PM (ยกเลิกแล้ว)', type: 'Form', dept: 'Engineering', rev: '05', date: '10-JAN-2022', status: 'Obsolete', owner: 'EN Sup' },
];

// History Events mapped by Document ID
const MOCK_HISTORY: Record<string, any[]> = {
  'QP-PD-01': [
    { id: 'H1', date: '20-MAR-2025', action: 'Revise', darNo: 'DAR-25-030', rev: '02', requester: 'PD Mgr', changedPages: 'หน้า 5, แบบฟอร์มแนบท้าย', details: 'ปรับปรุงแบบฟอร์มแนบท้าย FM-PD-01 ให้รองรับข้อมูลเครื่องจักรใหม่', status: 'Published' },
    { id: 'H2', date: '15-FEB-2025', action: 'Copy', darNo: 'DAR-25-015', rev: '01', requester: 'QA Sup', changedPages: null, details: 'ขอสำเนาควบคุม (Controlled Copy) จำนวน 1 ชุด สำหรับอ้างอิงในห้องตรวจสอบคุณภาพ', status: 'Distributed' },
    { id: 'H3', date: '10-NOV-2024', action: 'Revise', darNo: 'DAR-24-110', rev: '01', requester: 'PD Mgr', changedPages: 'หัวข้อ 5.2, 5.3', details: 'เพิ่มขั้นตอนการตรวจสอบวัตถุดิบก่อนเข้าไลน์ผลิต เพื่อลดปัญหาของเสีย', status: 'Published' },
    { id: 'H4', date: '01-JAN-2024', action: 'New', darNo: 'DAR-24-001', rev: '00', requester: 'PD Mgr', changedPages: 'ทั้งฉบับ', details: 'จัดทำเอกสาร Procedure การวางแผนการผลิตขึ้นใหม่เพื่อใช้ในระบบ ISO 9001', status: 'Published' },
  ],
  'WI-PD-001': [
    { id: 'H1', date: '01-FEB-2026', action: 'Revise', darNo: 'DAR-26-012', rev: '07', requester: 'Somkiat P.', changedPages: 'หัวข้อ 4.1 ความปลอดภัย', details: 'ปรับปรุงขั้นตอนการทำงานเพิ่มเรื่องความปลอดภัย (PPE) สำหรับเครื่อง CNC รุ่นใหม่', status: 'Published' },
    { id: 'H2', date: '15-JAN-2026', action: 'Copy', darNo: 'DAR-26-005', rev: '06', requester: 'Wichai T.', changedPages: null, details: 'ขอสำเนาควบคุม (Controlled Copy) จำนวน 2 ชุด สำหรับติดหน้าเครื่อง Line A และ B', status: 'Distributed' },
    { id: 'H3', date: '10-NOV-2025', action: 'Revise', darNo: 'DAR-25-118', rev: '06', requester: 'Somkiat P.', changedPages: 'ตารางพารามิเตอร์ หน้า 3', details: 'แก้ไขพารามิเตอร์การตัดเพื่อลดอัตราของเสีย (Defect Rate)', status: 'Published' },
    { id: 'H4', date: '20-AUG-2024', action: 'Revise', darNo: 'DAR-24-080', rev: '05', requester: 'PD Mgr', changedPages: 'แบบฟอร์มแนบท้าย', details: 'อัปเดตแบบฟอร์มบันทึกการทำงานแนบท้าย WI', status: 'Published' },
    { id: 'H5', date: '05-MAY-2023', action: 'New', darNo: 'DAR-23-045', rev: '00', requester: 'PD Team', changedPages: 'ทั้งฉบับ', details: 'จัดทำเอกสารขั้นตอนการทำงานเครื่อง CNC ขึ้นใหม่ครั้งแรก', status: 'Published' },
  ],
  'QP-QA-01': [
    { id: 'H1', date: '10-JAN-2026', action: 'Revise', darNo: 'DAR-26-001', rev: '06', requester: 'DCC Admin', changedPages: 'หัวข้อ 6.0', details: 'ปรับปรุง Procedure เพื่อรองรับระบบ Document Control แบบ E-Document 100%', status: 'Published' },
    { id: 'H2', date: '12-MAR-2024', action: 'Copy', darNo: 'DAR-24-022', rev: '05', requester: 'External CB', changedPages: null, details: 'ให้สำเนา Uncontrolled สำหรับ Auditor ภายนอกใช้ประเมินระบบ', status: 'Distributed' },
    { id: 'H3', date: '01-DEC-2022', action: 'New', darNo: 'DAR-22-150', rev: '00', requester: 'QMR', changedPages: 'ทั้งฉบับ', details: 'ประกาศใช้ขั้นตอนการควบคุมเอกสารตามข้อกำหนด ISO 9001:2015', status: 'Published' },
  ],
  'QM-01': [
    { id: 'H1', date: '01-JAN-2025', action: 'Revise', darNo: 'DAR-25-001', rev: '05', requester: 'QMR', changedPages: 'นโยบายคุณภาพ, โครงสร้างองค์กร', details: 'อัปเดตนโยบายคุณภาพประจำปี 2025 และปรับโครงสร้างองค์กรใหม่', status: 'Published' },
    { id: 'H2', date: '15-DEC-2024', action: 'Copy', darNo: 'DAR-24-120', rev: '04', requester: 'Sales Mgr', changedPages: null, details: 'ขอสำเนา Uncontrolled เพื่อนำไปแนบเป็นเอกสารประกอบการประมูลงาน (Bidding)', status: 'Distributed' },
    { id: 'H3', date: '02-FEB-2024', action: 'Revise', darNo: 'DAR-24-010', rev: '04', requester: 'QMR', changedPages: 'หัวข้อ 6.1 การประเมินความเสี่ยง', details: 'ปรับปรุงวิธีการประเมินความเสี่ยงและโอกาสให้สอดคล้องกับสถานการณ์ปัจจุบัน', status: 'Published' },
    { id: 'H4', date: '10-MAY-2022', action: 'Revise', darNo: 'DAR-22-045', rev: '03', requester: 'QMR', changedPages: 'บทที่ 4 บริบทองค์กร', details: 'ทบทวนและอัปเดตบริบทองค์กรและการวิเคราะห์ SWOT ประจำปี', status: 'Published' },
    { id: 'H5', date: '01-JAN-2020', action: 'New', darNo: 'DAR-20-001', rev: '00', requester: 'QMR', changedPages: 'ทั้งฉบับ', details: 'จัดทำคู่มือคุณภาพฉบับแรกเพื่อขอการรับรองระบบ ISO 9001:2015', status: 'Published' },
  ],
  'FM-EN-001-OLD': [
    { id: 'H1', date: '01-SEP-2025', action: 'Obsolete', darNo: 'DAR-25-095', rev: '05', requester: 'EN Sup', changedPages: 'ยกเลิกทั้งฉบับ', details: 'ขอยกเลิกการใช้งานแบบฟอร์มนี้ เนื่องจากเปลี่ยนไปใช้ฟอร์ม E-Form ผ่านระบบ ERP', status: 'Obsoleted' },
    { id: 'H2', date: '10-JAN-2022', action: 'Revise', darNo: 'DAR-22-010', rev: '05', requester: 'EN Sup', changedPages: 'ส่วนท้ายฟอร์ม', details: 'เพิ่มช่องลงนามสำหรับผู้จัดการฝ่าย', status: 'Published' },
    { id: 'H3', date: '15-JUN-2020', action: 'New', darNo: 'DAR-20-045', rev: '00', requester: 'EN Team', changedPages: 'ทั้งฉบับ', details: 'จัดทำแบบฟอร์มประวัติการซ่อมบำรุง', status: 'Published' },
  ]
};

// --- Helper Components ---

const UserGuideDrawer = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => (
  <>
    <div className={`fixed inset-0 bg-[#111827]/40 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose}></div>
    <div className={`fixed top-0 right-0 h-full w-full max-w-[450px] bg-white shadow-[-10px_0_30px_rgba(0,0,0,0.2)] z-[70] transform transition-transform duration-300 ease-in-out flex flex-col border-l border-white/20 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      
      {/* Header - Matching DAR Pending Style */}
      <div className="flex justify-between items-center p-6 border-b border-[#2C3F70]/20 bg-[#1F2937] text-white shrink-0 shadow-md z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/10 rounded-lg"><HelpCircle size={20} className="text-[#F2B03F]"/></div>
          <div>
            <h3 className="font-black uppercase tracking-widest font-mono text-[13px]">Document History Guide</h3>
            <p className="text-[10px] text-gray-400 font-mono tracking-wider mt-0.5">คู่มือการตรวจสอบประวัติเอกสาร</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"><X size={20}/></button>
      </div>
      
      {/* Body Content */}
      <div className="p-6 overflow-y-auto flex-1 custom-scrollbar text-[#53728A] leading-relaxed space-y-6 text-[12px] bg-[#F8F9FA]">
        
        {/* System Overview */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <h4 className="text-[11px] font-black text-[#2C3F70] mb-2 uppercase tracking-widest flex items-center gap-2 font-mono">
            <Target size={16} className="text-[#A5231C]"/> Document Lifecycle
          </h4>
          <p className="text-[#53728A] leading-relaxed">หน้านี้ใช้สำหรับตรวจสอบ <strong className="text-[#1F2937]">ประวัติความเป็นมาและวิวัฒนาการ</strong> ของเอกสารแต่ละฉบับ ตั้งแต่การขึ้นทะเบียนครั้งแรก การขอแก้ไข ไปจนถึงการยกเลิกใช้งาน (Obsolete) เพื่อการสอบกลับที่สมบูรณ์</p>
        </div>

        {/* Action Types Section */}
        <div className="space-y-3">
          <h4 className="text-[11px] font-black text-[#7691AD] uppercase tracking-widest font-mono pl-1">Action Types (ประเภทกิจกรรม)</h4>
          
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex gap-4 items-start hover:border-[#B2CADE] transition-colors">
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg shrink-0"><FilePlus size={18}/></div>
            <div>
              <h5 className="font-black text-[#1F2937] text-[12px] mb-1 font-mono uppercase">1. New Registration</h5>
              <p className="text-[11px]">การขึ้นทะเบียนเอกสารครั้งแรกในระบบ (Revision 00)</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex gap-4 items-start hover:border-[#B2CADE] transition-colors">
            <div className="p-2 bg-[#2C3F70]/10 text-[#2C3F70] rounded-lg shrink-0"><FileEdit size={18}/></div>
            <div>
              <h5 className="font-black text-[#1F2937] text-[12px] mb-1 font-mono uppercase">2. Revision Change</h5>
              <p className="text-[11px]">ประวัติการขอแก้ไขเนื้อหา โดยจะแสดงรายละเอียดจุดที่แก้ไขและเลข DAR ที่อ้างอิง</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex gap-4 items-start hover:border-[#B2CADE] transition-colors">
            <div className="p-2 bg-amber-100 text-amber-600 rounded-lg shrink-0"><Copy size={18}/></div>
            <div>
              <h5 className="font-black text-[#1F2937] text-[12px] mb-1 font-mono uppercase">3. Copy Distribution</h5>
              <p className="text-[11px]">บันทึกการขอสำเนาควบคุม (Controlled Copy) เพื่อแจกจ่ายไปยังหน่วยงานต่างๆ</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex gap-4 items-start hover:border-[#B2CADE] transition-colors">
            <div className="p-2 bg-red-100 text-red-600 rounded-lg shrink-0"><Trash2 size={18}/></div>
            <div>
              <h5 className="font-black text-[#1F2937] text-[12px] mb-1 font-mono uppercase">4. Obsolete / Cancel</h5>
              <p className="text-[11px]">ประวัติการยกเลิกใช้เอกสาร พร้อมระบุเหตุผลในการเลิกใช้</p>
            </div>
          </div>
        </div>

        {/* Traceability Banner */}
        <div className="bg-[#2C3F70] text-white p-5 rounded-2xl shadow-md relative overflow-hidden">
          <div className="absolute -right-4 -top-4 opacity-10"><History size={100}/></div>
          <h4 className="text-[11px] font-black text-white mb-3 uppercase tracking-widest flex items-center gap-2 font-mono relative z-10">
            <Activity size={16} className="text-[#F2B03F]"/> Traceability Power
          </h4>
          <ul className="space-y-3 text-[11px] relative z-10 list-disc pl-4 font-mono">
            <li className="pl-1">ค้นหาได้รวดเร็วทั้งจาก <b>รหัสเอกสาร</b> หรือ <b>ชื่อเรื่อง</b></li>
            <li className="pl-1">Timeline เรียงลำดับจากปัจจุบันไปหาอดีต</li>
            <li className="pl-1">แสดงสถานะสุดท้ายของแต่ละกิจกรรม (Published, Distributed, Obsoleted)</li>
          </ul>
        </div>

      </div>

      {/* Footer */}
      <div className="p-6 bg-white border-t border-gray-200 flex justify-end shrink-0 z-10">
        <button onClick={onClose} className="px-8 py-3 bg-[#1F2937] text-white font-black rounded-xl uppercase font-mono text-[11px] hover:bg-[#A5231C] shadow-md hover:shadow-lg transition-all w-full sm:w-auto">เข้าใจแล้ว (Got it)</button>
      </div>
    </div>
  </>
);

const GuideTrigger = ({ onClick }: { onClick: () => void }) => (
  <button 
    onClick={onClick} 
    className="fixed right-0 top-32 bg-[#2C3F70] text-white py-4 px-2 rounded-l-xl shadow-[-4px_0_15px_rgba(0,0,0,0.15)] hover:bg-[#A5231C] transition-all z-50 flex flex-col items-center gap-3 group border border-r-0 border-white/20 no-print"
  >
    <HelpCircle size={18} className="shrink-0 group-hover:scale-110 transition-transform" />
    <span className="font-extrabold tracking-[0.2em] [writing-mode:vertical-rl] rotate-180 whitespace-nowrap uppercase font-mono text-xs">
      USER GUIDE
    </span>
  </button>
);

const ActionBadge = ({ action }: { action: string }) => {
  const configs: Record<string, any> = {
    'New': { icon: FilePlus, bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200' },
    'Revise': { icon: FileEdit, bg: 'bg-[#2C3F70]/10', text: 'text-[#2C3F70]', border: 'border-[#2C3F70]/20' },
    'Copy': { icon: Copy, bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' },
    'Obsolete': { icon: Trash2, bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' },
  };
  
  const conf = configs[action] || configs['New'];
  const Icon = conf.icon;

  return (
    <div className={`px-3 py-1.5 rounded-md border flex items-center gap-1.5 w-max font-black uppercase tracking-widest text-[9px] font-mono shadow-sm ${conf.bg} ${conf.text} ${conf.border}`}>
      <Icon size={12} strokeWidth={2.5}/> {action}
    </div>
  );
};

// --- Main App Component ---

export default function DocHistory() {
  const [inputValue, setInputValue] = useState('QP-PD-01 - การวางแผนและควบคุมการผลิต (Production Planning)');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState<string | null>('QP-PD-01');
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Click Outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  // Filter docs based on input
  const filteredDocs = useMemo(() => {
    if (!inputValue) return MOCK_MASTER_LIST;
    const lower = inputValue.toLowerCase();
    return MOCK_MASTER_LIST.filter(d => 
      d.id.toLowerCase().includes(lower) || 
      d.title.toLowerCase().includes(lower)
    );
  }, [inputValue]);

  const handleSelectDoc = (doc: any) => {
    setSelectedDocId(doc.id);
    setInputValue(`${doc.id} - ${doc.title}`);
    setIsDropdownOpen(false);
  };

  const clearSelection = () => {
    setSelectedDocId(null);
    setInputValue('');
    setIsDropdownOpen(true);
  };

  const selectedDoc = useMemo(() => {
    return MOCK_MASTER_LIST.find(d => d.id === selectedDocId);
  }, [selectedDocId]);

  const historyData = useMemo(() => {
    return selectedDocId ? (MOCK_HISTORY[selectedDocId] || []) : [];
  }, [selectedDocId]);

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: globalStyles}} />
      <div className="flex-1 p-0 bg-transparent flex flex-col relative w-full overflow-hidden">
        
        <GuideTrigger onClick={() => setIsGuideOpen(true)} />
        <UserGuideDrawer isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />

        <div className="w-full mx-auto px-4 sm:px-8 py-8 flex flex-col h-full min-w-0">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8 shrink-0 animate-fade">
            <div className="flex items-center gap-5 shrink-0">
              <div className="relative flex items-center justify-center group cursor-default shrink-0">
                 <div className="absolute inset-0 bg-[#b7a159] blur-[15px] opacity-30 rounded-full group-hover:opacity-70 transition-all duration-700 animate-pulse-subtle"></div>
                 <div className="relative z-10 p-1.5 border border-[#b7a159]/50 rounded-xl bg-white/70 backdrop-blur-sm shadow-sm overflow-hidden">
                     <History size={28} strokeWidth={2.5} className="text-[#b58c4f]" />
                 </div>
              </div>
              <div className="flex flex-col justify-center">
                <h1 className="text-[24px] font-black tracking-tighter flex gap-2.5 uppercase font-mono leading-none text-[#212c46]">
                  DOCUMENT <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b58c4f] to-[#8e9141]">HISTORY</span>
                </h1>
                <p className="text-[#b58c4f] font-bold uppercase tracking-[0.2em] mt-0.5 text-[11px] font-mono opacity-90 leading-none">ประวัติเอกสาร</p>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="w-full mx-auto mb-5 z-50 animate-fade" ref={dropdownRef}>
             <div className="relative flex items-center">
                <div className="absolute left-4 text-[#2C3F70] bg-white rounded-md p-1 shadow-sm border border-gray-100">
                  <Search size={20} strokeWidth={2.5} />
                </div>
                <input 
                  type="text"
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    setIsDropdownOpen(true);
                    if(e.target.value === '') setSelectedDocId(null);
                  }}
                  onFocus={() => setIsDropdownOpen(true)}
                  placeholder="พิมพ์ค้นหารหัสเอกสาร หรือชื่อเอกสารที่ต้องการดูประวัติ..."
                  className="w-full bg-white border-2 border-white shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-xl pl-14 pr-12 py-3.5 text-[14px] font-bold text-[#1F2937] focus:border-[#2C3F70] focus:shadow-xl outline-none transition-all font-mono"
                />
                {inputValue && (
                   <button 
                     onClick={clearSelection} 
                     className="absolute right-4 text-[#7691AD] bg-gray-100 p-1.5 rounded-full hover:bg-red-100 hover:text-red-500 transition-colors"
                   >
                     <X size={16} strokeWidth={3}/>
                   </button>
                )}
             </div>
             
             {isDropdownOpen && (
                <div className="absolute top-[110%] left-0 right-0 bg-white rounded-xl shadow-2xl border border-[#D1D9E0]/50 max-h-[350px] overflow-y-auto custom-scrollbar flex flex-col p-2 z-50 animate-slide-down origin-top">
                   {filteredDocs.length > 0 ? (
                     filteredDocs.map((doc, i) => (
                      <button 
                         key={doc.id}
                         onClick={() => handleSelectDoc(doc)}
                         className={`text-left flex items-center gap-4 p-3 rounded-lg transition-all border-b border-gray-50 last:border-0 hover:bg-[#F8F9FA] ${selectedDocId === doc.id ? 'bg-[#2C3F70]/5 border-[#2C3F70]/20' : ''}`}
                      >
                         <div className="w-12 h-12 rounded-lg bg-white border border-[#E5E8E1] text-[#2C3F70] shadow-sm flex items-center justify-center shrink-0">
                            <FileText size={20} />
                         </div>
                         <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                               <span className="font-black text-[#A5231C] font-mono text-[14px]">{doc.id}</span>
                               <span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 text-[10px] font-black uppercase tracking-widest font-mono border border-gray-200 shadow-sm">REV. {doc.rev}</span>
                            </div>
                            <p className="font-bold text-[#1F2937] text-[13px] truncate">{doc.title}</p>
                         </div>
                         <div className="text-[#7691AD] opacity-0 group-hover:opacity-100 transition-opacity pr-2">
                           <ChevronRight size={20} />
                         </div>
                      </button>
                     ))
                   ) : (
                      <div className="p-8 flex flex-col items-center justify-center text-center">
                         <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-3 text-gray-400">
                            <Search size={20} />
                         </div>
                         <p className="text-[#7691AD] font-bold font-mono text-[12px] uppercase tracking-widest">ไม่พบเอกสารที่ค้นหา</p>
                      </div>
                   )}
                </div>
             )}
          </div>

          {/* Content Area */}
          <div className="flex-1 w-full flex flex-col pb-6 mx-auto">
            {selectedDoc ? (
              <div className="flex flex-col h-full animate-fade">
                
                {/* Top Profile Card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-white shrink-0 mb-5 relative overflow-hidden">
                   <FileStack size={100} className="absolute -right-4 -bottom-4 opacity-[0.03] text-[#2C3F70] pointer-events-none" />
                   
                   <div className="flex justify-between items-start mb-5 relative z-10 flex-col sm:flex-row gap-4">
                     <div>
                         <div className="flex items-center gap-2 mb-2">
                            <span className="bg-[#A5231C] text-white px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest font-mono shadow-sm">{selectedDoc.type}</span>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest font-mono border shadow-sm ${selectedDoc.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                              {selectedDoc.status}
                            </span>
                         </div>
                         <h2 className="text-2xl font-black text-[#1F2937] leading-tight max-w-4xl">{selectedDoc.title}</h2>
                     </div>
                     <div className="text-right shrink-0 bg-[#F8F9FA] px-5 py-3 rounded-xl border border-[#E5E8E1] shadow-inner sm:self-start">
                         <p className="text-[9px] font-black text-[#7691AD] uppercase tracking-widest mb-1 font-mono">Current Revision</p>
                         <p className="text-3xl font-black text-[#2C3F70] font-mono leading-none">{selectedDoc.rev}</p>
                     </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10 border-t border-[#E5E8E1] pt-4">
                      <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                         <div className="w-10 h-10 rounded-lg bg-[#2C3F70]/10 flex items-center justify-center text-[#2C3F70] shadow-sm"><FileText size={18}/></div>
                         <div><p className="text-[8px] font-black text-[#7691AD] uppercase tracking-widest font-mono mb-0.5">Document ID</p><p className="font-bold text-[#1F2937] text-[13px] font-mono">{selectedDoc.id}</p></div>
                      </div>
                      <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                         <div className="w-10 h-10 rounded-lg bg-[#A5231C]/10 flex items-center justify-center text-[#A5231C] shadow-sm"><ShieldCheck size={18}/></div>
                         <div><p className="text-[8px] font-black text-[#7691AD] uppercase tracking-widest font-mono mb-0.5">Owner Dept.</p><p className="font-bold text-[#1F2937] text-[13px] uppercase">{selectedDoc.dept}</p></div>
                      </div>
                      <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                         <div className="w-10 h-10 rounded-lg bg-[#F2B03F]/10 flex items-center justify-center text-[#d97706] shadow-sm"><User size={18}/></div>
                         <div><p className="text-[8px] font-black text-[#7691AD] uppercase tracking-widest font-mono mb-0.5">Responsible</p><p className="font-bold text-[#1F2937] text-[13px]">{selectedDoc.owner}</p></div>
                      </div>
                   </div>
                </div>

                {/* Timeline Area */}
                <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-white flex-1 overflow-hidden flex flex-col">
                   <h3 className="text-sm font-black text-[#2C3F70] uppercase tracking-[0.15em] flex items-center gap-2 font-mono mb-5 shrink-0 border-b border-[#E5E8E1] pb-3">
                     <History size={18} className="text-[#A5231C]"/> Revision History & Traceability
                   </h3>
                   
                   <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 relative w-full">
                      <div className="absolute left-[23px] top-4 bottom-4 w-[2px] bg-[#B2CADE]/50 z-0"></div>

                      {historyData.length > 0 ? (
                         <div className="space-y-5 relative z-10 pb-2">
                           {historyData.map((record, index) => (
                             <div key={record.id} className="flex gap-4 sm:gap-5 group animate-fade w-full" style={{ animationDelay: `${index * 0.1}s` }}>
                                <div className="flex flex-col items-center shrink-0 w-12 pt-1.5 relative">
                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-[3px] border-white shadow-sm z-10 transition-transform group-hover:scale-110 ${index === 0 ? 'bg-[#A5231C] text-white' : 'bg-[#E8EBED] text-[#7691AD]'}`}>
                                    <GitCommit size={16} />
                                  </div>
                                </div>
                                
                                <div className="flex-1 bg-white p-4 sm:p-5 rounded-2xl border border-[#D1D9E0]/50 shadow-sm group-hover:shadow-md transition-all group-hover:border-[#B2CADE]/80 min-w-0 overflow-hidden">
                                   <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 border-b border-gray-50 pb-4 w-full">
                                      <div className="flex flex-wrap items-center gap-3 sm:gap-4 shrink-0">
                                         <div className="flex items-center gap-2 sm:gap-3">
                                            <ActionBadge action={record.action} />
                                            <span className="font-black text-[#1F2937] font-mono text-[14px] bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">REV. {record.rev}</span>
                                         </div>
                                         <div className="hidden sm:block w-px h-5 bg-[#D1D9E0]"></div>
                                         <div className="flex items-center gap-2 w-full sm:w-auto">
                                            <span className="text-[9px] font-black text-[#7691AD] uppercase tracking-widest font-mono">Ref DAR:</span>
                                            <span className="font-bold text-[#A5231C] font-mono text-[11px] hover:underline cursor-pointer">{record.darNo}</span>
                                         </div>
                                      </div>

                                      <div className="flex flex-wrap items-center gap-3 shrink-0">
                                         <div className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest font-mono border shadow-sm flex items-center gap-1.5 ${record.status === 'Published' || record.status === 'Distributed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                                            <CheckCircle2 size={14}/> {record.status}
                                         </div>
                                         <div className="flex items-center gap-2 bg-[#F8F9FA] px-3 py-1.5 rounded-xl border border-[#E5E8E1] shadow-sm">
                                            <CalendarDays size={14} className="text-[#7691AD]"/>
                                            <span className="font-bold text-[#2C3F70] font-mono text-[11px] uppercase tracking-wider">{record.date}</span>
                                         </div>
                                      </div>
                                   </div>
                                   
                                   <div className="bg-[#F8F9FA] p-3 sm:p-4 rounded-xl border border-[#E5E8E1]/60 overflow-hidden break-words">
                                     {record.changedPages && (
                                       <div className="mb-3 pb-3 border-b border-[#E5E8E1] flex flex-col gap-1.5">
                                          <span className="text-[9px] font-black text-[#A5231C] uppercase tracking-widest font-mono flex items-center gap-1">
                                            <FileSearch size={12}/> จุดที่แก้ไข (Changed Sections):
                                          </span>
                                          <span className="text-[12px] font-extrabold text-[#1F2937] ml-2 sm:ml-4 block break-words whitespace-pre-wrap">{record.changedPages}</span>
                                       </div>
                                     )}
                                     <div className="flex flex-col gap-1.5">
                                        <span className="font-black text-[#53728A] text-[9px] uppercase tracking-widest font-mono">
                                          {record.action === 'Revise' ? 'รายละเอียดการแก้ไข (Details):' : record.action === 'Obsolete' ? 'เหตุผลการยกเลิก (Reason):' : 'รายละเอียด (Description):'}
                                        </span>
                                        <p className="text-[12px] text-[#1F2937] leading-relaxed font-medium ml-1 break-words whitespace-pre-wrap">
                                          {record.details}
                                        </p>
                                     </div>
                                   </div>
                                </div>
                             </div>
                           ))}
                         </div>
                      ) : (
                         <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
                           <History size={32} className="text-[#7691AD]" />
                           <p className="text-[#53728A] font-bold font-mono text-[11px] uppercase tracking-widest">No history recorded for this document yet.</p>
                         </div>
                      )}
                   </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 bg-white/50 backdrop-blur-md rounded-2xl border-2 border-white border-dashed flex flex-col items-center justify-center text-center animate-fade shadow-sm mt-2">
                <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mb-5 shadow-sm border border-gray-100">
                  <Search size={32} className="text-[#B2CADE] animate-pulse" />
                </div>
                <h2 className="text-xl font-black text-[#2C3F70] uppercase tracking-widest font-mono mb-2">Select a Document</h2>
                <p className="text-[#7691AD] font-bold text-xs max-w-sm leading-relaxed px-6">
                  Please use the search bar above to find and select a document. You will be able to view its complete lifecycle, current status, and revision history.
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}
