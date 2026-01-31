
import React from 'react';
import { SubscriptionTier, UserSubscription } from '../types';
import { PRICING_TIERS } from '../constants';

interface PricingViewProps {
  subscription: UserSubscription;
  onUpgrade: (tier: SubscriptionTier) => void;
}

const PricingView: React.FC<PricingViewProps> = ({ subscription, onUpgrade }) => {
  return (
    <div className="max-w-6xl mx-auto space-y-20 animate-in fade-in slide-in-from-bottom-6 duration-700 py-12">
      <div className="text-center">
        <h2 className="text-5xl font-extrabold text-slate-900 tracking-tighter">Choose your bidding edge.</h2>
        <p className="mt-6 text-xl text-slate-500 font-medium">Transparent pricing for growing procurement teams.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {PRICING_TIERS.map((tier) => {
          const isCurrent = subscription.tier === tier.id;
          const isPro = tier.id === SubscriptionTier.PRO;
          
          return (
            <div 
              key={tier.id}
              className={`relative bg-white rounded-[40px] border p-12 flex flex-col transition-all duration-500 hover:scale-[1.03] ${
                isPro ? 'border-[#0066FF] ring-8 ring-[#0066FF]/5 dayone-shadow shadow-[#0066FF]/10' : 'border-slate-100 dayone-shadow'
              }`}
            >
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-slate-900">{tier.name}</h3>
                <p className="text-[14px] text-slate-400 mt-2 font-medium leading-relaxed">{tier.description}</p>
                <div className="mt-8 flex items-baseline">
                  <span className="text-5xl font-extrabold text-slate-900 tracking-tighter">{tier.price}</span>
                  {tier.price !== 'Custom' && tier.id !== SubscriptionTier.FREE && (
                    <span className="text-slate-400 ml-2 font-bold text-sm">/mo</span>
                  )}
                </div>
              </div>

              <div className="space-y-5 mb-12 flex-1">
                {tier.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center text-[14px] font-semibold text-slate-600">
                    <div className={`w-5 h-5 rounded-full mr-4 flex items-center justify-center ${isPro ? 'bg-[#0066FF] text-white' : 'bg-slate-100 text-slate-400'}`}>
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
                onClick={() => onUpgrade(tier.id)}
                className={`w-full py-5 rounded-[24px] font-bold text-[15px] transition-all ${
                  isCurrent 
                    ? 'bg-slate-50 text-slate-300 cursor-default border border-slate-100' 
                    : isPro
                      ? 'bg-[#0066FF] text-white hover:bg-blue-700 shadow-xl shadow-blue-200'
                      : 'bg-slate-900 text-white hover:bg-black shadow-xl shadow-slate-200'
                }`}
              >
                {isCurrent ? 'Current Plan' : 'Select Plan'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PricingView;
