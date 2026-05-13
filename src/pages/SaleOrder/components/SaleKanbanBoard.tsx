import React from 'react';

export const SaleKanbanBoard = ({ filteredData }: { filteredData: any[] }) => {
    return (
        <div className="flex-1 overflow-x-auto p-6 flex gap-4 kanban-scroll bg-slate-50/50 min-h-[400px]">
            {['Pending', 'Production', 'Shipped', 'Completed', 'Cancelled'].map(status => (
                <div key={status} className="w-[300px] flex flex-col bg-slate-50 border border-[#daecf3] rounded-xl h-full shadow-sm shrink-0">
                    <div className="p-3 border-b border-[#daecf3] bg-white rounded-t-xl font-black text-[12px] uppercase">
                        {status}
                    </div>
                    <div className="p-3 space-y-3 overflow-y-auto">
                        {filteredData.filter(d=>d.status===status).map(item => (
                            <div key={item.id} className="bg-white p-4 border border-[#daecf3] rounded-lg shadow-sm hover:border-[#af7a2b] cursor-pointer transition-colors">
                                <div className="text-[11px] font-bold text-[#a3c2d2] mb-1">{item.soNumber}</div>
                                <div className="text-[12px] font-black text-[#022d41] uppercase truncate">{item.customer}</div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};
