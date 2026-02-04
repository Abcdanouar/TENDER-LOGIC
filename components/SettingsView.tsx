
import React, { useState } from 'react';
import { CompanyProfile, SubscriptionTier, Language } from '../types.ts';
import { translations } from '../translations.ts';

interface SettingsViewProps {
  profile: CompanyProfile;
  onSave: (profile: CompanyProfile) => void;
  tier: SubscriptionTier;
  lang: Language;
}

const SettingsView: React.FC<SettingsViewProps> = ({ profile, onSave, tier, lang }) => {
  const t = translations[lang];
  const [formData, setFormData] = useState({
    name: profile.name,
    experience: profile.experience,
    certifications: profile.certifications.join('\n'),
    pastProjects: profile.pastProjects.join('\n'),
    bidHistory: profile.bidHistory || ''
  });

  const [isSaved, setIsSaved] = useState(false);
  const isEnterprise = tier === SubscriptionTier.ENTERPRISE;
  const isAr = lang === Language.AR;

  const handleSave = () => {
    onSave({
      name: formData.name,
      experience: formData.experience,
      certifications: formData.certifications.split('\n').filter(s => s.trim() !== ''),
      pastProjects: formData.pastProjects.split('\n').filter(s => s.trim() !== ''),
      bidHistory: isEnterprise ? formData.bidHistory : undefined
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const inputClass = `mt-1 block w-full rounded-2xl border-slate-200 bg-slate-50 shadow-sm focus:border-dayone-orange focus:ring-4 focus:ring-dayone-orange/10 sm:text-sm p-4 border transition-all outline-none font-medium text-slate-900 ${isAr ? 'text-right' : 'text-left'}`;
  const labelClass = `block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ${isAr ? 'text-right' : 'text-left'}`;

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white p-8 md:p-12 rounded-[40px] border border-slate-100 shadow-sm">
        
        {/* Header Section */}
        <div className={`flex flex-col md:flex-row justify-between items-start md:items-center mb-12 border-b border-slate-50 pb-10 gap-8 ${isAr ? 'md:flex-row-reverse' : ''}`}>
          <div className={isAr ? 'text-right' : 'text-left'}>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">{t.settingsTitle}</h2>
            <p className="text-slate-500 text-base font-medium mt-1.5">{t.settingsSub}</p>
          </div>
          <div className="flex items-center space-x-6 rtl:space-x-reverse">
            {isSaved && (
              <span className="text-emerald-600 text-sm font-bold flex items-center animate-bounce">
                <svg className="w-5 h-5 mr-2 rtl:ml-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {t.changesSaved}
              </span>
            )}
            <button 
              onClick={handleSave}
              className="bg-slate-900 hover:bg-black text-white px-12 py-4 rounded-2xl font-bold text-base shadow-xl shadow-slate-200 transition-all transform active:scale-[0.98]"
            >
              {t.saveProfile}
            </button>
          </div>
        </div>

        {/* Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* Section 1: Identity */}
          <div className="space-y-10">
            <h3 className={`text-xl font-extrabold text-slate-900 flex items-center ${isAr ? 'flex-row-reverse' : ''}`}>
              <span className={`w-10 h-10 rounded-xl bg-orange-50 text-dayone-orange flex items-center justify-center text-sm font-black ${isAr ? 'ml-4' : 'mr-4'} shadow-sm border border-orange-100`}>01</span>
              {t.identityHistory}
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className={labelClass}>{t.legalName}</label>
                <input 
                  type="text" 
                  className={inputClass} 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  placeholder="e.g. Elite Engineering Group Ltd"
                />
              </div>

              <div>
                <label className={labelClass}>{t.experienceStmt}</label>
                <textarea 
                  rows={6} 
                  className={inputClass} 
                  value={formData.experience} 
                  onChange={(e) => setFormData({...formData, experience: e.target.value})} 
                  placeholder="Describe your firm's core expertise and years in industry..."
                />
              </div>
            </div>
          </div>

          {/* Section 2: Assets */}
          <div className="space-y-10">
            <h3 className={`text-xl font-extrabold text-slate-900 flex items-center ${isAr ? 'flex-row-reverse' : ''}`}>
              <span className={`w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm font-black ${isAr ? 'ml-4' : 'mr-4'} shadow-sm border border-emerald-100`}>02</span>
              {t.technicalAssets}
            </h3>

            <div className="space-y-6">
              <div>
                <label className={labelClass}>{t.certsLabel}</label>
                <textarea 
                  rows={6} 
                  className={`${inputClass} font-mono text-xs`} 
                  value={formData.certifications} 
                  onChange={(e) => setFormData({...formData, certifications: e.target.value})} 
                  placeholder="ISO 9001:2015&#10;OHSAS 18001&#10;LEED Gold Certification..."
                />
              </div>

              <div>
                <label className={labelClass}>{t.projectsLabel}</label>
                <textarea 
                  rows={6} 
                  className={`${inputClass} font-mono text-xs`} 
                  value={formData.pastProjects} 
                  onChange={(e) => setFormData({...formData, pastProjects: e.target.value})} 
                  placeholder="Project Alpha - $40M Bridge Construction&#10;Smart City Rabat - Digital Infrastructure..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Enterprise RAG Section */}
        <div className="mt-20 pt-12 border-t border-slate-100">
           <div className={`flex flex-col md:flex-row justify-between items-start mb-10 gap-6 ${isAr ? 'md:flex-row-reverse' : ''}`}>
              <div className={isAr ? 'text-right' : 'text-left'}>
                 <h3 className={`text-xl font-extrabold text-slate-900 flex items-center gap-3 ${isAr ? 'flex-row-reverse' : ''}`}>
                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                    </svg>
                    {t.ragSourceTitle}
                 </h3>
                 <p className="text-slate-500 text-sm font-medium mt-1.5">{t.ragSourceDesc}</p>
              </div>
              <div className={`px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm border ${isEnterprise ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                 {isEnterprise ? t.enterpriseActive : t.enterpriseOnly}
              </div>
           </div>

           <div className="relative group">
              {!isEnterprise && (
                 <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 rounded-[32px] flex items-center justify-center border border-slate-100 shadow-inner">
                    <div className="text-center p-8 bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-slate-200 max-w-sm">
                       <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-slate-300">
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                          </svg>
                       </div>
                       <p className="text-slate-900 font-extrabold text-lg mb-2">{t.featureLocked}</p>
                       <p className="text-slate-500 text-sm font-medium leading-relaxed">{t.upgradeEnterpriseRag}</p>
                    </div>
                 </div>
              )}
              <textarea 
                rows={12} 
                disabled={!isEnterprise}
                className={`${inputClass} font-serif text-base leading-relaxed p-8 ${!isEnterprise ? 'opacity-40 grayscale pointer-events-none' : 'hover:border-indigo-200 focus:ring-indigo-500/10'}`} 
                placeholder={t.ragArchivePlaceholder}
                value={formData.bidHistory}
                onChange={(e) => setFormData({...formData, bidHistory: e.target.value})}
              />
           </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
