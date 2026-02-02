
import React, { useState } from 'react';
import { User, SubscriptionTier, UserRole, Language } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MOCK_USERS: User[] = [
  { id: '1', email: 'ayoubwassima78@gmail.com', name: 'Ayoub (Master)', role: UserRole.ADMIN, subscriptionTier: SubscriptionTier.ENTERPRISE, createdAt: '2025-01-01', provider: 'email' },
  { id: '2', email: 'tech@firm.ma', name: 'Elite Construction', role: UserRole.EDITOR, subscriptionTier: SubscriptionTier.PRO, createdAt: '2025-01-15', provider: 'google' },
  { id: '3', email: 'user@gmail.com', name: 'Freelance Engineer', role: UserRole.VIEWER, subscriptionTier: SubscriptionTier.FREE, createdAt: '2025-02-01', provider: 'google' },
  { id: '4', email: 'contact@omar-builders.com', name: 'Omar Builders', role: UserRole.EDITOR, subscriptionTier: SubscriptionTier.PRO, createdAt: '2025-02-10', provider: 'email' },
  { id: '5', email: 'admin@gov.ma', name: 'Gov Analyst', role: UserRole.EDITOR, subscriptionTier: SubscriptionTier.ENTERPRISE, createdAt: '2025-02-12', provider: 'email' },
];

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
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [searchTerm, setSearchTerm] = useState('');
  const isAr = lang === Language.AR;

  const filteredUsers = users.filter(u => u.email.toLowerCase().includes(searchTerm.toLowerCase()));

  const updateUserTier = (userId: string, tier: SubscriptionTier) => {
    setUsers(users.map(u => u.id === userId ? { ...u, subscriptionTier: tier } : u));
  };

  return (
    <div className="space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: isAr ? 'إجمالي الأرباح (MRR)' : 'Total MRR', value: '$38,400', trend: '+18%', color: 'indigo' },
          { label: isAr ? 'المستخدمين النشطين' : 'Active Users', value: '1,240', trend: '+124 this week', color: 'blue' },
          { label: isAr ? 'المناقصات المحللة' : 'Tenders Parsed', value: '14,820', trend: 'Gemini 3 Online', color: 'emerald' },
          { label: isAr ? 'نسبة الفوز العالمية' : 'Global Win Rate', value: '78%', trend: 'Optimized AI', color: 'orange' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm transition-all hover:shadow-xl group">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</h3>
            <div className="flex items-baseline justify-between mt-3">
              <p className="text-2xl font-extrabold text-slate-900 tracking-tight group-hover:text-dayone-orange transition-colors">{stat.value}</p>
              <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">{stat.trend}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Stats Chart */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{isAr ? 'نمو الأرباح والمستخدمين' : 'Growth & Revenue Analytics'}</h3>
                <p className="text-sm text-slate-400 font-medium">{isAr ? 'أداء منصة TenderLogic شهرياً' : 'Monthly SaaS performance metrics'}</p>
              </div>
              <div className="flex bg-slate-100 rounded-xl p-1">
                 <button className="px-4 py-2 text-[10px] font-bold bg-white rounded-lg shadow-sm">Revenue</button>
                 <button className="px-4 py-2 text-[10px] font-bold text-slate-500">Retention</button>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={REVENUE_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ff9900" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#ff9900" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <Tooltip contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
                  <Area type="monotone" dataKey="revenue" stroke="#ff9900" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* User Table */}
          <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{isAr ? 'قائمة المشتركين' : 'User Management'}</h3>
                <p className="text-sm text-slate-400 font-medium">{isAr ? 'التحكم في التراخيص والوصول' : 'Control enterprise licenses and access'}</p>
              </div>
              <div className="relative w-full md:w-80">
                 <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                 <input 
                  type="text" 
                  placeholder={isAr ? "ابحث بالبريد الإلكتروني..." : "Search by email..."}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-11 pr-4 text-sm focus:ring-4 focus:ring-dayone-orange/10 outline-none transition-all font-medium"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                 />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left rtl:text-right">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <th className="px-8 py-5">{isAr ? 'المستخدم' : 'User'}</th>
                    <th className="px-8 py-5">{isAr ? 'الصلاحية' : 'Role'}</th>
                    <th className="px-8 py-5">{isAr ? 'الخطة' : 'Plan'}</th>
                    <th className="px-8 py-5">{isAr ? 'التاريخ' : 'Joined'}</th>
                    <th className="px-8 py-5 text-center">{isAr ? 'الإجراءات' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center space-x-3 rtl:space-x-reverse">
                           <div className="w-11 h-11 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-slate-200 uppercase">
                             {user.name[0]}
                           </div>
                           <div>
                             <p className="text-sm font-bold text-slate-900">{user.name}</p>
                             <p className="text-[11px] text-slate-400 font-medium">{user.email}</p>
                           </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                         <span className={`text-[10px] font-bold px-3 py-1.5 rounded-full ${user.role === UserRole.ADMIN ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                           {user.role}
                         </span>
                      </td>
                      <td className="px-8 py-6">
                         <select 
                          value={user.subscriptionTier}
                          onChange={(e) => updateUserTier(user.id, e.target.value as SubscriptionTier)}
                          className={`text-[10px] font-bold px-3 py-1.5 rounded-xl border outline-none cursor-pointer transition-all ${
                            user.subscriptionTier === SubscriptionTier.ENTERPRISE ? 'bg-dayone-orange/10 text-dayone-orange border-dayone-orange/20' :
                            user.subscriptionTier === SubscriptionTier.PRO ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-slate-50 text-slate-400 border-slate-100'
                          }`}
                         >
                            <option value={SubscriptionTier.FREE}>FREE</option>
                            <option value={SubscriptionTier.PRO}>PRO</option>
                            <option value={SubscriptionTier.ENTERPRISE}>ENTERPRISE</option>
                         </select>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-[11px] font-bold text-slate-500">{user.createdAt}</p>
                      </td>
                      <td className="px-8 py-6 text-center">
                         <div className="flex items-center justify-center space-x-3">
                            <button className="p-2 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" strokeWidth="2"/></svg></button>
                            <button className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth="2"/></svg></button>
                         </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar Controls */}
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-slate-900 p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-[-20%] right-[-20%] w-56 h-56 bg-dayone-orange rounded-full blur-[100px] opacity-20"></div>
              <h4 className="text-xl font-bold mb-8 relative z-10">{isAr ? 'التحكم العام' : 'Global Commands'}</h4>
              <div className="space-y-4 relative z-10">
                 <label className="flex items-center justify-between p-5 bg-white/5 rounded-3xl border border-white/10 cursor-pointer hover:bg-white/10 transition-all">
                    <div>
                      <span className="text-sm font-bold block">Maintenance</span>
                      <span className="text-[10px] text-slate-500">Lock all user sessions</span>
                    </div>
                    <div className="w-11 h-6 bg-slate-700 rounded-full relative"><div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div></div>
                 </label>
                 <label className="flex items-center justify-between p-5 bg-white/5 rounded-3xl border border-white/10 cursor-pointer hover:bg-white/10 transition-all">
                    <div>
                      <span className="text-sm font-bold block">Auto-Scaling</span>
                      <span className="text-[10px] text-slate-500">Scale Gemini API compute</span>
                    </div>
                    <div className="w-11 h-6 bg-emerald-500 rounded-full relative"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div></div>
                 </label>
                 <label className="flex items-center justify-between p-5 bg-white/5 rounded-3xl border border-white/10 cursor-pointer hover:bg-white/10 transition-all">
                    <div>
                      <span className="text-sm font-bold block">Free Trials</span>
                      <span className="text-[10px] text-slate-500">Allow new signups</span>
                    </div>
                    <div className="w-11 h-6 bg-emerald-500 rounded-full relative"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div></div>
                 </label>
              </div>
              <button className="w-full mt-10 py-5 bg-dayone-orange text-white rounded-[24px] font-extrabold text-sm hover:opacity-90 transition-all shadow-xl shadow-orange-900/20">
                Deploy System Update
              </button>
           </div>

           <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-10">
                 <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">{isAr ? 'سجل العمليات' : 'System Logs'}</h4>
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              </div>
              <div className="space-y-6">
                 {[
                   { event: 'User Ayoub logged in as ADMIN', time: 'Just now', type: 'ADMIN' },
                   { event: 'Payment $499 received from Client #081', time: '12m ago', type: 'SUCCESS' },
                   { event: 'Gemini 3 Pro context window optimized', time: '1h ago', type: 'SYSTEM' },
                   { event: 'Database migration to EU-Central-1 complete', time: '4h ago', type: 'SYSTEM' },
                 ].map((log, i) => (
                   <div key={i} className="flex items-start space-x-3 rtl:space-x-reverse">
                      <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${log.type === 'ADMIN' ? 'bg-indigo-500' : log.type === 'SUCCESS' ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                      <div>
                        <p className="text-[13px] font-bold text-slate-800 leading-tight">{log.event}</p>
                        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">{log.time}</p>
                      </div>
                   </div>
                 ))}
              </div>
              <button className="w-full mt-8 py-3.5 border border-slate-100 text-slate-400 text-[10px] font-bold uppercase tracking-widest rounded-2xl hover:bg-slate-50 transition-all">
                Export Audit Trail
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
