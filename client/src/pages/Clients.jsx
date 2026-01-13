import React, { useState, useEffect } from 'react';
import { Search, Plus, Phone, MoreVertical, User, Save, MapPin } from 'lucide-react';
import Modal from '../components/Modal';
import { getClients, addClient } from '../utils/api';

const Clients = () => {
    const [activeTab, setActiveTab] = useState('clients'); // clients or suppliers
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        initialBalance: ''
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await getClients(); // Fetch all to handle filtering client-side or separate
            setClients(res.data);
        } catch (e) {
            console.error("Error fetching clients", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredClients = clients.filter(c =>
        (activeTab === 'clients' ? c.type === 'client' : c.type === 'supplier')
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addClient({
                ...formData,
                type: activeTab === 'clients' ? 'client' : 'supplier'
            });
            setIsModalOpen(false);
            setFormData({ name: '', phone: '', address: '', initialBalance: '' }); // Reset
            fetchData(); // Refresh list
        } catch (e) {
            alert('حدث خطأ أثناء الحفظ');
        }
    };

    return (
        <>
            <div className="space-y-6 animate-fade-in">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight">العملاء والموردين</h1>
                        <p className="text-slate-500 mt-1 font-medium">إدارة جهات الاتصال والديون المرتبطة بهم.</p>
                    </div>
                    <button onClick={() => setIsModalOpen(true)} className="btn-primary">
                        <Plus size={20} />
                        <span>إضافة جديد</span>
                    </button>
                </div>

                <div className="glass-card p-6 min-h-[500px]">
                    <div className="flex items-center gap-4 border-b border-slate-100 pb-6 mb-6">
                        <button
                            onClick={() => setActiveTab('clients')}
                            className={`px-6 py-2.5 rounded-xl font-bold transition-all duration-300 ${activeTab === 'clients' ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/25' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                        >
                            العملاء (زبائن)
                        </button>
                        <button
                            onClick={() => setActiveTab('suppliers')}
                            className={`px-6 py-2.5 rounded-xl font-bold transition-all duration-300 ${activeTab === 'suppliers' ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/25' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                        >
                            الموردين (تجار)
                        </button>
                    </div>

                    <div className="relative mb-8">
                        <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="بحث بالاسم أو رقم الهاتف..."
                            className="w-full pl-4 pr-12 py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-100 focus:border-primary-400 outline-none transition-all font-medium"
                        />
                    </div>

                    {loading ? (
                        <div className="text-center py-20 text-slate-400">جاري التحميل...</div>
                    ) : filteredClients.length === 0 ? (
                        <div className="text-center py-20 text-slate-400">لا يوجد بيانات لعرضها</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredClients.map((client) => (
                                <div key={client.id} className="p-5 border border-slate-100 rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group bg-white/50 backdrop-blur-sm relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-secondary-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:from-primary-50 group-hover:to-primary-100 group-hover:text-primary-600 transition-all shadow-sm">
                                                <User size={26} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-800 text-lg">{client.name}</h3>
                                                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1.5 font-bold">
                                                    <Phone size={14} className="text-slate-400" />
                                                    <span className="dir-ltr">{client.phone}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-slate-100/80">
                                        <span className="text-sm text-slate-500 font-bold">الرصيد الحالي</span>
                                        <span className={`font-black text-lg ${client.balance >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                            {Math.abs(client.balance).toLocaleString()}
                                            <span className="text-xs font-bold text-slate-400 mr-1">د.ع</span>
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={activeTab === 'clients' ? 'إضافة عميل جديد' : 'إضافة مورد جديد'}
            >
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1.5">الاسم الكامل <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <User size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-100 transition-all font-medium"
                                placeholder="مثال: محمد العراقي"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1.5">رقم الهاتف</label>
                        <div className="relative">
                            <Phone size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-100 transition-all font-medium text-left dir-ltr"
                                placeholder="0770xxxxxxx"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1.5">العنوان</label>
                        <div className="relative">
                            <MapPin size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                value={formData.address}
                                onChange={e => setFormData({ ...formData, address: e.target.value })}
                                className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-100 transition-all font-medium"
                                placeholder="بغداد، الكرادة، شارع 62..."
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1.5">الرصيد الافتتاحي (د.ع)</label>
                        <input
                            type="number"
                            value={formData.initialBalance}
                            onChange={e => setFormData({ ...formData, initialBalance: e.target.value })}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-100 transition-all font-medium"
                            placeholder="0"
                        />
                        <p className="text-xs text-slate-400 mt-1.5 font-medium">اتركه 0 إذا لم يكن هناك دين سابق.</p>
                    </div>

                    <div className="pt-6 flex gap-3">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 btn-secondary text-sm">إلغاء</button>
                        <button type="submit" className="flex-1 btn-primary text-sm shadow-none">
                            <Save size={18} />
                            <span>حفظ البيانات</span>
                        </button>
                    </div>
                </form>
            </Modal>
        </>
    );
};

export default Clients;
