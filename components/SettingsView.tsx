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

  const inputClass = `mt-1 block w-full rounded-xl border-slate-200 bg-slate-50 shadow-sm focus:border-dayone-orange focus:ring-dayone-orange sm:text-sm p-3 border transition-all ${isAr ? 'text-right' : 'text-left'}`;
  const labelClass = `block text-sm font-bold text-slate-700 mb-1 ${isAr ? 'text-right' : 'text-left'}`;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
        <div className={`flex flex-col md:flex-row justify-between items-start md:items-center mb-10 border-b border-slate-50 pb-8 gap-6 ${isAr ? 'md:flex-row-reverse' : ''}`}>
          <div className={isAr ? 'text-right' : 'text-left'}>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">{isAr ? 'ملف ذكاء الشركة' : 'Company Intelligence Profile'}</h2>
            <p className="text-slate-500 text-sm font-medium mt-1">{isAr ? 'تُستخدم هذه البيانات بواسطة Gemini لتفصيل المقترحات الفنية.' : 'This data is used by Gemini to tailor technical proposals.'}</p>
          </div>
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            {isSaved && (
              <span className="text-emerald-600 text-sm font-bold flex items-center animate-bounce">
                <svg className="w-4 h-4 mr-1 rtl:ml-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                {isAr ? 'تم حفظ التغييرات' : 'Changes Saved'}
              </span>
            )}
            <button 
              onClick={handleSave}
              className="bg-slate-900 hover:bg-black text-white px-10 py-3 rounded-2xl font-bold shadow-xl shadow-slate-200 transition-all"
            >
              {isAr ? 'حفظ الملف' : 'Save Profile'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-8">
            <h3 className={`text-lg font-extrabold text-slate-900 flex items-center ${isAr ? 'flex-row-reverse' : ''}`}>
              <span className={`w-8 h-8 rounded-lg bg-orange-100 text-dayone-orange flex items-center justify-center text-sm ${isAr ? 'ml-3' : 'mr-3'}`}>01</span>
              {isAr ? 'الهوية والتاريخ' : 'Identity & History'}
            </h3>
            
            <div>
              <label className={labelClass}>{isAr ? 'الاسم القانوني للكيان' : 'Legal Entity Name'}</label>
              <input type="text" className={inputClass} value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
            </div>

            <div>
              <label className={labelClass}>{isAr ? 'بيان خبرة الشركة' : 'Company Experience Statement'}</label>
              <textarea rows={4} className={inputClass} value={formData.experience} onChange={(e) => setFormData({...formData, experience: e.target.value})} />
            </div>
          </div>

          <div className="space-y-8">
            <h3 className={`text-lg font-extrabold text-slate-900 flex items-center ${isAr ? 'flex-row-reverse' : ''}`}>
              <span className={`w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm ${isAr ? 'ml-3' : 'mr-3'}`}>02</span>
              {isAr ? 'الأصول التقنية' : 'Technical Assets'}
            </h3>

            <div>
              <label className={labelClass}>{isAr ? 'الشهادات (واحدة لكل سطر)' : 'Certifications (One per line)'}</label>
              <textarea rows={4} className={`${inputClass} font-mono text-xs`} value={formData.certifications} onChange={(e) => setFormData({...formData, certifications: e.target.value})} />
            </div>

            <div>
              <label className={labelClass}>{isAr ? 'المشاريع المرجعية' : 'Reference Projects'}</label>
              <textarea rows={4} className={`${inputClass} font-mono text-xs`} value={formData.pastProjects} onChange={(e) => setFormData({...formData, pastProjects: e.target.value})} />
            </div>
          </div>
        </div>

        {/* RAG SECTION */}
        <div className="mt-16 pt-10 border-t border-slate-50">
           <div className={`flex flex-col md:flex-row justify-between items-start mb-8 gap-4 ${isAr ? 'md:flex-row-reverse' : ''}`}>
              <div className={isAr ? 'text-right' : 'text-left'}>
                 <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                    <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                    {t.ragSourceTitle}
                 </h3>
                 <p className="text-slate-500 text-sm font-medium mt-1">{t.ragSourceDesc}</p>
              </div>
              <div className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${isEnterprise ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' : 'bg-slate-100 text-slate-400 border border-slate-200'}`}>
                 {isEnterprise ? (isAr ? 'ميزة المؤسسات نشطة' : 'Enterprise Feature Active') : (isAr ? 'ميزة المؤسسات فقط' : 'Enterprise Only')}
              </div>
           </div>

           <div className="relative">
              {!isEnterprise && (
                 <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 rounded-2xl flex items-center justify-center border border-slate-100 shadow-inner">
                    <div className="text-center p-6">
                       <svg className="w-12 h-12 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                       <p className="text-slate-900 font-extrabold mb-1">{isAr ? 'محتوى مغلق' : 'Feature Locked'}</p>
                       <p className="text-slate-500 text-xs font-medium">{isAr ? 'قم بالترقية إلى Enterprise لتمكين تدريب RAG المخصص.' : 'Upgrade to Enterprise to enable custom RAG training.'}</p>
                    </div>
                 </div>
              )}
              <textarea 
                rows={10} 
                disabled={!isEnterprise}
                className={`${inputClass} font-serif text-sm leading-relaxed ${!isEnterprise ? 'opacity-40' : ''}`} 
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