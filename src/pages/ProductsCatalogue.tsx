import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import * as Icons from 'lucide-react';
import { UserGuidePanel } from '../components/shared/UserGuidePanel';
import KpiCard from '../components/shared/KpiCard';
import { api, cache } from '../services/api';

const CATEGORIES = [
  { id: 'all', titleTH: 'ทั้งหมด', titleEN: 'ALL PRODUCTS', icon: 'database' },
  { id: 'sausage', titleTH: 'ไส้กรอก', titleEN: 'SAUSAGE', icon: 'server' },
  { id: 'meatball', titleTH: 'ลูกชิ้น', titleEN: 'MEATBALL', icon: 'circle' }
];

const INITIAL_PRODUCTS = [
  { id: 'PRD-1001', catId: 'sausage', name: 'ไส้กรอกไก่จัมโบ้ ARO 1kg', price: 110, stock: 450, desc: 'ไส้กรอกไก่รมควันหนังกรอบ', img: 'https://images.unsplash.com/photo-1541614101331-1a5a3a194e92?q=80&w=800&auto=format&fit=crop' },
  { id: 'PRD-2001', catId: 'meatball', name: 'ลูกชิ้นหมู CJ 500g', price: 150, stock: 150, desc: 'ลูกชิ้นหมูแท้ 100%', img: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?q=80&w=800&auto=format&fit=crop' },
];

export default function ProductsCatalogue() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('catalog');
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCatalog = async () => {
      setIsLoading(true);
      try {
        const cachedData = cache.get('products_catalogue');
        if (cachedData) {
          setProducts(cachedData);
        } else {
          const res = await api.post('read', 'ProductsCatalogue');
          if (res.status === 'success' && Array.isArray(res.data) && res.data.length > 0) {
            setProducts(res.data);
            cache.set('products_catalogue', res.data, 5);
          } else {
            throw new Error("No data");
          }
        }
      } catch (err) {
        console.log("Using fallback mock data for Products Catalog:", err);
        setProducts(INITIAL_PRODUCTS);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCatalog();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchCat = activeCategory === 'all' ? true : p.catId === activeCategory;
      const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [activeCategory, searchTerm]);

    return (
    <div className="flex flex-1 w-full font-sans flex-col pb-0 animate-fadeIn bg-transparent">
        <button onClick={() => setIsGuideOpen(true)} className="fixed right-0 top-[220px] -translate-y-1/2 bg-[#f8f9fa] border border-[#daecf3] border-r-0 text-[#022d41] py-8 px-1.5 rounded-l-xl shadow-md hover:bg-[#D2042D] hover:text-white hover:border-[#D2042D] transition-all duration-500 z-[100] flex flex-col items-center gap-4 group">
            <Icons.HelpCircle size={18} className="shrink-0 group-hover:rotate-12 transition-transform text-[#a3c2d2] group-hover:text-white" />
            <span className="font-black tracking-[0.3em] [writing-mode:vertical-rl] rotate-180 whitespace-nowrap uppercase text-[11px]">USER GUIDE</span>
        </button>

        <UserGuidePanel isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} title="Products Catalogue" desc="ระบบจัดการแคตตาล็อกสินค้า" />

        {/* Header Bar synced with CALENDAR style */}
        <div className="px-8 pt-3 pb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 z-20 shrink-0">
            <div className="flex items-center gap-5">
                <div className="relative flex items-center justify-center group shrink-0 cursor-default">
                    <div className="absolute inset-0 bg-[#D4AF37] blur-[15px] opacity-20 rounded-full group-hover:opacity-60 transition-all duration-700"></div>
                    <div className="relative z-10 p-1.5 border border-[#D4AF37]/40 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm">
                        <Icons.Package size={28} strokeWidth={2.5} className="text-[#D4AF37]" />
                    </div>
                </div>
                <div>
                    <h3 className="font-black text-[#022d41] text-[24px] uppercase tracking-tighter leading-none">
                        PRODUCTS <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#10B981]">CATALOGUE</span>
                    </h3>
                    <p className="text-[11px] font-bold text-[#af7a2b] uppercase tracking-[0.2em] mt-1 opacity-80 leading-none">
                        Inventory & Pricing Database
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex bg-white/50 border border-white/60 p-1.5 rounded-xl shadow-inner">
                    <button onClick={() => setViewMode('catalog')} className={`px-5 py-2 text-[11px] font-black uppercase tracking-widest rounded-lg transition-all flex items-center gap-2 ${viewMode === 'catalog' ? 'bg-[#022d41] text-white shadow-md' : 'text-[#a3c2d2] hover:text-[#f91a47]'}`}>
                        <Icons.LayoutGrid size={14} /> Catalog
                    </button>
                    <button onClick={() => setViewMode('table')} className={`px-5 py-2 text-[11px] font-black uppercase tracking-widest rounded-lg transition-all flex items-center gap-2 ${viewMode === 'table' ? 'bg-[#022d41] text-white shadow-md' : 'text-[#a3c2d2] hover:text-[#f91a47]'}`}>
                        <Icons.List size={14} /> SKU List
                    </button>
                </div>
            </div>
        </div>

        <div className="px-8 mt-2 pb-6">
            <div className="max-w-[1500px] w-full mx-auto">
                {/* KPI Cards Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-5 shrink-0">
                <KpiCard label="Total Registry" value={products.length} icon={Icons.Database} color="#5f7ab7" />
                <KpiCard label="In Stock" value={products.filter(p=>p.stock > 0).length} icon={Icons.Package} color="#10B981" />
                <KpiCard label="Total Bookings" value={15} icon={Icons.FileCheck} color="#D4AF37" />
                <KpiCard label="Catalog Traffic" value={1200} icon={Icons.Eye} color="#E63946" />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-[#daecf3] flex flex-col flex-1 overflow-hidden">
                <div className="px-8 py-4 bg-[#f8f9fa] border-b border-[#daecf3] flex items-center justify-between gap-4 flex-wrap shrink-0">
                    <div className="flex items-center gap-3">
                        <select value={activeCategory} onChange={e=>setActiveCategory(e.target.value)} className="h-10 border border-[#daecf3] rounded-xl px-4 text-[12px] font-bold text-[#022d41] bg-white outline-none focus:border-[#af7a2b]">
                            {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.titleEN}</option>)}
                        </select>
                        <div className="relative">
                            <Icons.Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a3c2d2]"/>
                            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search Catalog..." className="w-full pl-9 pr-4 h-10 border border-[#daecf3] rounded-xl text-[12px] font-bold outline-none focus:border-[#af7a2b] shadow-sm"/>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 min-h-[400px]">
                    {viewMode === 'catalog' && (
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                            {filteredProducts.map(product => (
                                <div key={product.id} className="group relative flex flex-col justify-end p-5 bg-[#022d41] rounded-3xl overflow-hidden shadow-sm hover:shadow-lg border border-[#daecf3] cursor-pointer h-[300px]">
                                    <img src={product.img} alt={product.name} className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#022d41]/95 via-[#022d41]/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    
                                    <div className="relative z-10 flex flex-col h-full justify-end">
                                        <span className="px-2.5 py-1 bg-white/20 backdrop-blur-md text-white text-[9px] font-black font-mono tracking-widest uppercase rounded-md mb-2 inline-block border border-white/20 w-fit">{product.catId}</span>
                                        <h2 className="text-lg font-black text-white leading-tight mb-2 tracking-tight drop-shadow-md line-clamp-2">{product.name}</h2>
                                        
                                        <div className="flex items-center gap-3">
                                            <span className="text-base font-mono font-black text-[#af7a2b] drop-shadow-md">฿{product.price.toLocaleString()}</span>
                                            <span className="text-[10px] font-mono font-bold text-slate-300 tracking-widest uppercase">{product.id}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {viewMode === 'table' && (
                        <table className="w-full text-left border-collapse min-w-[900px]">
                            <thead className="bg-[#022d41] text-white border-b-2 border-[#af7a2b]">
                                <tr>
                                    <th className="py-4 px-6 text-[12px] font-black uppercase tracking-widest">SKU Code</th>
                                    <th className="py-4 px-6 text-[12px] font-black uppercase tracking-widest">Product Detail</th>
                                    <th className="py-4 px-6 text-[12px] font-black uppercase tracking-widest text-right">Unit Price</th>
                                    <th className="py-4 px-6 text-[12px] font-black uppercase tracking-widest text-center">Stock</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#daecf3]">
                                {filteredProducts.map(p => (
                                    <tr key={p.id} className="hover:bg-[#f8f9fa] group">
                                        <td className="py-3 px-6"><span className="inline-block font-mono font-bold text-[#f91a47] text-[12px]">{p.id}</span></td>
                                        <td className="py-3 px-6">
                                            <div className="flex items-center gap-4">
                                                <img src={p.img} className="w-10 h-10 object-cover rounded-lg border border-slate-200" />
                                                <div className="flex flex-col">
                                                    <span className="font-black text-[#022d41] text-[12px] uppercase">{p.name}</span>
                                                    <span className="text-[10px] font-bold font-mono text-[#a3c2d2] uppercase">{p.catId}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-6 text-right"><span className="text-[12px] font-black text-[#022d41] font-mono">฿{p.price.toLocaleString()}</span></td>
                                        <td className="py-3 px-6 text-center"><span className="text-[12px] font-black text-[#1aa6b7] font-mono">{p.stock}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
            </div>
        </div>
    </div>
  );
}
