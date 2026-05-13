import React, { useState, useEffect, useMemo } from 'react';
import * as Icons from 'lucide-react';
import { SaleDatePicker } from './components/SaleDatePicker';
import { UserGuidePanel } from '../../components/shared/UserGuidePanel';
import KpiCard from '../../components/shared/KpiCard';
import { SaleKanbanBoard } from './components/SaleKanbanBoard';
import { SaleOrderTable } from './components/SaleOrderTable';
import { api, cache } from '../../services/api';
import { DraggableModal } from '../../components/shared/DraggableModal';
import { CsvUpload } from '../../components/shared/CsvUpload';
const Swal = typeof window !== 'undefined' ? (window as any).Swal || null : null;

const ORDER_STATUSES = ['Pending', 'Production', 'Shipped', 'Completed', 'Cancelled', 'Draft'];
const CUSTOMERS_MOCK = ['Betagro Group', 'CJ Supermarket', 'MAKRO Public Co.', '7-Eleven Thailand', 'Aro Store'];
const ORDER_TYPES = ['Standard', 'Express', 'Pre-order', 'Subscription'];

export default function SaleOrder() {
    const [items, setItems] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeMainTab, setActiveMainTab] = useState('kanban');
    const [activeCustomer, setActiveCustomer] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [showGuide, setShowGuide] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showNewOrderModal, setShowNewOrderModal] = useState(false);
    
    useEffect(() => {
        const fetchOrders = async () => {
            setIsLoading(true);
            try {
                const cachedData = cache.get('sales_orders');
                if (cachedData) {
                    setItems(cachedData);
                } else {
                    const res = await api.post('read', 'SaleOrders');
                    if (res.status === 'success' && Array.isArray(res.data) && res.data.length > 0) {
                        setItems(res.data);
                        cache.set('sales_orders', res.data, 5);
                    } else {
                        throw new Error("No data");
                    }
                }
            } catch (err) {
                console.log("Using fallback mock data for Sale Orders");
                const mock = [];
                for(let i=1; i<=15; i++) {
                    mock.push({
                        id: `order-${i}`, soNumber: `SO-2603-${i.toString().padStart(3,'0')}`, poNumber: `PO-${1000+i}`,
                        customer: CUSTOMERS_MOCK[i%CUSTOMERS_MOCK.length], orderType: ORDER_TYPES[i%ORDER_TYPES.length],
                        orderDate: `0${i%9+1}/03/2026`, status: ORDER_STATUSES[i%ORDER_STATUSES.length],
                        financialSummary: { grandTotal: 5000 + i*1000 }
                    });
                }
                setItems(mock);
            } finally {
                setIsLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const filteredData = items.filter(o => 
        (activeCustomer === 'All' || o.customer === activeCustomer) && 
        (o.soNumber.toLowerCase().includes(searchTerm.toLowerCase()) || o.customer.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const paginatedData = filteredData.slice((currentPage-1)*itemsPerPage, currentPage*itemsPerPage);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;

    return (
        <div className="flex flex-1 w-full font-sans flex-col pb-0 animate-fadeIn bg-transparent">
            <UserGuidePanel isOpen={showGuide} onClose={() => setShowGuide(false)} title="Order Management" desc="ระบบจัดการคำสั่งซื้อ (Sales Order) และสถานะการจัดส่ง" />
            
            <button onClick={() => setShowGuide(true)} className="fixed right-0 top-[220px] -translate-y-1/2 bg-[#f8f9fa] border border-[#daecf3] border-r-0 text-[#022d41] py-8 px-1.5 rounded-l-xl shadow-md hover:bg-[#D2042D] hover:text-white hover:border-[#D2042D] transition-all duration-500 z-[100] flex flex-col items-center gap-4 group">
                <Icons.HelpCircle size={18} className="shrink-0 group-hover:rotate-12 transition-transform text-[#a3c2d2] group-hover:text-white" />
                <span className="font-black tracking-[0.3em] [writing-mode:vertical-rl] rotate-180 whitespace-nowrap uppercase text-[11px]">USER GUIDE</span>
            </button>

            {/* HEADER EXTRACTED FROM CALENDAR AND USER PERMS */}
            <div className="px-8 pt-3 pb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 z-20 shrink-0">
                <div className="flex items-center gap-5">
                    <div className="relative flex items-center justify-center group shrink-0 cursor-default">
                        <div className="absolute inset-0 bg-[#f91a47] blur-[15px] opacity-20 rounded-full group-hover:opacity-60 transition-all duration-700"></div>
                        <div className="relative z-10 p-1.5 border border-[#f91a47]/40 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm">
                            <Icons.ShoppingCart size={28} className="text-[#f91a47]" strokeWidth={2.5} />
                        </div>
                    </div>
                    <div>
                        <h3 className="font-black text-[#022d41] text-[24px] uppercase tracking-tighter leading-none">
                            SALE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f91a47] to-[#af7a2b]">ORDERS</span> HUB
                        </h3>
                        <p className="text-[11px] font-bold text-[#af7a2b] uppercase tracking-[0.2em] mt-1 opacity-80 leading-none">
                            Sales Order Management System
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <SaleDatePicker selectedMonth={2} selectedYear={2026} onMonthYearChange={()=>{}}/>
                    <div className="flex bg-white/50 border border-white/60 p-1.5 rounded-xl shadow-inner">
                        <button onClick={() => setActiveMainTab('kanban')} className={`px-5 py-2 text-[11px] font-black uppercase tracking-widest rounded-lg transition-all flex items-center gap-2 ${activeMainTab === 'kanban' ? 'bg-[#022d41] text-white shadow-md' : 'text-[#a3c2d2] hover:text-[#f91a47]'}`}>
                            <Icons.Kanban size={14} /> Kanban
                        </button>
                        <button onClick={() => setActiveMainTab('list')} className={`px-5 py-2 text-[11px] font-black uppercase tracking-widest rounded-lg transition-all flex items-center gap-2 ${activeMainTab === 'list' ? 'bg-[#022d41] text-white shadow-md' : 'text-[#a3c2d2] hover:text-[#f91a47]'}`}>
                            <Icons.List size={14} /> Table
                        </button>
                    </div>
                </div>
            </div>

            <div className="px-8 mt-2 pb-6">
                <div className="max-w-[1500px] w-full mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-5 shrink-0">
                    <KpiCard label="Total Orders" value={filteredData.length} icon={Icons.ClipboardList} color="#a3c2d2" />
                    <KpiCard label="Active" value={10} icon={Icons.Truck} color="#ffa64a" />
                    <KpiCard label="Revenue (THB)" value={(125000).toLocaleString()} icon={Icons.CheckCircle} color="#398797" />
                    <KpiCard label="Pipeline (THB)" value={(80000).toLocaleString()} icon={Icons.PieChart} color="#1aa6b7" />
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-[#daecf3] flex flex-col flex-1 overflow-hidden">
                    <div className="px-8 py-4 bg-[#f8f9fa] border-b border-[#daecf3] flex items-center justify-between gap-4 flex-wrap shrink-0">
                        <div className="flex items-center gap-3">
                            <select value={activeCustomer} onChange={e=>setActiveCustomer(e.target.value)} className="h-10 border border-[#daecf3] rounded-xl px-4 text-[12px] font-bold text-[#022d41] bg-white outline-none">
                                <option value="All">All Customers</option>
                                {CUSTOMERS_MOCK.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            <div className="relative">
                                <Icons.Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a3c2d2]"/>
                                <input value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} placeholder="Search SO / PO..." className="pl-9 pr-4 h-10 border border-[#daecf3] rounded-xl text-[12px] font-bold outline-none focus:border-[#af7a2b] shadow-sm"/>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => setShowUploadModal(true)} className="bg-white border border-[#daecf3] text-[#022d41] hover:border-[#f91a47] hover:text-[#f91a47] px-5 h-10 rounded-xl font-black text-[11px] uppercase tracking-widest flex items-center gap-2">
                                <Icons.Upload size={14}/> Upload
                            </button>
                            <button onClick={() => setShowNewOrderModal(true)} className="bg-[#022d41] text-[#af7a2b] px-6 h-10 rounded-xl font-black text-[11px] uppercase tracking-widest flex items-center gap-2 shadow-sm hover:bg-[#1f2a44]">
                                <Icons.Plus size={14}/> New Order
                            </button>
                        </div>
                    </div>

                    {activeMainTab === 'kanban' ? (
                        <SaleKanbanBoard filteredData={filteredData} />
                    ) : (
                        <SaleOrderTable paginatedData={paginatedData} />
                    )}
                    
                    {activeMainTab === 'list' && (
                        <div className="px-8 py-3 bg-[#f8f9fa] border-t-[1.5px] border-slate-300 flex justify-between items-center shrink-0">
                            <div className="flex items-center gap-4 text-[11px] font-black text-[#a3c2d2] uppercase">
                                <span>Display Rows:</span>
                                <select value={itemsPerPage} onChange={e=>{setItemsPerPage(Number(e.target.value)); setCurrentPage(1);}} className="bg-white border border-[#daecf3] rounded-lg px-2 py-1 outline-none text-[#022d41]">
                                    {[5,10,20].map(v=><option key={v} value={v}>{v}</option>)}
                                </select>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={()=>setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1} className="w-8 h-8 flex items-center justify-center bg-white border border-[#daecf3] rounded-lg disabled:opacity-50 hover:bg-slate-50"><Icons.ChevronLeft size={16}/></button>
                                <span className="px-4 py-1.5 bg-[#022d41] text-[#af7a2b] rounded-lg text-[11px] font-black">Page {currentPage}/{totalPages}</span>
                                <button onClick={()=>setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages} className="w-8 h-8 flex items-center justify-center bg-white border border-[#daecf3] rounded-lg disabled:opacity-50 hover:bg-slate-50"><Icons.ChevronRight size={16}/></button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
          </div>
          
          <DraggableModal isOpen={showUploadModal} onClose={() => setShowUploadModal(false)} title={<span className="text-sm font-black uppercase text-[#022d41] tracking-widest">Bulk Upload</span>} width="600px">
              <div className="p-6">
                  <CsvUpload 
                      requiredHeaders={['soNumber', 'customer', 'orderDate', 'status']}
                      onUpload={(data) => {
                          if (Swal) Swal.fire('Success', 'File uploaded and parsed correctly!', 'success');
                          setShowUploadModal(false);
                      }}
                  />
              </div>
          </DraggableModal>

          <DraggableModal isOpen={showNewOrderModal} onClose={() => setShowNewOrderModal(false)} title={<span className="text-sm font-black uppercase text-[#022d41] tracking-widest">New Sale Order</span>} width="500px">
              <div className="p-6 space-y-4">
                  <div>
                      <label className="text-[11px] font-bold uppercase text-[#a3c2d2] tracking-widest block mb-2">Customer</label>
                      <select className="w-full h-11 border border-[#daecf3] rounded-xl px-4 text-[13px] font-bold text-[#022d41] uppercase outline-none focus:border-[#022d41]">
                          {CUSTOMERS_MOCK.map((c, i) => <option key={i}>{c}</option>)}
                      </select>
                  </div>
                  <div>
                      <label className="text-[11px] font-bold uppercase text-[#a3c2d2] tracking-widest block mb-2">Order Type</label>
                      <select className="w-full h-11 border border-[#daecf3] rounded-xl px-4 text-[13px] font-bold text-[#022d41] uppercase outline-none focus:border-[#022d41]">
                          {ORDER_TYPES.map((c, i) => <option key={i}>{c}</option>)}
                      </select>
                  </div>
                  <button onClick={() => {
                      if (Swal) Swal.fire('Created', 'New order created successfully!', 'success');
                      setShowNewOrderModal(false);
                  }} className="w-full h-12 mt-4 bg-[#022d41] text-[#af7a2b] font-black uppercase tracking-widest rounded-xl hover:bg-[#1f2a44] transition-all">Submit Order</button>
              </div>
          </DraggableModal>

        </div>
    );
}
