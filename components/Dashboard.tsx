
import React from 'react';
import { Jurisdiction } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', count: 4 },
  { name: 'Feb', count: 7 },
  { name: 'Mar', count: 5 },
  { name: 'Apr', count: 12 },
  { name: 'May', count: 9 },
];

interface DashboardProps {
  onNewTender: () => void;
  jurisdiction: Jurisdiction;
}

const Dashboard: React.FC<DashboardProps> = ({ onNewTender, jurisdiction }) => {
  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: 'Active Proposals', value: '14', trend: '+2 this week', color: 'blue' },
          { label: 'Win Probability', value: '72%', trend: 'Top 5% in industry', color: 'emerald' },
          { label: 'Compliance Health', value: '99.4', trend: 'Audit-ready', color: 'slate' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100 dayone-shadow transition-transform hover:scale-[1.02]">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</h3>
            <div className="flex items-baseline space-x-2 mt-4">
              <p className="text-4xl font-extrabold text-slate-900 tracking-tight">{stat.value}</p>
            </div>
            <p className="text-xs text-slate-500 mt-2 font-medium">{stat.trend}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-slate-100 dayone-shadow">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Bid Performance</h3>
              <p className="text-sm text-slate-400 mt-1">Monthly tender processing volume</p>
            </div>
            <button className="text-xs font-bold text-[#0066FF] hover:underline">Download Analytics</button>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" fill="#0066FF" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-5 bg-white p-8 rounded-3xl border border-slate-100 dayone-shadow">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold text-slate-900">Recent Activity</h3>
            <button 
              onClick={onNewTender}
              className="text-xs font-bold text-[#0066FF] px-4 py-2 bg-[#0066FF]/5 rounded-full hover:bg-[#0066FF]/10 transition-colors"
            >
              + New Entry
            </button>
          </div>
          <div className="space-y-6">
            {[
              { title: 'Casablanca Port Terminal', code: 'MA-042', status: 'Analysis' },
              { title: 'EU Cloud Framework', code: 'EU-081', status: 'Finished' },
              { title: 'SAM Logistics RFP', code: 'USA-009', status: 'Pending' },
            ].map((tender, i) => (
              <div key={i} className="flex items-center group cursor-pointer">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center font-bold text-slate-400 group-hover:bg-[#0066FF]/5 group-hover:text-[#0066FF] transition-all">
                  {tender.code.split('-')[0]}
                </div>
                <div className="ml-4 flex-1">
                  <h4 className="text-[14px] font-bold text-slate-900">{tender.title}</h4>
                  <p className="text-[12px] text-slate-400">{tender.code}</p>
                </div>
                <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${
                  tender.status === 'Finished' ? 'bg-green-50 text-green-600' : 
                  tender.status === 'Analysis' ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-500'
                }`}>
                  {tender.status}
                </span>
              </div>
            ))}
          </div>
          <button 
            onClick={onNewTender}
            className="mt-10 w-full py-4 bg-[#0066FF] text-white rounded-2xl font-bold text-[14px] hover:bg-blue-700 transition-all shadow-xl shadow-blue-200"
          >
            Process New Tender
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
