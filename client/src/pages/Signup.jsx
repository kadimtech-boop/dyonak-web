import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, ArrowLeft, Mail, Phone, AlertCircle } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const name = e.target[0].value;
        const email = e.target[1].value;
        const password = e.target[2].value;

        try {
            const response = await api.post('/signup', { name, email, password });
            const data = response.data;

            if (data.success) {
                login(data.user);
                navigate('/');
            } else {
                setError(data.message || 'فشل إنشاء الحساب');
            }
        } catch (err) {
            console.error(err);
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else if (err.message === "Network Error") {
                setError('خطأ في الاتصال بالخادم. تأكد من تشغيل الخادم.');
            } else {
                setError('حدث خطأ غير متوقع. حاول مرة أخرى.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            {/* Background with mesh gradient */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute top-0 left-0 w-full h-full bg-slate-50"></div>
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-[100px] animate-blob"></div>
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-secondary-500/10 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
            </div>

            <div className="glass-card w-full max-w-md p-8 relative overflow-hidden">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight mb-2">إنشاء حساب جديد</h1>
                    <p className="text-slate-500 font-medium">ابدأ رحلة إدارة أموالك مع ديونك</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-rose-600 animate-fade-in">
                        <AlertCircle size={24} />
                        <p className="font-bold text-sm">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-slate-700">الاسم الكامل</label>
                        <div className="relative">
                            <input type="text" className="w-full pl-4 pr-11 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all font-medium" placeholder="محمد علي" />
                            <User size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-slate-700">البريد الإلكتروني</label>
                        <div className="relative">
                            <input type="email" className="w-full pl-4 pr-11 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all font-medium text-left dir-ltr" placeholder="example@gmail.com" />
                            <Mail size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-slate-700">كلمة المرور</label>
                        <div className="relative">
                            <input type="password" className="w-full pl-4 pr-11 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all font-medium text-left dir-ltr" placeholder="••••••••" />
                            <Lock size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary h-12 text-lg relative mt-2"
                    >
                        {loading ? (
                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <span>تسجيل حساب</span>
                                <ArrowLeft size={20} className="absolute left-6" />
                            </>
                        )}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm font-medium text-slate-500">
                    لديك حساب بالفعل؟{' '}
                    <Link to="/login" className="text-primary-600 font-bold hover:underline">سجل الدخول</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
