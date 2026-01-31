import React from 'react';
import { SubscriptionTier, UserSubscription, Language } from '../types.ts';
import { translations } from '../translations.ts';

interface PricingViewProps {
  subscription: UserSubscription;
  onUpgrade: (tier: SubscriptionTier) => void;
  lang: Language;
}

const PricingView: React.FC<PricingViewProps> = ({ subscription, onUpgrade, lang }) => {
  const t = translations[lang || 'en'];

  return (
    <div className="max-w-6xl mx-auto space-y-20 animate-in fade-in slide-in-from-bottom-6 duration-700 py-12">
      <div className="text-center">
        <h2 className="text-5xl font-extrabold text-slate-900 tracking-tighter">{t.pricingHeading}</h2>
        <p className="mt-6 text-xl text-slate-500 font-medium">{t.pricingSubheading}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {t.pricingPlans.map((plan: any) => {
          const isCurrent = subscription.tier === plan.id;
          const isPro = plan.popular;
          
          return (
            <div 
              key={plan.id}
              className={`relative bg-white rounded-[40px] border p-12 flex flex-col transition-all duration-500 hover:scale-[1.03] ${
                isPro ? 'border-dayone-orange ring-8 ring-orange-50 dayone-shadow shadow-orange-100/50 scale-[1.05] z-10' : 'border-slate-100 dayone-shadow'
              }`}
            >
              {isPro && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-dayone-orange text-white px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">
                  Most Popular
                </div>
              )}
              
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-slate-900">{plan.name}</h3>
                <p className="text-[12px] text-slate-400 mt-2 font-bold uppercase tracking-widest">{plan.tag}</p>
                <div className="mt-8 flex items-baseline justify-center md:justify-start">
                  <span className="text-5xl font-extrabold text-slate-900 tracking-tighter">{plan.price}</span>
                  <span className="text-slate-400 ml-2 font-bold text-sm">{plan.unit}</span>
                </div>
              </div>

              <div className="space-y-5 mb-12 flex-1">
                {plan.features.map((feature: string, idx: number) => (
                  <div key={idx} className="flex items-center text-[14px] font-semibold text-slate-600">
                    <div className={`w-5 h-5 rounded-full mr-4 flex items-center justify-center flex-shrink-0 ${isPro ? 'bg-dayone-orange text-white' : 'bg-slate-100 text-slate-400'}`}>
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    {feature}
                  </div>
                ))}
              </div>

              <button
                disabled={isCurrent}
                onClick={() => onUpgrade(plan.id as SubscriptionTier)}
                className={`w-full py-5 rounded-[24px] font-bold text-[15px] transition-all ${
                  isCurrent 
                    ? 'bg-slate-50 text-slate-300 cursor-default border border-slate-100' 
                    : isPro
                      ? 'bg-dayone-orange text-white hover:opacity-90 shadow-xl shadow-orange-200'
                      : 'bg-slate-900 text-white hover:bg-black shadow-xl shadow-slate-200'
                }`}
              >
                {isCurrent ? 'Current Plan' : plan.button}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PricingView;