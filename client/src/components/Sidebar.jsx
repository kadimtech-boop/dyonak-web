import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Banknote,
    Wallet,
    Settings,
    LogOut,
    Menu
} from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { icon: LayoutDashboard, label: 'لوحة التحكم', path: '/' },
        { icon: Users, label: 'العملاء والموردين', path: '/clients' },
        { icon: Banknote, label: 'سجل الديون', path: '/debts' },
        { icon: Wallet, label: 'المصاريف', path: '/expenses' },
        { icon: Settings, label: 'الإعدادات', path: '/settings' },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={clsx(
                    "fixed inset-0 bg-slate-900/60 z-40 lg:hidden transition-opacity backdrop-blur-sm",
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={toggleSidebar}
            />

            {/* Sidebar */}
            <aside
                className={clsx(
                    "fixed lg:sticky top-0 right-0 h-screen w-72 glass-panel border-l-0 border-r border-white/40 z-50 transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col",
                    isOpen ? "translate-x-0" : "translate-x-full"
                )}
            >
                <div className="p-8 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary-500/30">
                            د
                        </div>
                        <h1 className="text-3xl font-black bg-gradient-to-r from-primary-700 via-primary-600 to-secondary-600 bg-clip-text text-transparent tracking-tight">
                            ديونك
                        </h1>
                    </div>
                    <button onClick={toggleSidebar} className="lg:hidden text-slate-400 hover:text-slate-600">
                        <Menu size={24} />
                    </button>
                </div>

                <nav className="flex-1 px-4 space-y-2 overflow-y-auto py-4">
                    <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">القائمة الرئيسية</p>
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => clsx(
                                "flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group font-bold text-sm",
                                isActive
                                    ? "bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg shadow-primary-500/20 translate-x-2"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-primary-600"
                            )}
                        >
                            <item.icon size={20} className={clsx("transition-transform group-hover:scale-110", ({ isActive }) => isActive ? "text-white" : "text-slate-400 group-hover:text-primary-500")} />
                            <span>{item.label}</span>
                        </NavLink>
                    ))}

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group font-bold text-sm text-slate-500 hover:bg-rose-50 hover:text-rose-600 mt-4"
                    >
                        <LogOut size={20} className="transition-transform group-hover:scale-110 group-hover:text-rose-500" />
                        <span>تسجيل الخروج</span>
                    </button>
                </nav>

                <div className="p-6 mt-auto">
                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 text-white relative overflow-hidden shadow-xl">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                        <h4 className="font-bold relative z-10 mb-1">النسخة الاحترافية</h4>
                        <p className="text-xs text-slate-300 relative z-10 mb-3 opacity-90">قم بالترقية للحصول على ميزات الذكاء الاصطناعي.</p>
                        <button className="w-full py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-lg text-xs font-bold transition-colors">
                            ترقية الآن
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
