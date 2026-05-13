import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import * as Icons from 'lucide-react';

const THAI_MONTHS_FULL = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];

export const SaleDatePicker = ({ selectedMonth, selectedYear, onMonthYearChange }: any) => {
    const [showModal, setShowModal] = useState(false);
    return (
        <div className="bg-white border border-[#daecf3] rounded-[16px] flex items-center shadow-sm h-[46px] w-[220px] font-mono">
            <div className="px-3 bg-[#f8f9fa] h-full flex items-center justify-center border-r border-[#daecf3] text-[#af7a2b]"><Icons.Calendar size={18} /></div>
            <button onClick={() => setShowModal(true)} className="flex-1 px-4 h-full flex items-center justify-between font-black text-[13px] text-[#022d41] hover:bg-[#f8f9fa] transition-colors rounded-r-[16px]">
                <span>{THAI_MONTHS_FULL[selectedMonth]} {selectedYear}</span>
                <Icons.CalendarDays size={16} className="text-[#a3c2d2]"/>
            </button>
            {showModal && createPortal(
                <div className="fixed inset-0 z-[500] bg-[#022d41]/40 backdrop-blur-sm flex items-center justify-center" onClick={() => setShowModal(false)}>
                    <div className="bg-white rounded-[24px] p-6 shadow-2xl w-[320px] border border-[#daecf3]" onClick={e => e.stopPropagation()}>
                        <div className="grid grid-cols-3 gap-2">
                            {THAI_MONTHS_FULL.map((m, idx) => (
                                <button key={idx} onClick={() => { onMonthYearChange(idx, selectedYear); setShowModal(false); }} className={`px-2 py-2 rounded-xl border text-[11px] font-black ${selectedMonth === idx ? 'bg-[#022d41] text-white' : 'hover:bg-slate-50'}`}>{m}</button>
                            ))}
                        </div>
                    </div>
                </div>, document.body
            )}
        </div>
    );
};
