import React from 'react';
import { TenderAnalysis, SubscriptionTier, Language } from '../types.ts';
import { translations } from '../translations.ts';

interface AnalysisResultProps {
  analysis: TenderAnalysis;
  onGenerate: () => void;
  isGenerating: boolean;
  tier: SubscriptionTier;
  lang: Language;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ analysis, onGenerate, isGenerating, tier, lang }) => {
  const isFree = tier === SubscriptionTier.FREE;
  const isEnterprise = tier === SubscriptionTier.ENTERPRISE;
  const t = translations[lang];
  const isAr = lang === Language.AR;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className={`flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6 ${isAr ? 'md:flex-row-reverse' : ''}`}>
        <div className={isAr ? 'text-right' : 'text-left'}>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">{analysis.title}</h2>
          <div className={`flex items-center gap-3 mt-1 ${isAr ? 'flex-row-reverse' : ''}`}>
             <p className="text-slate-500 font-medium">{isAr ? 'اكتمل المسح العميق بنجاح' : 'Deep Scan completed successfully'}</p>
             {isEnterprise && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 border border-indigo-100 rounded-lg text-indigo-700 text-[10px] font-bold animate-pulse">
                   <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></div>
                   {t.ragActiveBadge}
                </div>
             )}
          </div>
        </div>
        <div className={`flex items-center space-x-4 rtl:space-x-reverse ${isAr ? 'flex-row-reverse' : ''}`}>
          {isFree && (
            <span className="text-[10px] font-bold text-dayone-orange bg-orange-50 px-3 py-1.5 rounded-full border border-orange-100 uppercase tracking-widest">
              {isAr ? 'ميزة برو' : 'Pro Feature'}
            </span>
          )}
          <button 
            onClick={onGenerate}
            disabled={isGenerating}
            className="bg-slate-900 hover:bg-black disabled:bg-slate-300 text-white px-10 py-4 rounded-2xl font-bold shadow-2xl shadow-slate-200 transition-all flex items-center space-x-3"
          >
            <span>{isFree ? (isAr ? 'ترقية للإنشاء' : 'Upgrade to Generate') : (isAr ? 'إنشاء رد كامل' : 'Generate Full Response')}</span>
            <svg className="w-5 h-5 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
            <h3 className={`text-lg font-extrabold mb-6 flex items-center text-slate-900 ${isAr ? 'flex-row-reverse' : ''}`}>
              <svg className={`w-5 h-5 text-dayone-orange ${isAr ? 'ml-3' : 'mr-3'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {isAr ? 'المواصفات الفنية' : 'Technical Specifications'}
            </h3>
            <ul className="space-y-4">
              {analysis.technicalSpecs.map((spec, i) => (
                <li key={i} className={`flex items-start text-slate-600 font-medium text-sm leading-relaxed ${isAr ? 'flex-row-reverse text-right' : ''}`}>
                  <span className={`font-bold text-dayone-orange ${isAr ? 'ml-3' : 'mr-3'}`}>•</span> {spec}
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
            <h3 className={`text-lg font-extrabold mb-6 flex items-center text-slate-900 ${isAr ? 'flex-row-reverse' : ''}`}>
              <svg className={`w-5 h-5 text-dayone-orange ${isAr ? 'ml-3' : 'mr-3'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /></svg>
              {isAr ? 'معايير التقييم' : 'Scoring Criteria'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analysis.scoringCriteria.map((criterion, i) => (
                <div key={i} className={`p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm font-bold text-slate-700 leading-snug ${isAr ? 'text-right' : 'text-left'}`}>
                  {criterion}
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <section className="bg-red-50 p-8 rounded-[32px] border border-red-100 shadow-sm">
            <h3 className={`text-lg font-extrabold text-red-900 mb-6 flex items-center ${isAr ? 'flex-row-reverse' : ''}`}>
              <svg className={`w-5 h-5 ${isAr ? 'ml-3' : 'mr-3'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              {isAr ? 'مخاطر الامتثال' : 'Compliance Risks'}
            </h3>
            <div className="space-y-4">
              {analysis.riskAlerts.map((risk, i) => (
                <div key={i} className={`bg-white p-5 rounded-2xl border border-red-200 ${isAr ? 'text-right' : 'text-left'}`}>
                  <div className={`flex justify-between items-center mb-3 ${isAr ? 'flex-row-reverse' : ''}`}>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-widest ${
                      risk.level === 'High' ? 'bg-red-600 text-white' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {risk.level} Risk
                    </span>
                  </div>
                  <p className="text-sm font-extrabold text-slate-900 mb-2">{risk.clause}</p>
                  <p className="text-xs text-red-600 font-bold italic">{risk.risk}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
            <h3 className={`text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.2em] mb-8 ${isAr ? 'text-right' : 'text-left'}`}>
              {isAr ? 'بيانات حيوية' : 'Vital Intel'}
            </h3>
            <div className="space-y-8">
              <div className={isAr ? 'text-right' : 'text-left'}>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">{isAr ? 'الموعد النهائي' : 'Deadline'}</label>
                <p className="text-lg font-extrabold text-slate-900 tracking-tight">{analysis.deadlines}</p>
              </div>
              <div className={isAr ? 'text-right' : 'text-left'}>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">{isAr ? 'العقوبات' : 'Penalties'}</label>
                <p className="font-bold text-slate-700 leading-relaxed">{analysis.penalties}</p>
              </div>
              <div className={isAr ? 'text-right' : 'text-left'}>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">{isAr ? 'الشهادات المطلوبة' : 'Required Certs'}</label>
                <div className={`flex flex-wrap gap-2 mt-3 ${isAr ? 'justify-end' : 'justify-start'}`}>
                  {analysis.certifications.map((c, i) => (
                    <span key={i} className="text-[10px] font-bold bg-slate-900 text-white px-3 py-1.5 rounded-lg border border-slate-900 tracking-tighter shadow-lg shadow-slate-100">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResult;