import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Wallet, TrendingUp, TrendingDown, Plus, Save, Tag } from 'lucide-react';
import Modal from '../components/Modal';
import { getExpenses, addExpense, getStats } from '../utils/api';

const Expenses = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [expenses, setExpenses] = useState([]);
    const [stats, setStats] = useState({ totalIncome: 0, totalExpenses: 0 });

    // Form State
    const [formData, setFormData] = useState({
        category: 'إيجار',
        amount: '',
        note: ''
    });

    const fetchData = async () => {
        try {
            const [expRes, statsRes] = await Promise.all([getExpenses(), getStats()]);
            setExpenses(expRes.data);
            setStats(statsRes.data);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addExpense(formData);
            setIsModalOpen(false);
            setFormData({ ...formData, amount: '', note: '' });
            fetchData();
        } catch (e) {
            alert('Failed to save');
        }
    };

    // Calculate chart data from real expenses
    const chartData = Object.values(expenses.reduce((acc, curr) => {
        if (!acc[curr.category]) acc[curr.category] = { name: curr.category, value: 0, color: '#3b82f6' };
        acc[curr.category].value += curr.amount;
        return acc;
    }, {}));

    // Assign colors
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
    chartData.forEach((d, i) => d.color = colors[i % colors.length]);

    return (
        <>
            <div className="space-y-8 animate-fade-in">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight">المصاريف والإيرادات</h1>
                        <p className="text-slate-500 mt-1 font-medium">إدارة النفقات وتحليل التدفق المالي.</p>
                    </div>
                    <button onClick={() => setIsModalOpen(true)} className="btn-primary">
                        <Plus size={20} />
                        <span>مصروف جديد</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="glass-card p-6 flex items-center gap-4">
                        <div className="p-4 bg-primary-100 text-primary-600 rounded-2xl">
                            <Wallet size={28} />
                        </div>
                        <div>
                            <p className="text-slate-500 text-sm font-bold">الرصيد المتاح</p>
                            <h3 className="text-2xl font-black text-slate-800">
                                {(stats.totalIncome - stats.totalExpenses).toLocaleString()} <span className="text-sm text-slate-400">د.ع</span>
                            </h3>
                        </div>
                    </div>
                    <div className="glass-card p-6 flex items-center gap-4">
                        <div className="p-4 bg-emerald-100 text-emerald-600 rounded-2xl">
                            <TrendingUp size={28} />
                        </div>
                        <div>
                            <p className="text-slate-500 text-sm font-bold">إجمالي المقبوضات</p>
                            <h3 className="text-2xl font-black text-slate-800">
                                {stats.totalIncome.toLocaleString()} <span className="text-sm text-slate-400">د.ع</span>
                            </h3>
                        </div>
                    </div>
                    <div className="glass-card p-6 flex items-center gap-4">
                        <div className="p-4 bg-rose-100 text-rose-600 rounded-2xl">
                            <TrendingDown size={28} />
                        </div>
                        <div>
                            <p className="text-slate-500 text-sm font-bold">إجمالي المصروفات</p>
                            <h3 className="text-2xl font-black text-slate-800">
                                {stats.totalExpenses.toLocaleString()} <span className="text-sm text-slate-400">د.ع</span>
                            </h3>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="glass-card p-8">
                        <h3 className="text-xl font-bold text-slate-800 mb-6">توزيع المصروفات</h3>
                        <div className="h-72 w-full">
                            {chartData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={chartData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={70}
                                            outerRadius={100}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {chartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                            ))}
                                        </Pie>
                                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                        <Legend iconType="circle" />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-slate-400">لا توجد بيانات للمخطط</div>
                            )}
                        </div>
                    </div>

                    <div className="glass-card p-6 min-h-[400px]">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-slate-800">سجل المصروفات الأخير</h3>
                        </div>
                        <div className="space-y-4 max-h-[300px] overflow-y-auto">
                            {expenses.map((item) => (
                                <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50/50 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-slate-200">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold bg-primary-500">
                                            {item.category[0]}
                                        </div>
                                        <div>
                                            <span className="font-bold text-slate-800 block text-lg">{item.category}</span>
                                            <span className="text-xs text-slate-400 font-medium">
                                                {new Date(item.date).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                    <span className="font-black text-lg text-slate-700">
                                        {item.amount.toLocaleString()} <span className="text-xs">د.ع</span>
                                    </span>
                                </div>
                            ))}
                            {expenses.length === 0 && (
                                <div className="text-center py-10 text-slate-400">لا توجد مصروفات مسجلة</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="تسجيل مصروف جديد"
            >
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1.5">التصنيف</label>
                        <div className="relative">
                            <Tag size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <select
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                                className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-100 font-medium appearance-none"
                            >
                                <option>إيجار</option>
                                <option>رواتب</option>
                                <option>نثريات</option>
                                <option>كهرباء</option>
                                <option>تسوق بضاعة</option>
                            </select>
                        </div>
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

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1.5">ملاحظات</label>
                        <textarea
                            value={formData.note}
                            onChange={e => setFormData({ ...formData, note: e.target.value })}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-100 font-medium h-24 resize-none"
                            placeholder="تفاصيل المصروف..."
                        ></textarea>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 btn-secondary text-sm">إلغاء</button>
                        <button type="submit" className="flex-1 btn-primary text-sm shadow-none">
                            <Save size={18} />
                            <span>حفظ</span>
                        </button>
                    </div>
                </form>
            </Modal>
        </>
    );
};

export default Expenses;
