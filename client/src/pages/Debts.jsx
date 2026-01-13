import React, { useState, useEffect } from 'react';
import { Filter, Download, ArrowUpRight, ArrowDownLeft, Plus, Save, Calendar, FileText } from 'lucide-react';
import Modal from '../components/Modal';
import { getDebts, addDebt, getClients } from '../utils/api';

const Debts = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [debts, setDebts] = useState([]);
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form State
    const [formData, setFormData] = useState({
        clientId: '',
        type: 'credit',
        amount: '',
        description: ''
    });

    const fetchData = async () => {
        try {
            const [debtsRes, clientsRes] = await Promise.all([getDebts(), getClients()]);
            setDebts(debtsRes.data);
            setClients(clientsRes.data);

            // Set default client if exists
            if (clientsRes.data.length > 0) {
                setFormData(prev => ({ ...prev, clientId: clientsRes.data[0].id }));
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addDebt(formData);
            setIsModalOpen(false);
            setFormData({ ...formData, amount: '', description: '' });
            fetchData(); // Refresh
        } catch (e) {
            alert('Failed to save');
        }
    };

    const getStatusColor = (type) => {
        if (type === 'payment' || type === 'credit') return 'bg-emerald-100 text-emerald-700';
        return 'bg-rose-100 text-rose-700';
    };

    const getStatusIcon = (type) => {
        if (type === 'payment' || type === 'credit') return <ArrowDownLeft size={14} />;
        return <ArrowUpRight size={14} />;
    };

    const getTypeName = (type) => {
        const map = {
            'credit': 'دين جديد (لنا)',
            'debit': 'دين جديد (علينا)',
            'payment': 'استلام دفعة',
            'receipt': 'صرف دفعة'
        };
        return map[type] || type;
    };

    return (
        <>
            <div className="space-y-6 animate-fade-in">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight">سجل الديون</h1>
                        <p className="text-slate-500 mt-1 font-medium">تتبع عمليات الدين والسداد مع العملاء.</p>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={() => setIsModalOpen(true)} className="btn-primary">
                            <Plus size={20} />
                            <span>عملية جديدة</span>
                        </button>
                        <button className="btn-secondary">
                            <Download size={18} />
                            <span className="hidden sm:inline">تصدير</span>
                        </button>
                    </div>
                </div>

                <div className="glass-card overflow-hidden min-h-[400px]">
                    <div className="overflow-x-auto">
                        <table className="w-full text-right">
                            <thead className="bg-slate-50/50 border-b border-slate-200 text-slate-500 text-sm">
                                <tr>
                                    <th className="px-6 py-4 font-bold">العميل / المورد</th>
                                    <th className="px-6 py-4 font-bold">نوع العملية</th>
                                    <th className="px-6 py-4 font-bold">المبلغ</th>
                                    <th className="px-6 py-4 font-bold">التاريخ</th>
                                    <th className="px-6 py-4 font-bold">التفاصيل</th>
                                    <th className="px-6 py-4 font-bold">الحالة</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {debts.map((debt) => (
                                    <tr key={debt.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-slate-800">{debt.clientName}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold ${getStatusColor(debt.type)}`}>
                                                {getStatusIcon(debt.type)}
                                                {getTypeName(debt.type)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-black text-slate-700 text-lg">
                                            {debt.amount.toLocaleString()} <span className="text-xs text-slate-400 font-bold">د.ع</span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 text-sm font-medium">
                                            {new Date(debt.date).toLocaleDateString('en-GB')}
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 text-sm font-medium max-w-xs truncate">
                                            {debt.description || '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold">
                                                {debt.status === 'completed' ? 'مكتمل' : 'معلق'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {debts.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="text-center py-10 text-slate-400">لا توجد عمليات مسجلة بعد</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="تسجيل عملية جديدة"
            >
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1.5">العميل / المورد</label>
                        <select
                            value={formData.clientId}
                            onChange={e => setFormData({ ...formData, clientId: e.target.value })}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-100 font-medium"
                        >
                            {clients.map(c => (
                                <option key={c.id} value={c.id}>{c.name} ({c.type === 'client' ? 'عميل' : 'مورد'})</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">نوع العملية</label>
                            <select
                                value={formData.type}
                                onChange={e => setFormData({ ...formData, type: e.target.value })}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-100 font-medium"
                            >
                                <option value="credit">دين جديد (لنا)</option>
                                <option value="debit">دين جديد (علينا)</option>
                                <option value="payment">استلام دفعة</option>
                                <option value="receipt">صرف دفعة</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">المبلغ (د.ع)</label>
                            <input
                                type="number"
                                value={formData.amount}
                                onChange={e => setFormData({ ...formData, amount: e.target.value })}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-100 font-medium"
                                placeholder="0"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1.5">ملاحظات / التفاصيل</label>
                        <div className="relative">
                            <FileText size={18} className="absolute right-3.5 top-4 text-slate-400" />
                            <textarea
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-100 font-medium h-24 resize-none"
                                placeholder="أي تفاصيل إضافية..."
                            ></textarea>
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 btn-secondary text-sm">إلغاء</button>
                        <button type="submit" className="flex-1 btn-primary text-sm shadow-none">
                            <Save size={18} />
                            <span>حفظ العملية</span>
                        </button>
                    </div>
                </form>
            </Modal>
        </>
    );
};

export default Debts;
