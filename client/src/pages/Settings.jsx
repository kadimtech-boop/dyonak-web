import React, { useState, useEffect } from 'react';
import { Save, Bell, Globe, Database } from 'lucide-react';
import axios from 'axios';

const Settings = () => {
    const [settings, setSettings] = useState({
        companyName: '',
        currency: 'IQD',
        notifications: true
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        axios.get('http://localhost:3000/api/settings')
            .then(res => setSettings(res.data))
            .catch(err => console.error(err));
    }, []);

    const handleSave = async () => {
        setLoading(true);
        try {
            await axios.post('http://localhost:3000/api/settings', settings);
            alert('تم حفظ الإعدادات بنجاح');
        } catch (error) {
            alert('فشل الحفظ');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
            <h1 className="text-3xl font-bold text-slate-800">الإعدادات</h1>

            <div className="glass-card divide-y divide-slate-100">
                <div className="p-6">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
                        <Globe size={20} className="text-primary-500" />
                        إعدادات عامة
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">اسم المتجر / الشركة</label>
                            <input
                                type="text"
                                value={settings.companyName}
                                onChange={e => setSettings({ ...settings, companyName: e.target.value })}
                                className="w-full p-2 border border-slate-300 rounded-lg outline-none focus:border-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">العملة الأساسية</label>
                            <select
                                value={settings.currency}
                                onChange={e => setSettings({ ...settings, currency: e.target.value })}
                                className="w-full p-2 border border-slate-300 rounded-lg outline-none focus:border-primary-500"
                            >
                                <option value="IQD">الدينار العراقي (IQD)</option>
                                <option value="USD">الدولار الأمريكي (USD)</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
                        <Bell size={20} className="text-primary-500" />
                        الإشعارات
                    </h3>
                    <div className="space-y-3">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.notifications}
                                onChange={e => setSettings({ ...settings, notifications: e.target.checked })}
                                className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                            />
                            <span className="text-slate-700">تنبيه عند اقتراب موعد سداد الدين</span>
                        </label>
                    </div>
                </div>

                <div className="p-6">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
                        <Database size={20} className="text-primary-500" />
                        النسخ الاحتياطي
                    </h3>
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                        <div>
                            <p className="font-medium text-slate-800">حفظ نسخة من البيانات</p>
                            <p className="text-sm text-slate-500">حفظ ملف db.json محلياً</p>
                        </div>
                        <button className="btn-secondary text-sm">
                            تنزيل النسخة
                        </button>
                    </div>
                </div>

                <div className="p-6 flex justify-end">
                    <button onClick={handleSave} disabled={loading} className="btn-primary">
                        <Save size={18} />
                        <span>{loading ? 'جاري الحفظ...' : 'حفظ التغييرات'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Settings;
