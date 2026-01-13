import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, ArrowLeft, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);

    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const email = e.target[0].value;
        const password = e.target[1].value;

        try {
            const response = await api.post('/login', { email, password });
            const data = response.data;

            if (data.success) {
                login(data.user);
                navigate('/');
            } else { // Should not happen with axios 2xx but for logic safety
                setError(data.message || 'فشل تسجيل الدخول');
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
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary-500/20 rounded-full blur-[100px] animate-blob"></div>
                <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-secondary-500/20 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
            </div>

            <div className="glass-card w-full max-w-md p-8 relative overflow-hidden">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-2xl text-white text-3xl font-bold mb-4 shadow-xl shadow-primary-500/30">
                        د
                    </div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight mb-2">مرحباً بك مجدداً</h1>
                    <p className="text-slate-500 font-medium">سجّل الدخول لمتابعة أعمالك</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-rose-600 animate-fade-in">
                        <AlertCircle size={24} />
                        <p className="font-bold text-sm">{error}</p>
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">البريد الإلكتروني</label>
                        <div className="relative">
                            <input
                                type="email"
                                defaultValue="admin@dyonak.com"
                                className="w-full pl-4 pr-11 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all placeholder-slate-400 font-medium text-left dir-ltr"
                                placeholder="Ex. admin@company.com"
                            />
                            <User size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-bold text-slate-700">كلمة المرور</label>
                            <a href="#" className="text-xs font-bold text-primary-600 hover:text-primary-700">نسيت كلمة المرور؟</a>
                        </div>
                        <div className="relative">
                            <input
                                type="password"
                                defaultValue="password123"
                                className="w-full pl-4 pr-11 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all font-medium text-left dir-ltr"
                                placeholder="••••••••"
                            />
                            <Lock size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary h-12 text-lg relative"
                    >
                        {loading ? (
                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <span>تسجيل الدخول</span>
                                <ArrowLeft size={20} className="absolute left-6" />
                            </>
                        )}
                    </button>
                </form>

                <p className="mt-8 text-center text-sm font-medium text-slate-500">
                    ليس لديك حساب؟{' '}
                    <Link to="/signup" className="text-primary-600 font-bold hover:underline">انشئ حساب جديد</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
