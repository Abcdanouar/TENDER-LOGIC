import React, { useEffect, useState } from 'react';
import { Language, SubscriptionTier } from '../types.ts';
import { translations, TranslationSet } from '../translations.ts';
import { GeminiService } from '../services/geminiService.ts';

interface LandingPageProps {
  onStart: () => void;
  lang: Language;
  setLang: (l: Language) => void;
  onSelectPlan: (tierId: SubscriptionTier) => void;
}

const GALLERY_SAMPLES = [
  { prompt: "High-speed rail station architecture, futuristic design, photorealistic, cinematic lighting", label: "Infrastructure" },
  { prompt: "Large scale offshore wind farm, stormy sea, professional engineering photography", label: "Energy" },
  { prompt: "Modern digital data center interior, glowing neon racks, clean aesthetic", label: "Technology" },
  { prompt: "Sustainable urban park development, smart city integration, high-end 3D render", label: "Urban Planning" }
];

const LandingPage: React.FC<LandingPageProps> = ({ onStart, lang, setLang, onSelectPlan }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [visualPrompt, setVisualPrompt] = useState('');
  const [generatedVisual, setGeneratedVisual] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [galleryImages, setGalleryImages] = useState<(string | null)[]>([null, null, null, null]);
  const t: TranslationSet = translations[lang];
  const gemini = new GeminiService();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    
    const loadGallery = async () => {
      const results = await Promise.all(GALLERY_SAMPLES.map(async (sample) => {
        try {
          return `https://images.unsplash.com/photo-${Math.random() > 0.5 ? '1486406146926-c627a92ad1ab' : '1504384308090-c894fdcc538d'}?auto=format&fit=crop&q=80&w=800`;
        } catch(e) { return null; }
      }));
      setGalleryImages(results);
    };
    loadGallery();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGenerateVisual = async () => {
    if (!visualPrompt) return;
    setIsGenerating(true);
    try {
      const result = await gemini.generateProjectVisual(visualPrompt);
      if (result) setGeneratedVisual(result);
    } catch (e) {
      console.error("Visual generation failed", e);
    } finally {
      setIsGenerating(false);
    }
  };

  const isAr = lang === Language.AR;

  return (
    <div className={`bg-white min-h-screen font-['Plus_Jakarta_Sans',_sans-serif] selection:bg-orange-100 ${isAr ? 'rtl' : 'ltr'}`}>
      {/* 1. GLOBAL HEADER */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-sm py-2' : 'bg-white py-4'} border-b border-slate-100`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between rtl:flex-row-reverse">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <div className="w-10 h-10 bg-slate-900 rounded flex items-center justify-center">
              <div className="grid grid-cols-2 gap-0.5">
                <div className="w-2.5 h-2.5 bg-blue-400"></div>
                <div className="w-2.5 h-2.5 bg-orange-500"></div>
                <div className="w-2.5 h-2.5 bg-emerald-400"></div>
                <div className="w-2.5 h-2.5 bg-red-400"></div>
              </div>
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-xl font-extrabold tracking-tighter text-slate-900 uppercase">TenderLogic</span>
              <span className="text-[10px] font-bold text-slate-500 tracking-[0.2em] uppercase">Global SaaS</span>
            </div>
          </div>

          <div className="hidden lg:flex items-center space-x-8 rtl:space-x-reverse text-[14px] font-bold text-slate-700">
            <a href="#features" className="hover:text-dayone-orange transition-colors">{t.navAiEngine}</a>
            <a href="#platform" className="hover:text-dayone-orange transition-colors">{t.navServices}</a>
            <a href="#visual-ai" className="hover:text-dayone-orange transition-colors">{isAr ? 'الذكاء المرئي' : 'Visual Intelligence'}</a>
            <a href="#jurisdictions" className="hover:text-dayone-orange transition-colors">{t.navJurisdiction}</a>
            <a href="#pricing" className="hover:text-dayone-orange transition-colors">{t.navPricing}</a>
            <div className="flex items-center bg-slate-100 rounded-lg p-0.5 rtl:flex-row-reverse">
              <button onClick={() => setLang(Language.EN)} className={`px-2 py-1 text-[10px] rounded ${lang === Language.EN ? 'bg-white shadow-sm' : ''}`}>EN</button>
              <button onClick={() => setLang(Language.FR)} className={`px-2 py-1 text-[10px] rounded ${lang === Language.FR ? 'bg-white shadow-sm' : ''}`}>FR</button>
              <button onClick={() => setLang(Language.AR)} className={`px-2 py-1 text-[10px] rounded ${lang === Language.AR ? 'bg-white shadow-sm' : ''}`}>AR</button>
            </div>
            <button onClick={onStart} className="bg-slate-900 text-white px-5 py-2 rounded-lg hover:bg-black transition-all">{t.signIn}</button>
          </div>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 text-slate-900">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-100 px-6 py-8 flex flex-col space-y-6 animate-in slide-in-from-top duration-300">
            <a href="#features" className="text-lg font-bold text-slate-900">{t.navAiEngine}</a>
            <a href="#platform" className="text-lg font-bold text-slate-900">{t.navServices}</a>
            <a href="#pricing" className="text-lg font-bold text-slate-900">{t.navPricing}</a>
            <div className="flex bg-slate-100 rounded-xl p-1">
              <button onClick={() => setLang(Language.EN)} className={`flex-1 py-3 font-bold rounded-lg ${lang === Language.EN ? 'bg-white shadow-sm' : ''}`}>EN</button>
              <button onClick={() => setLang(Language.FR)} className={`flex-1 py-3 font-bold rounded-lg ${lang === Language.FR ? 'bg-white shadow-sm' : ''}`}>FR</button>
              <button onClick={() => setLang(Language.AR)} className={`flex-1 py-3 font-bold rounded-lg ${lang === Language.AR ? 'bg-white shadow-sm' : ''}`}>AR</button>
            </div>
            <button onClick={onStart} className="bg-slate-900 text-white py-4 rounded-xl font-bold">{t.signIn}</button>
          </div>
        )}
      </nav>

      {/* 2. HERO SECTION */}
      <section className="pt-32 lg:pt-52 pb-24 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        <div className={`flex-1 space-y-6 lg:space-y-10 reveal text-center ${isAr ? 'lg:text-right' : 'lg:text-left'}`}>
          <div className="inline-block bg-orange-50 text-dayone-orange text-[11px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest border border-orange-100">
            {t.heroTag}
          </div>
          <h1 className="text-4xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1]">
            {t.heroTitle}
          </h1>
          <p className="text-base lg:text-xl text-slate-500 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium">
            {t.heroDesc}
          </p>
          <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-5 pt-4 rtl:space-x-reverse">
            <button 
              onClick={onStart}
              className="bg-dayone-orange text-white px-10 py-5 rounded-2xl font-bold text-lg hover:opacity-90 transition-all shadow-xl shadow-orange-100 flex items-center justify-center space-x-3"
            >
              <span>{t.startJourney}</span>
              <svg className="w-5 h-5 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
            </button>
            <button className="bg-white text-slate-900 border border-slate-200 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all shadow-sm">
              {t.successStories}
            </button>
          </div>
        </div>
        <div className="flex-1 w-full lg:w-auto relative reveal stagger-2 mt-8 lg:mt-0">
          <div className="relative animate-float">
            <div className="bg-slate-900 p-2 lg:p-3 rounded-[32px] shadow-2xl overflow-hidden">
              <div className="bg-slate-800 rounded-2xl overflow-hidden relative aspect-[4/3]">
                 <div className="absolute top-0 left-0 w-full h-10 bg-slate-700/50 flex items-center px-4 space-x-1.5 border-b border-slate-700/30">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-orange-400"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                 </div>
                 <img src="https://images.unsplash.com/photo-1551288049-bbdac8626ad1?auto=format&fit=crop&q=80&w=1200" alt="Platform Preview" className="w-full h-full object-cover opacity-90 pt-10" />
              </div>
            </div>
            <div className="absolute -top-10 -right-10 bg-white p-6 rounded-3xl shadow-2xl border border-slate-100 hidden lg:block animate-float stagger-1">
               <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600">
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <span className="font-bold text-slate-900 text-sm">99% Compliance</span>
               </div>
               <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="w-full h-full bg-emerald-500"></div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SHOWCASE GALLERY */}
      <section className="py-32 bg-slate-50 border-y border-slate-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
           <div className="text-center mb-20 reveal">
              <h2 className="text-3xl lg:text-5xl font-extrabold text-slate-900 mb-6">{t.galleryHeading}</h2>
              <p className="text-slate-500 max-w-2xl mx-auto font-medium">{t.gallerySubheading}</p>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {galleryImages.map((img, idx) => (
                <div key={idx} className="group relative bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-500 reveal" style={{ animationDelay: `${idx * 0.15}s` }}>
                   <div className="aspect-[3/4] overflow-hidden">
                      <img 
                        src={img || `https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800`} 
                        alt={GALLERY_SAMPLES[idx].label} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 grayscale-[20%] group-hover:grayscale-0"
                      />
                   </div>
                   <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-slate-900/80 to-transparent">
                      <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-bold rounded-full uppercase tracking-widest mb-2">{GALLERY_SAMPLES[idx].label}</span>
                      <p className="text-white font-bold text-sm leading-tight opacity-0 group-hover:opacity-100 transition-opacity duration-300">{GALLERY_SAMPLES[idx].prompt}</p>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* 4. PRICING SECTION - 3 TIERS */}
      <section id="pricing" className="py-40 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
           <div className="text-center mb-24 reveal">
              <h2 className="text-4xl lg:text-6xl font-extrabold text-slate-900 mb-8 tracking-tight uppercase leading-[0.9]">{t.pricingHeading}</h2>
              <p className="text-slate-500 text-lg lg:text-xl font-medium max-w-2xl mx-auto">{t.pricingSubheading}</p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
              {t.pricingPlans.map((plan: any, i: number) => (
                <div 
                  key={plan.name} 
                  className={`relative p-10 lg:p-12 rounded-[48px] border transition-all duration-500 flex flex-col h-full reveal ${
                    plan.popular 
                      ? 'bg-white border-dayone-orange shadow-2xl shadow-orange-100/50 scale-105 z-10' 
                      : 'bg-white border-slate-100 shadow-sm hover:shadow-xl'
                  }`}
                  style={{ animationDelay: `${i * 0.15}s` }}
                >
                   {plan.popular && (
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-dayone-orange text-white px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest whitespace-nowrap shadow-lg shadow-orange-200">
                         {isAr ? 'الأكثر طلباً' : 'Most Popular'}
                      </div>
                   )}
                   
                   <div className="mb-10 text-center">
                      <h4 className="text-2xl font-extrabold text-slate-900 mb-4">{plan.name}</h4>
                      <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-8">{plan.tag}</p>
                      <div className="flex items-baseline justify-center">
                         <span className="text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tighter">{plan.price}</span>
                         <span className="text-slate-400 font-bold ml-1 text-sm">{plan.unit}</span>
                      </div>
                   </div>

                   <ul className="space-y-5 mb-12 flex-1">
                      {plan.features.map((feat: string) => (
                        <li key={feat} className={`flex items-start text-slate-600 font-bold text-sm ${isAr ? 'flex-row-reverse text-right' : ''}`}>
                           <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${plan.popular ? 'bg-dayone-orange text-white' : 'bg-slate-100 text-slate-400'} ${isAr ? 'ml-3' : 'mr-3'}`}>
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
                           </div>
                           {feat}
                        </li>
                      ))}
                   </ul>

                   <button 
                     onClick={() => onSelectPlan(plan.id as SubscriptionTier)}
                     className={`w-full py-5 rounded-2xl font-bold text-lg transition-all ${
                       plan.popular 
                         ? 'bg-dayone-orange text-white shadow-xl shadow-orange-200 hover:opacity-90' 
                         : 'bg-slate-900 text-white hover:bg-black'
                     }`}
                   >
                     {plan.button}
                   </button>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* 5. VISUAL AI GENERATOR INTERACTIVE */}
      <section id="visual-ai" className="py-40 bg-[#fcfcfd] border-y border-slate-100 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
             <div className={`flex-1 w-full space-y-8 reveal ${isAr ? 'lg:text-right' : 'lg:text-left'}`}>
                <div className="inline-block px-4 py-1.5 bg-slate-900 text-white text-[11px] font-bold rounded-full uppercase tracking-widest mb-6">{t.deepLearningTag}</div>
                <h2 className="text-4xl lg:text-6xl font-extrabold text-slate-900 mb-8 tracking-tight leading-tight">{t.visualAiHeading}</h2>
                <p className="text-slate-500 text-lg lg:text-xl font-medium mb-12">{t.visualAiSubheading}</p>
                
                <div className="bg-white p-8 lg:p-10 rounded-[48px] border border-slate-100 shadow-2xl shadow-slate-100/50">
                   <h4 className="text-sm font-extrabold text-slate-900 mb-6 uppercase tracking-[0.2em] opacity-40">{t.visualAiPrompt}</h4>
                   <div className="space-y-6">
                      <div className="relative">
                         <input 
                           type="text" 
                           value={visualPrompt}
                           onChange={(e) => setVisualPrompt(e.target.value)}
                           placeholder={t.visualAiPlaceholder}
                           className={`w-full bg-[#f8fafc] border border-slate-100 rounded-2xl px-6 py-5 text-slate-900 font-bold focus:ring-4 focus:ring-dayone-orange/10 focus:border-dayone-orange transition-all outline-none ${isAr ? 'text-right' : 'text-left'}`}
                         />
                      </div>
                      <button 
                        onClick={handleGenerateVisual}
                        disabled={isGenerating || !visualPrompt}
                        className="w-full bg-dayone-orange text-white py-5 rounded-2xl font-bold text-lg hover:opacity-90 disabled:opacity-50 transition-all shadow-xl shadow-orange-100 flex items-center justify-center space-x-3"
                      >
                         {isGenerating ? (
                            <span className="flex items-center space-x-3">
                               <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                               <span>{isAr ? 'جاري الإنشاء...' : 'Creating Asset...'}</span>
                            </span>
                         ) : (
                            <>
                               <span>{t.visualAiButton}</span>
                               <svg className="w-5 h-5 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11l-7-7-7 7m14 6l-7-7-7 7" /></svg>
                            </>
                         )}
                      </button>
                   </div>
                </div>
             </div>

             <div className="flex-1 w-full reveal stagger-1">
                <div className="relative group">
                   <div className="bg-slate-900 rounded-[60px] p-3 shadow-2xl relative overflow-hidden aspect-video flex items-center justify-center border border-slate-800">
                      {generatedVisual ? (
                        <img 
                          src={generatedVisual} 
                          alt="Generated project visual" 
                          className="w-full h-full object-cover rounded-[50px] animate-in fade-in duration-1000" 
                        />
                      ) : (
                        <div className="text-center p-12">
                           <div className="w-20 h-20 bg-white/5 rounded-3xl mx-auto mb-6 flex items-center justify-center text-white/20 animate-pulse">
                              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                           </div>
                           <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-xs">Waiting for prompt input</p>
                        </div>
                      )}
                      {isGenerating && (
                         <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center">
                            <div className="flex flex-col items-center">
                               <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden mb-4">
                                  <div className="w-1/2 h-full bg-dayone-orange animate-[loading_2s_infinite]"></div>
                               </div>
                               <span className="text-white text-[10px] font-bold uppercase tracking-[0.3em]">{isAr ? 'الذكاء الاصطناعي يفكر...' : 'AI IS THINKING...'}</span>
                            </div>
                         </div>
                      )}
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* 6. STATISTICS */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl lg:text-5xl font-extrabold text-slate-900 mb-24 leading-snug max-w-4xl mx-auto tracking-tight">
            {t.statHeading}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="reveal">
              <p className="text-6xl lg:text-7xl font-extrabold text-dayone-orange mb-6 tracking-tighter uppercase">12B+</p>
              <p className="text-xl font-extrabold text-slate-900 mb-4 tracking-tight uppercase">{t.statValue}</p>
              <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-xs mx-auto">{t.statValueDesc}</p>
            </div>
            <div className="reveal stagger-1">
              <p className="text-6xl lg:text-7xl font-extrabold text-dayone-orange mb-6 tracking-tighter uppercase">450+</p>
              <p className="text-xl font-extrabold text-slate-900 mb-4 tracking-tight uppercase">{t.statMembers}</p>
              <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-xs mx-auto">{t.statMembersDesc}</p>
            </div>
            <div className="reveal stagger-2">
              <p className="text-6xl lg:text-7xl font-extrabold text-dayone-orange mb-6 tracking-tighter uppercase">98%</p>
              <p className="text-xl font-extrabold text-slate-900 mb-4 tracking-tight uppercase">{t.statWinRate}</p>
              <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-xs mx-auto">{t.statWinRateDesc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. PRODUCT FEATURES GRID */}
      <section id="features" className="py-32 px-6 bg-[#fcfcfd]">
        <div className="max-w-7xl mx-auto">
           <div className="text-center mb-24 reveal">
              <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6 uppercase tracking-tight">{t.featuresHeading}</h2>
              <p className="text-slate-500 max-w-2xl mx-auto text-lg font-medium">{t.featuresSubheading}</p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { title: t.feature1Title, desc: t.feature1Desc, icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
                { title: t.feature2Title, desc: t.feature2Desc, icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
                { title: t.feature3Title, desc: t.feature3Desc, icon: 'M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 00-1 1v1a2 2 0 11-4 0v-1a1 1 0 00-1-1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z' },
                { title: t.feature4Title, desc: t.feature4Desc, icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
                { title: t.feature5Title, desc: t.feature5Desc, icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
                { title: t.feature6Title, desc: t.feature6Desc, icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' }
              ].map((f, i) => (
                <div key={i} className={`bg-white p-10 rounded-[32px] shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-500 reveal ${isAr ? 'text-right' : 'text-left'}`} style={{ animationDelay: `${i * 0.1}s` }}>
                   <div className={`w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center mb-8 ${isAr ? 'mr-0 ml-auto' : 'mr-auto ml-0'}`}>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={f.icon} /></svg>
                   </div>
                   <h4 className="text-xl font-extrabold text-slate-900 mb-4">{f.title}</h4>
                   <p className="text-slate-500 text-sm font-medium leading-relaxed">{f.desc}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* 8. JURISDICTIONS SECTION */}
      <section id="jurisdictions" className="py-32 px-6 bg-slate-900 text-white rounded-[60px] mx-6 my-12 overflow-hidden relative">
        <div className="max-w-7xl mx-auto text-center reveal">
           <h2 className="text-4xl lg:text-6xl font-extrabold mb-10 tracking-tight">{t.jurisdictionsHeading}</h2>
           <p className="text-slate-400 max-w-3xl mx-auto text-lg lg:text-xl font-medium mb-24">{t.jurisdictionsSubheading}</p>
           
           <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-10">
              {[
                { name: t.jurisdiction1Name, desc: t.jurisdiction1Desc, icon: 'MA' },
                { name: t.jurisdiction2Name, desc: t.jurisdiction2Desc, icon: 'EU' },
                { name: t.jurisdiction3Name, desc: t.jurisdiction3Desc, icon: 'US' },
                { name: t.jurisdiction4Name, desc: t.jurisdiction4Desc, icon: 'UK' }
              ].map((j, i) => (
                <div key={i} className={`bg-white/5 backdrop-blur-md p-10 rounded-[32px] border border-white/10 hover:bg-white/10 transition-all group cursor-pointer ${isAr ? 'text-right' : 'text-left'}`}>
                   <div className={`w-12 h-12 bg-white/10 rounded-xl mb-8 flex items-center justify-center font-bold text-dayone-orange group-hover:scale-110 transition-transform ${isAr ? 'mr-0 ml-auto' : 'mr-auto ml-0'}`}>{j.icon}</div>
                   <h4 className="text-xl font-extrabold mb-4 tracking-tight">{j.name}</h4>
                   <p className="text-slate-400 text-xs font-medium leading-relaxed">{j.desc}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="pt-32 pb-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className={`flex flex-col items-center lg:items-start space-y-8 lg:space-y-0 lg:flex-row lg:justify-between mb-16 lg:mb-24 ${isAr ? 'lg:flex-row-reverse' : ''}`}>
             <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center">
                  <div className="grid grid-cols-2 gap-0.5">
                    <div className="w-3 h-3 bg-blue-400"></div>
                    <div className="w-3 h-3 bg-orange-500"></div>
                  </div>
                </div>
                <div className="flex flex-col leading-none">
                  <span className="text-2xl font-extrabold tracking-tighter text-slate-900 uppercase">TenderLogic</span>
                  <span className="text-[12px] font-bold text-slate-500 tracking-[0.2em] uppercase">Global SaaS</span>
                </div>
             </div>
             <div className="flex flex-wrap justify-center gap-12 text-sm font-extrabold text-slate-400 rtl:flex-row-reverse">
                <a href="#" className="hover:text-dayone-orange transition-colors">LinkedIn</a>
                <a href="#" className="hover:text-dayone-orange transition-colors">Platform Status</a>
                <a href="#" className="hover:text-dayone-orange transition-colors">Legal API</a>
                <a href="#" className="hover:text-dayone-orange transition-colors">Contact Engineering</a>
             </div>
          </div>

          <div className={`grid grid-cols-2 md:grid-cols-4 gap-12 mb-20 text-center border-t border-slate-50 pt-20 ${isAr ? 'lg:text-right' : 'lg:text-left'}`}>
            <div>
              <p className="font-extrabold text-slate-900 mb-8 uppercase text-xs tracking-[0.3em]">{t.footerCol1}</p>
              <ul className="space-y-5 text-sm font-bold text-slate-500">
                <li className="hover:text-dayone-orange cursor-pointer">AI Engine</li>
                <li className="hover:text-dayone-orange cursor-pointer">Response Editor</li>
              </ul>
            </div>
            <div>
              <p className="font-extrabold text-slate-900 mb-8 uppercase text-xs tracking-[0.3em]">{t.footerCol2}</p>
              <ul className="space-y-5 text-sm font-bold text-slate-500">
                <li className="hover:text-dayone-orange cursor-pointer">Morocco (CPS/RC)</li>
                <li className="hover:text-dayone-orange cursor-pointer">European Union</li>
              </ul>
            </div>
            <div>
              <p className="font-extrabold text-slate-900 mb-8 uppercase text-xs tracking-[0.3em]">{t.footerCol3}</p>
              <ul className="space-y-5 text-sm font-bold text-slate-500">
                <li className="hover:text-dayone-orange cursor-pointer">Documentation</li>
                <li className="hover:text-dayone-orange cursor-pointer">API Keys</li>
              </ul>
            </div>
            <div>
              <p className="font-extrabold text-slate-900 mb-8 uppercase text-xs tracking-[0.3em]">{t.footerCol4}</p>
              <ul className="space-y-5 text-sm font-bold text-slate-500">
                <li className="hover:text-dayone-orange cursor-pointer">Privacy Policy</li>
                <li className="hover:text-dayone-orange cursor-pointer">Contact Support</li>
              </ul>
            </div>
          </div>
          
          <div className="pt-12 border-t border-slate-100 flex flex-col items-center space-y-8">
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center max-w-4xl leading-relaxed">
               {t.footerCopy}
             </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;