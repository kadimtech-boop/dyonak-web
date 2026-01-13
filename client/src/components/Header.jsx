import React from 'react';
import { Bell, Search, Menu, ChevronDown } from 'lucide-react';

const Header = ({ toggleSidebar }) => {
    return (
        <header className="sticky top-0 z-30 px-6 py-4 flex items-center justify-between mb-4 transition-all duration-300">
            <div className="absolute inset-0 bg-white/70 backdrop-blur-xl border-b border-white/40 -z-10 lg:hidden"></div>

            <div className="flex items-center gap-4">
                <button
                    onClick={toggleSidebar}
                    className="lg:hidden p-2 hover:bg-white/50 rounded-xl text-slate-600 transition-colors"
                >
                    <Menu size={24} />
                </button>

                <div className="hidden md:flex items-center gap-3 bg-white/60 backdrop-blur-md px-4 py-2.5 rounded-2xl focus-within:bg-white focus-within:ring-2 ring-primary-200 transition-all w-96 shadow-sm border border-white/50">
                    <Search size={20} className="text-slate-400" />
                    <input
                        type="text"
                        placeholder="بحث عن أي شيء..."
                        className="bg-transparent border-none outline-none w-full text-slate-700 placeholder-slate-400 text-sm font-medium"
                    />
                </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-6">
                <button className="relative p-3 hover:bg-white/60 rounded-xl text-slate-600 transition-colors group">
                    <Bell size={22} className="group-hover:text-primary-600 transition-colors" />
                    <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white animate-pulse"></span>
                </button>

                <div className="flex items-center gap-3 pl-2 sm:border-r sm:border-slate-200/60 sm:pr-6">
                    <div className="text-left hidden sm:block">
                        <p className="text-sm font-bold text-slate-700">أحمد محمد</p>
                        <p className="text-xs text-slate-500 font-medium">Admin</p>
                    </div>
                    <button className="flex items-center gap-2 group">
                        <img
                            src="https://ui-avatars.com/api/?name=Ahmed+Mohamed&background=6366f1&color=fff"
                            alt="User"
                            className="w-10 h-10 rounded-xl border-2 border-white shadow-md group-hover:scale-105 transition-transform"
                        />
                        <ChevronDown size={16} className="text-slate-400 group-hover:text-slate-600 transition-colors hidden sm:block" />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
