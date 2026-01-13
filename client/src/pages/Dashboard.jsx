import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Users, AlertCircle, ArrowUpRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getStats, getDebts } from '../utils/api';

const StatCard = ({ title, value, subValue, icon: Icon, color, trend }) => {
    const styles = {
        blue: { bg: 'bg-blue-50', text: 'text-blue-600', gradient: 'from-blue-500 to-blue-600' },
        green: { bg: 'bg-emerald-50', text: 'text-emerald-600', gradient: 'from-emerald-500 to-emerald-600' },
        red: { bg: 'bg-rose-50', text: 'text-rose-600', gradient: 'from-rose-500 to-rose-600' },
        indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', gradient: 'from-indigo-500 to-indigo-600' },
    };

    const style = styles[color] || styles.blue;

    return (
        <div className="glass-card p-6 relative overflow-hidden group">
            {/* Background decoration */}
            <div className={`absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br ${style.gradient} opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500`}></div>

            <div className="flex items-start justify-between mb-4 relative z-10">
                <div>
                    <p className="text-slate-500 text-sm font-bold mb-1">{title}</p>
                    <h3 className="text-3xl font-black text-slate-800 tracking-tight">{value}</h3>
                </div>
                <div className={`p-3 rounded-2xl ${style.bg} ${style.text} shadow-sm group-hover:scale-110 transition-transform`}>
                    <Icon size={24} />
                </div>
            </div>

            <div className="flex items-center gap-2 relative z-10">
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${trend === 'up' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                    {subValue}
                </span>
                <span className="text-xs text-slate-400 font-medium">مقارنة بالشهر الماضي</span>
            </div>
        </div>
    );
};

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [recentDebts, setRecentDebts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Mock chart data for now
    const chartData = [
        { name: 'يناير', income: 4000, expense: 2400 },
        { name: 'فبراير', income: 3000, expense: 1398 },
        { name: 'مارس', income: 2000, expense: 9800 },
        { name: 'أبريل', income: 2780, expense: 3908 },
        { name: 'مايو', income: 1890, expense: 4800 },
        { name: 'يونيو', income: 2390, expense: 3800 },
        { name: 'يوليو', income: 3490, expense: 4300 },
    ];

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [statsRes, debtsRes] = await Promise.all([getStats(), getDebts()]);
                setStats(statsRes.data);
                // Take last 5 transactions
                setRecentDebts(debtsRes.data.slice(-5).reverse());
            } catch (e) {
                console.error("Dashboard data fetch error", e);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading || !stats) return <div className="p-10 text-center text-slate-400">جاري تحميل البيانات...</div>;

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-slate-800 tracking-tight mb-2">لوحة التحكم</h1>
                    <p className="text-slate-500 font-medium">نظرة عامة على أداء مشروعك المالي.</p>
                </div>
                <div className="flex gap-3">
                    <button className="btn-secondary">تصدير CSV</button>
                    <button className="btn-primary">
                        <span>+ فاتورة جديدة</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="صافي الدخل"
                    value={(stats.totalIncome - stats.totalExpenses).toLocaleString()}
                    subValue={stats.growth}
                    trend="up"
                    icon={TrendingUp}
                    color="indigo"
                />
                <StatCard
                    title="مستحقات لنا"
                    value={stats.totalReceivable.toLocaleString()}
                    subValue="+8%"
                    trend="up"
                    icon={Users}
                    color="green"
                />
                <StatCard
                    title="ديون علينا"
                    value={stats.totalPayable.toLocaleString()}
                    subValue="-5%"
                    trend="down"
                    icon={AlertCircle}
                    color="red"
                />
                <StatCard
                    title="نسبة النمو"
                    value="24%"
                    subValue="+2.1%"
                    trend="up"
                    icon={ArrowUpRight}
                    color="blue"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="glass-card p-8 lg:col-span-2">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-2xl font-bold text-slate-800">تحليل المبيعات</h3>
                        <select className="bg-slate-50 border-none text-slate-600 text-sm font-bold rounded-lg p-2 outline-none focus:ring-2 focus:ring-primary-100">
                            <option>آخر 6 أشهر</option>
                            <option>هذا العام</option>
                        </select>
                    </div>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" stroke="#94a3b8" axisLine={false} tickLine={false} dy={10} />
                                <YAxis stroke="#94a3b8" axisLine={false} tickLine={false} dx={-10} />
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Area type="monotone" dataKey="income" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" name="إيرادات" />
                                <Area type="monotone" dataKey="expense" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" name="مصروفات" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass-card p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-slate-800">آخر العمليات</h3>
                        <button className="text-primary-600 text-sm font-bold hover:underline">عرض الكل</button>
                    </div>
                    <div className="space-y-4">
                        {recentDebts.map((debt, i) => (
                            <div key={debt.id} className="flex items-center justify-between p-4 hover:bg-white/50 rounded-2xl transition-all cursor-pointer group hover:shadow-sm border border-transparent hover:border-white/60">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${i % 2 === 0 ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                                        {i % 2 === 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800 text-lg">{debt.clientName}</p>
                                        <p className="text-xs text-slate-500 font-medium">{new Date(debt.date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <p className={`font-bold text-lg ${['credit', 'payment'].includes(debt.type) ? 'text-emerald-600' : 'text-rose-600'}`}>
                                    {debt.amount.toLocaleString()}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
