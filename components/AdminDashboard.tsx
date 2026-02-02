
import React, { useState, useEffect, useRef } from 'react';
import { User, SubscriptionTier, UserRole, Language } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { backend } from '../services/backendService';
import { db } from '../services/db';

const REVENUE_DATA = [
  { month: 'Jan', revenue: 12500, users: 450 },
  { month: 'Feb', revenue: 18400, users: 680 },
  { month: 'Mar', revenue: 24900, users: 910 },
  { month: 'Apr', revenue: 38400, users: 1240 },
];

interface AdminDashboardProps {
  lang: Language;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ lang }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isAr = lang === Language.AR;

  useEffect(() => {
    const fetchData = async () => {
      const allUsers = await db.users.toArray();
      const allLogs = await backend.getAllLogs();
      setUsers(allUsers);
      setLogs(allLogs);
    };
    fetchData();
  }, []);

  const filteredUsers = users.filter(u => u.email.toLowerCase().includes(searchTerm.toLowerCase()));

  const updateUserTier = async (userId: string, tier: SubscriptionTier) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      const updatedUser = { ...user, subscriptionTier: tier };
      await backend.saveUser(updatedUser);
      setUsers(users.map(u => u.id === userId ? updatedUser : u));
    }
  };

  const handleBackup = async () => {
    await backend.exportDatabase();
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsImporting(true);
      try {
        await backend.importDatabase(e.target.files[0]);
        window.location.reload(); // Reload to refresh all data
      } catch (err) {
        alert("Import failed: " + err);
      } finally {
        setIsImporting(false);
      }
    }
  };

  return (
    <div className="space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: isAr ? 'إجمالي الأرباح (MRR)' : 'Total MRR', value: '$38,400', trend: '+18%', color: 'indigo' },
          { label: isAr ? 'المستخدمين النشطين' : 'Active Users', value: users.length.toString(), trend: 'Real-time Data', color: 'blue' },
          { label: isAr ? 'سجلات النظام' : 'System Logs', value: logs.length.toString(), trend: 'DB Connected', color: 'emerald' },
          { label: isAr ? 'حالة السيرفر' : 'Server Status', value: 'Online', trend: 'Gemini 3 Pro', color: 'orange' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm group">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</h3>
            <div className="flex items-baseline justify-between mt-3">
              <p className="text-2xl font-extrabold text-slate-900 tracking-tight group-hover:text-dayone-orange transition-colors">{stat.value}</p>
              <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">{stat.trend}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-8">
          {/* Revenue Chart */}
          <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{isAr ? 'إحصائيات المنصة' : 'Platform Analytics'}</h3>
                <p className="text-sm text-slate-400 font-medium">{isAr ? 'نمو المستخدمين والاشتراكات' : 'User growth and subscription metrics'}</p>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={REVENUE_DATA}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ff9900" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#ff9900" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="revenue" stroke="#ff9900" strokeWidth={3} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Database & Backups Card */}
          <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
             <div className="flex justify-between items-center mb-8">
                <div>
                   <h3 className="text-lg font-bold text-slate-900">{isAr ? 'قاعدة البيانات والنسخ الاحتياطي' : 'Database & Backup Engine'}</h3>
                   <p className="text-sm text-slate-400 font-medium">{isAr ? 'إدارة استمرارية البيانات ونقاط الاستعادة' : 'Manage data persistence and restore points'}</p>
                </div>
                <div className="flex gap-3">
                   <button 
                    onClick={handleBackup}
                    className="px-6 py-2.5 bg-slate-900 text-white rounded-2xl font-bold text-xs hover:bg-black transition-all flex items-center gap-2"
                   >
                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                     {isAr ? 'تصدير نسخة احتياطية' : 'Export Backup'}
                   </button>
                   <button 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isImporting}
                    className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold text-xs hover:bg-slate-50 transition-all flex items-center gap-2"
                   >
                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>
                     {isImporting ? 'Importing...' : (isAr ? 'استعادة نسخة' : 'Restore Backup')}
                   </button>
                   <input type="file" ref={fileInputRef} className="hidden" accept=".json" onChange={handleImport} />
                </div>
             </div>
             <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-indigo-600">
                         <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"/></svg>
                      </div>
                      <div>
                         <p className="text-sm font-bold text-slate-900">IndexedDB Storage</p>
                         <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Active Table: tl_production_v1</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-sm font-bold text-emerald-600">Healthy</p>
                      <p className="text-[10px] text-slate-400 font-medium">Last synced: Just now</p>
                   </div>
                </div>
             </div>
          </div>

          {/* User Table */}
          <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50">
                <h3 className="text-lg font-bold text-slate-900">{isAr ? 'إدارة المستخدمين' : 'User Management'}</h3>
            </div>
            <table className="w-full text-left rtl:text-right">
              <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <tr>
                  <th className="px-8 py-4">User</th>
                  <th className="px-8 py-4">Plan</th>
                  <th className="px-8 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredUsers.map(user => (
                  <tr key={user.id} className="text-sm">
                    <td className="px-8 py-4 font-bold">{user.email}</td>
                    <td className="px-8 py-4">
                       <select 
                        value={user.subscriptionTier} 
                        onChange={(e) => updateUserTier(user.id, e.target.value as SubscriptionTier)}
                        className="bg-slate-50 border-none rounded-lg text-xs font-bold"
                       >
                         <option value={SubscriptionTier.FREE}>FREE</option>
                         <option value={SubscriptionTier.PRO}>PRO</option>
                         <option value={SubscriptionTier.ENTERPRISE}>ENTERPRISE</option>
                       </select>
                    </td>
                    <td className="px-8 py-4"><span className="text-emerald-500 font-bold">Active</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className="bg-slate-900 p-8 rounded-[40px] text-white">
             <h4 className="font-bold mb-6">{isAr ? 'سجلات النظام الحية' : 'Live System Logs'}</h4>
             <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                {logs.map((log, i) => (
                  <div key={i} className="text-[11px] font-medium p-3 bg-white/5 rounded-xl border border-white/5">
                    <div className="flex justify-between mb-1">
                      <span className={`font-bold ${log.type === 'SUCCESS' ? 'text-emerald-400' : log.type === 'ADMIN' ? 'text-indigo-400' : 'text-slate-400'}`}>{log.type}</span>
                      <span className="text-white/20 uppercase">{new Date(log.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-slate-300 leading-tight">{log.event}</p>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
