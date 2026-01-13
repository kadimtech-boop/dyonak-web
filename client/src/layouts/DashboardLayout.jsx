import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const DashboardLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-primary-50/30 flex">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            <main className="flex-1 flex flex-col min-w-0 transition-all duration-300">
                <Header toggleSidebar={toggleSidebar} />

                <div className="flex-1 px-4 pb-8 md:px-8 overflow-y-auto">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
