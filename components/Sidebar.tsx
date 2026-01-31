
import React from 'react';
import { ViewState, Jurisdiction, UserSubscription, SubscriptionTier, Language } from '../types';

interface SidebarProps {
  activeView: ViewState;
  setActiveView: (view: ViewState) => void;
  jurisdiction: Jurisdiction;
  setJurisdiction: (j: Jurisdiction) => void;
  subscription: UserSubscription;
  isOpen: boolean;
  lang: Language;
  setLang: (l: Language) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeView, 
  setActiveView, 
  jurisdiction, 
  setJurisdiction, 
  subscription,
  isOpen,
  lang,
  setLang
}) => {
  const menuItems = [
    { id: 'dashboard', label: lang === Language.EN ? 'Overview' : (lang === Language.FR ? 'Tableau de Bord' : 'نظرة عامة'), icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'analysis', label: lang === Language.EN ? 'Tender Analysis' : (lang === Language.FR ? 'Analyse Offre' : 'تحليل المناقصة'), icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { id: 'generator', label: lang === Language.EN ? 'Response Builder' : (lang === Language.FR ? 'Générateur Réponse' : 'منشئ الردود'), icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
    { id: 'image-editor', label: lang === Language.EN ? 'Asset Designer' : (lang === Language.FR ? 'Design Assets' : 'مصمم الأصول'), icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { id: 'pricing', label: lang === Language.EN ? 'Plan & Billing' : (lang === Language.FR ? 'Abonnement' : 'الاشتراكات والفوترة'), icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'settings', label: lang === Language.EN ? 'Company Profile' : (lang === Language.FR ? 'Profil Entreprise' : 'ملف الشركة'), icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
  ];

  const isAr = lang === Language.AR;

  return (
    <aside className={`
      fixed lg:sticky top-0 ${isAr ? 'right-0 lg:right-auto' : 'left-0'} z-50 h-screen w-72 bg-white border-r border-l border-slate-100 flex flex-col transition-transform duration-300 transform
      ${isOpen ? 'translate-x-0' : (isAr ? 'translate-x-full lg:translate-x-0' : '-translate-x-full lg:translate-x-0')}
    `}>
      <div className="p-8">
        <div className="flex items-center space-x-3 rtl:space-x-reverse mb-10">
          <div className="w-9 h-9 bg-[#0066FF] rounded-xl flex items-center justify-center text-white font-bold text-lg">TL</div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">TenderLogic</span>
        </div>
        
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-4 px-2 rtl:text-right">
            {isAr ? 'الاختصاص القضائي' : 'Jurisdiction'}
          </p>
          <select 
            value={jurisdiction}
            onChange={(e) => setJurisdiction(e.target.value as Jurisdiction)}
            className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 px-4 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-[#0066FF]/20 focus:outline-none transition-all cursor-pointer rtl:text-right"
          >
            <option value={Jurisdiction.MOROCCO}>{lang === Language.EN ? 'Morocco' : (lang === Language.FR ? 'Maroc' : 'المغرب')}</option>
            <option value={Jurisdiction.EU}>{lang === Language.EN ? 'European Union' : (lang === Language.FR ? 'Union Européenne' : 'الاتحاد الأوروبي')}</option>
            <option value={Jurisdiction.USA}>{lang === Language.EN ? 'United States' : (lang === Language.FR ? 'États-Unis' : 'الولايات المتحدة')}</option>
            <option value={Jurisdiction.UK}>{lang === Language.EN ? 'United Kingdom' : (lang === Language.FR ? 'Royaume-Uni' : 'المملكة المتحدة')}</option>
          </select>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as ViewState)}
              className={`w-full flex items-center space-x-3 rtl:space-x-reverse px-4 py-3 rounded-xl text-sm font-semibold transition-all group ${
                isActive 
                  ? 'bg-[#0066FF] text-white shadow-lg shadow-[#0066FF]/20' 
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <svg className={`w-5 h-5 transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
              </svg>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Language Switcher in Mobile Sidebar */}
      <div className="lg:hidden px-8 py-4 border-t border-slate-50">
         <div className="flex bg-slate-100 rounded-lg p-1 w-full">
            <button 
              onClick={() => setLang(Language.EN)}
              className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${lang === Language.EN ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
            >
              EN
            </button>
            <button 
              onClick={() => setLang(Language.FR)}
              className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${lang === Language.FR ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
            >
              FR
            </button>
            <button 
              onClick={() => setLang(Language.AR)}
              className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${lang === Language.AR ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
            >
              AR
            </button>
         </div>
      </div>

      <div className="p-6">
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
          <div className="flex items-center justify-between rtl:flex-row-reverse mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">{subscription.tier} {isAr ? 'خطة' : 'Plan'}</span>
            <div className={`w-2 h-2 rounded-full ${subscription.tier === SubscriptionTier.FREE ? 'bg-slate-300' : 'bg-green-500 animate-pulse'}`}></div>
          </div>
          <p className="text-[13px] font-semibold text-slate-800 rtl:text-right">
            {subscription.maxTenders 
              ? `${subscription.maxTenders - subscription.tendersUsed} ${isAr ? 'رصيد متبقي' : 'Credits left'}` 
              : (isAr ? 'وصول غير محدود' : 'Unlimited Access')}
          </p>
          {subscription.tier === SubscriptionTier.FREE && (
             <button 
              onClick={() => setActiveView('pricing')}
              className="mt-4 w-full py-2.5 bg-white border border-slate-200 text-[#0066FF] text-xs font-bold rounded-xl hover:border-[#0066FF] transition-all"
             >
               {lang === Language.EN ? 'Upgrade Account' : (lang === Language.FR ? 'Mettre à niveau' : 'ترقية الحساب')}
             </button>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
