
import React, { useState } from 'react';
import { Language, UserRole, Invitation } from '../types';
import { translations } from '../translations';

interface TeamWorkspaceProps {
  lang: Language;
}

const TeamWorkspace: React.FC<TeamWorkspaceProps> = ({ lang }) => {
  const t = translations[lang];
  const isAr = lang === Language.AR;
  
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.EDITOR);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSending(true);
    
    // Simulate API delay for "sending"
    await new Promise(resolve => setTimeout(resolve, 1500));

    const newInvite: Invitation = {
      id: Math.random().toString(36).substr(2, 9),
      email: email,
      role: role,
      token: Math.random().toString(36).substr(2, 15).toUpperCase(),
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };

    setInvitations([newInvite, ...invitations]);
    setEmail('');
    setIsSending(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleCopyLink = async (token: string, inviteId: string) => {
    const link = `https://tenderlogic.app/join?token=${token}`;
    try {
      await navigator.clipboard.writeText(link);
      setCopiedId(inviteId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy!', err);
      alert(link); // Fallback
    }
  };

  const generateLink = async () => {
    const inviteId = Math.random().toString(36).substr(2, 9);
    const token = Math.random().toString(36).substr(2, 15).toUpperCase();
    
    const newInvite: Invitation = {
      id: inviteId,
      role: role,
      token: token,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };

    setInvitations([newInvite, ...invitations]);
    await handleCopyLink(token, inviteId);
  };

  const inputClass = `mt-1 block w-full rounded-xl border-slate-200 bg-slate-50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-4 border transition-all ${isAr ? 'text-right' : 'text-left'}`;
  const labelClass = `block text-sm font-bold text-slate-700 mb-2 ${isAr ? 'text-right' : 'text-left'}`;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="bg-white p-6 md:p-10 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden">
        {/* Header Decor */}
        <div className="absolute top-0 left-0 w-full h-2 bg-indigo-600"></div>

        <div className={`flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 ${isAr ? 'md:flex-row-reverse' : ''}`}>
          <div className={isAr ? 'text-right' : 'text-left'}>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">{t.teamTitle}</h2>
            <p className="text-slate-500 text-sm font-medium mt-1">{t.teamSub}</p>
          </div>
          {showSuccess && (
            <div className="bg-emerald-50 text-emerald-700 px-6 py-3 rounded-2xl text-sm font-bold flex items-center animate-bounce border border-emerald-100">
               <svg className="w-5 h-5 mr-2 rtl:ml-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
               {t.inviteSuccess}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Email Invite */}
          <form onSubmit={handleInvite} className="space-y-6">
            <div>
              <label className={labelClass}>{t.inviteEmail}</label>
              <input 
                type="email" 
                required
                placeholder="colleague@gmail.com"
                className={inputClass} 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className={labelClass}>{t.roleLabel}</label>
              <select 
                className={inputClass}
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
              >
                <option value={UserRole.ADMIN}>{t.adminRole}</option>
                <option value={UserRole.EDITOR}>{t.editorRole}</option>
                <option value={UserRole.VIEWER}>{t.viewerRole}</option>
              </select>
            </div>

            <button 
              type="submit"
              disabled={isSending}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white py-4 rounded-2xl font-bold shadow-xl shadow-indigo-100 transition-all flex items-center justify-center gap-3 active:scale-95"
            >
              {isSending ? (
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              )}
              {isSending ? (isAr ? 'جاري الإرسال...' : 'Sending...') : t.inviteButton}
            </button>
          </form>

          {/* Quick Actions */}
          <div className="bg-indigo-50/50 p-8 rounded-[32px] border border-indigo-100 flex flex-col justify-center text-center">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-indigo-600 mx-auto mb-6 shadow-sm border border-indigo-50">
               <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.826L10.242 9.172a4 4 0 015.656 0l4 4a4 4 0 01-5.656 5.656l-1.102 1.101"/></svg>
            </div>
            <h4 className="text-xl font-extrabold text-indigo-900 mb-2">{t.inviteLink}</h4>
            <p className="text-indigo-600/70 text-sm font-medium mb-8 leading-relaxed">
              {isAr ? 'أنشئ رابط انضمام فوري بالدور المحدد حالياً.' : 'Create an instant join link with the currently selected role.'}
            </p>
            <button 
              onClick={generateLink}
              className="bg-white text-indigo-700 hover:bg-indigo-100 py-4 rounded-2xl font-bold border border-indigo-200 transition-all shadow-sm active:scale-95"
            >
              {t.copyLink}
            </button>
          </div>
        </div>

        {/* Pending Invites List */}
        <div className="mt-16 pt-12 border-t border-slate-50">
           <h3 className={`text-lg font-extrabold text-slate-900 mb-8 flex items-center gap-3 ${isAr ? 'flex-row-reverse' : ''}`}>
              <span className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 text-sm">
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </span>
              {t.pendingInvites}
           </h3>

           {invitations.length === 0 ? (
             <div className="text-center py-16 bg-slate-50 rounded-[32px] border border-slate-100 border-dashed">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                </div>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">{t.noPending}</p>
             </div>
           ) : (
             <div className="space-y-4">
                {invitations.map((invite) => (
                  <div key={invite.id} className={`bg-white p-5 rounded-2xl border border-slate-100 flex items-center justify-between group hover:border-indigo-200 transition-all shadow-sm hover:shadow-md ${isAr ? 'flex-row-reverse' : ''}`}>
                     <div className={`flex items-center gap-4 ${isAr ? 'flex-row-reverse' : ''}`}>
                        <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                           {(invite.email || 'LINK')[0].toUpperCase()}
                        </div>
                        <div className={isAr ? 'text-right' : 'text-left'}>
                           <div className="flex items-center gap-2 mb-0.5">
                             <p className="text-sm font-extrabold text-slate-900">{invite.email || (isAr ? 'رابط عام' : 'Public Link')}</p>
                             {copiedId === invite.id && (
                               <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 rounded animate-pulse">Copied!</span>
                             )}
                           </div>
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{invite.role}</p>
                        </div>
                     </div>
                     <div className={`flex items-center gap-4 ${isAr ? 'flex-row-reverse' : ''}`}>
                        <button 
                          onClick={() => handleCopyLink(invite.token, invite.id)}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                          title="Copy Link"
                        >
                           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/></svg>
                        </button>
                        <span className="text-[9px] font-bold bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-full border border-indigo-100 hidden sm:block">
                           {invite.status}
                        </span>
                        <button 
                          onClick={() => setInvitations(invitations.filter(i => i.id !== invite.id))}
                          className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                        </button>
                     </div>
                  </div>
                ))}
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default TeamWorkspace;
