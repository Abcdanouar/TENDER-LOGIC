
import React, { useState } from 'react';
import { SubscriptionTier, Language } from '../types';
import { translations } from '../translations';
import { PRICING_TIERS } from '../constants';

interface CheckoutModalProps {
  tierId: SubscriptionTier;
  onClose: () => void;
  onSuccess: () => void;
  lang: Language;
}

type PaymentMethod = 'CARD' | 'PAYPAL' | 'TRANSFER' | 'CMI';

const CheckoutModal: React.FC<CheckoutModalProps> = ({ tierId, onClose, onSuccess, lang }) => {
  const t = translations[lang];
  const plan = PRICING_TIERS.find(p => p.id === tierId);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [method, setMethod] = useState<PaymentMethod>('CARD');
  const isAr = lang === Language.AR;

  const handlePay = () => {
    setIsProcessing(true);
    // Simulate API call to payment provider
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 2000);
    }, 2500);
  };

  if (!plan) return null;

  const methods: { id: PaymentMethod; label: string; icon: React.ReactNode }[] = [
    { 
      id: 'CARD', 
      label: t.methodCard, 
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg> 
    },
    { 
      id: 'CMI', 
      label: t.methodCMI, 
      icon: <div className="w-5 h-5 bg-orange-500 rounded flex items-center justify-center text-[8px] font-bold text-white">CMI</div> 
    },
    { 
      id: 'PAYPAL', 
      label: t.methodPaypal, 
      icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M7.076 21.337H2.47a.641.641 0 01-.633-.74L4.944 3.723a1.66 1.66 0 011.64-1.402h11.009c1.983 0 3.302 1.219 3.418 3.043.154 2.436-1.411 4.025-3.91 4.025H12.92a.641.641 0 00-.631.526l-1.12 7.074a.641.641 0 01-.632.548H7.076z"/></svg> 
    },
    { 
      id: 'TRANSFER', 
      label: t.methodTransfer, 
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg> 
    },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-xl rounded-[48px] shadow-2xl overflow-hidden relative flex flex-col animate-in zoom-in-95 duration-500">
        
        {/* Header */}
        <div className="p-10 pb-6 border-b border-slate-50 flex justify-between items-start">
           <div className={isAr ? 'text-right' : 'text-left'}>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight uppercase">{t.checkoutTitle}</h2>
              <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-1">Transaction ID: TX-{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
           </div>
           <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
           </button>
        </div>

        {/* Content */}
        <div className="p-10 space-y-8 flex-1 overflow-y-auto max-h-[70vh]">
          {/* Summary Card */}
          <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 flex items-center justify-between rtl:flex-row-reverse">
             <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{t.checkoutPlan}</p>
                <h4 className="text-xl font-extrabold text-slate-900">{plan.name}</h4>
             </div>
             <div className="text-right rtl:text-left">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{t.checkoutTotal}</p>
                <h4 className="text-2xl font-extrabold text-dayone-orange">{plan.price}</h4>
             </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-4">
             <label className={`text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] block ${isAr ? 'text-right' : 'text-left'}`}>
               {t.paymentMethodLabel}
             </label>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {methods.map((m) => (
                  <button 
                    key={m.id}
                    onClick={() => setMethod(m.id)}
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${
                      method === m.id 
                        ? 'border-dayone-orange bg-orange-50/50 text-dayone-orange shadow-inner' 
                        : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                     <div className={`mb-2 ${method === m.id ? 'text-dayone-orange' : 'text-slate-400'}`}>
                       {m.icon}
                     </div>
                     <span className="text-[10px] font-bold uppercase whitespace-nowrap">{m.label}</span>
                  </button>
                ))}
             </div>
          </div>

          {/* Contextual Forms */}
          <div className="animate-in fade-in duration-300">
            {(method === 'CARD' || method === 'CMI') && (
              <div className="space-y-6">
                <div className={isAr ? 'text-right' : 'text-left'}>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2 block">{t.checkoutCardNumber}</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="**** **** **** 4242" 
                        readOnly
                        className="w-full bg-white border border-slate-200 rounded-2xl p-4 font-mono text-lg text-slate-900 focus:ring-4 focus:ring-dayone-orange/10 focus:border-dayone-orange outline-none transition-all"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center space-x-2 rtl:left-4 rtl:right-auto">
                          <div className="w-8 h-5 bg-slate-200 rounded"></div>
                          <div className="w-8 h-5 bg-slate-100 rounded"></div>
                      </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className={isAr ? 'text-right' : 'text-left'}>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2 block">{t.checkoutExpiry}</label>
                      <input 
                        type="text" 
                        placeholder="12 / 28" 
                        readOnly
                        className="w-full bg-white border border-slate-200 rounded-2xl p-4 font-mono text-lg text-slate-900 focus:ring-4 focus:ring-dayone-orange/10 focus:border-dayone-orange outline-none transition-all"
                      />
                    </div>
                    <div className={isAr ? 'text-right' : 'text-left'}>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2 block">{t.checkoutCVV}</label>
                      <input 
                        type="text" 
                        placeholder="***" 
                        readOnly
                        className="w-full bg-white border border-slate-200 rounded-2xl p-4 font-mono text-lg text-slate-900 focus:ring-4 focus:ring-dayone-orange/10 focus:border-dayone-orange outline-none transition-all"
                      />
                    </div>
                </div>
              </div>
            )}

            {method === 'PAYPAL' && (
               <div className="p-8 bg-blue-50/50 rounded-3xl border border-blue-100 flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white mb-4">
                     <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M7.076 21.337H2.47a.641.641 0 01-.633-.74L4.944 3.723a1.66 1.66 0 011.64-1.402h11.009c1.983 0 3.302 1.219 3.418 3.043.154 2.436-1.411 4.025-3.91 4.025H12.92a.641.641 0 00-.631.526l-1.12 7.074a.641.641 0 01-.632.548H7.076z"/></svg>
                  </div>
                  <p className="text-sm font-bold text-blue-900">{isAr ? 'سيتم توجيهك إلى بايبال' : 'Redirecting to PayPal securely'}</p>
                  <p className="text-[10px] text-blue-500 font-medium mt-1">{isAr ? 'تأكد من تسجيل الدخول في المتصفح' : 'Please ensure pop-ups are allowed'}</p>
               </div>
            )}

            {method === 'TRANSFER' && (
               <div className="p-8 bg-slate-50 rounded-3xl border border-slate-200 text-center">
                  <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white mb-4 mx-auto">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
                  </div>
                  <p className="text-sm font-bold text-slate-900">{t.methodTransfer}</p>
                  <p className="text-xs text-slate-500 font-medium mt-2">{t.transferDetails}</p>
                  <div className="mt-4 p-3 bg-white border border-slate-100 rounded-xl text-[10px] font-mono text-slate-400 select-all">
                    RIB: 007 123 0000 4567 8901 2345 67
                  </div>
               </div>
            )}
          </div>

          {/* Action */}
          <button 
            onClick={handlePay}
            disabled={isProcessing || isSuccess}
            className={`w-full py-5 rounded-2xl font-extrabold text-lg shadow-xl transition-all relative overflow-hidden ${
              isSuccess 
                ? 'bg-emerald-500 text-white shadow-emerald-200' 
                : 'bg-slate-900 text-white shadow-slate-200 hover:bg-black active:scale-95'
            }`}
          >
             {isProcessing ? (
               <div className="flex items-center justify-center space-x-3">
                 <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
                 <span>{t.checkoutProcessing}</span>
               </div>
             ) : isSuccess ? (
                <div className="flex items-center justify-center space-x-3 animate-in fade-in duration-500">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                   <span>{t.checkoutSuccess}</span>
                </div>
             ) : (
                <span>{method === 'PAYPAL' ? (isAr ? 'دفع بواسطة بايبال' : 'Pay with PayPal') : t.checkoutPayNow}</span>
             )}
          </button>
        </div>

        {/* Footer */}
        <div className="p-8 bg-slate-50 border-t border-slate-100 flex items-center justify-center space-x-6 text-slate-400">
           <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
              <span className="text-[10px] font-bold uppercase tracking-widest">SSL Secure</span>
           </div>
           <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/></svg>
              <span className="text-[10px] font-bold uppercase tracking-widest">PCI DSS</span>
           </div>
        </div>

        {isSuccess && (
           <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
              <div className="w-full h-full animate-[ping_2s_ease-in-out_infinite] bg-emerald-400/5 rounded-full"></div>
           </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutModal;
