import React, { useState, useEffect } from 'react';
import { ViewState, Jurisdiction, TenderAnalysis, GeneratedResponse, CompanyProfile, UserSubscription, SubscriptionTier, Language } from './types.ts';
import Sidebar from './components/Sidebar.tsx';
import Dashboard from './components/Dashboard.tsx';
import FileUploadZone from './components/FileUploadZone.tsx';
import AnalysisResult from './components/AnalysisResult.tsx';
import ResponseEditor from './components/ResponseEditor.tsx';
import ImageEditor from './components/ImageEditor.tsx';
import ProgressOverlay from './components/ProgressOverlay.tsx';
import SettingsView from './components/SettingsView.tsx';
import PricingView from './components/PricingView.tsx';
import LandingPage from './components/LandingPage.tsx';
import CheckoutModal from './components/CheckoutModal.tsx';
import TeamWorkspace from './components/TeamWorkspace.tsx';
import { GeminiService } from './services/geminiService.ts';
import { PRICING_TIERS } from './constants.ts';

const ANALYSIS_STEPS = [
  { id: 'init', label: 'Waking up Gemini 3 Pro' },
  { id: 'parse', label: 'Reading Document DNA' },
  { id: 'extract', label: 'Extracting High-Value Clauses' },
  { id: 'legal', label: 'Mapping Compliance Risks' },
  { id: 'finalize', label: 'Architecting Dashboard' }
];

const GENERATION_STEPS = [
  { id: 'match', label: 'Injecting Company Profile' },
  { id: 'draft', label: 'Drafting Professional Memory' },
  { id: 'check', label: 'Polishing Compliance Logic' },
  { id: 'score', label: 'Optimizing Win Probability' },
  { id: 'export', label: 'Ready for Export' }
];

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewState>('landing');
  const [jurisdiction, setJurisdiction] = useState<Jurisdiction>(Jurisdiction.MOROCCO);
  const [lang, setLang] = useState<Language>(Language.EN);
  const [loading, setLoading] = useState(false);
  const [loadingType, setLoadingType] = useState<'analysis' | 'generation' | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [analysis, setAnalysis] = useState<TenderAnalysis | null>(null);
  const [proposal, setProposal] = useState<GeneratedResponse | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [pendingPlan, setPendingPlan] = useState<SubscriptionTier | null>(null);
  
  const [subscription, setSubscription] = useState<UserSubscription>({
    tier: SubscriptionTier.FREE,
    tendersUsed: 0,
    maxTenders: 1
  });

  const [companyProfile, setCompanyProfile] = useState<CompanyProfile>({
    name: "Elite Engineering Group",
    experience: "15 years in civil infrastructure and digital transformation.",
    certifications: ["ISO 9001", "ISO 27001", "Class A Civil Works"],
    pastProjects: ["Smart City Rabat", "Casablanca Metro Extension"],
    bidHistory: "" 
  });

  const gemini = new GeminiService();

  useEffect(() => {
    document.documentElement.dir = lang === Language.AR ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const handleUpgrade = (tier: SubscriptionTier) => {
    const tierData = PRICING_TIERS.find(t => t.id === tier);
    setSubscription({
      tier,
      tendersUsed: 0,
      maxTenders: tierData?.limit ?? null
    });
    setPendingPlan(null);
    setActiveView('dashboard');
  };

  const handleSelectPlan = (tierId: SubscriptionTier) => {
    if (tierId === SubscriptionTier.FREE) {
      handleUpgrade(SubscriptionTier.FREE);
    } else {
      setPendingPlan(tierId);
    }
  };

  const checkFeatureAccess = (view: ViewState): boolean => {
    if (view === 'generator' || view === 'image-editor' || view === 'team') {
       if (subscription.tier === SubscriptionTier.FREE) {
         setActiveView('pricing');
         return false;
       }
       if (view === 'team' && subscription.tier !== SubscriptionTier.ENTERPRISE) {
         setActiveView('pricing');
         return false;
       }
    }
    return true;
  };

  const navigateTo = (view: ViewState) => {
    if (checkFeatureAccess(view)) {
      setActiveView(view);
      setIsSidebarOpen(false);
    }
  };

  const simulateProgress = (steps: any[], onComplete: () => Promise<void>) => {
    let index = 0;
    const interval = setInterval(() => {
      index++;
      if (index < steps.length - 1) {
        setCurrentStepIndex(index);
      } else {
        clearInterval(interval);
      }
    }, 2000);

    return onComplete().finally(() => {
      clearInterval(interval);
      setCurrentStepIndex(steps.length - 1);
    });
  };

  const handleFileUpload = async (fileContent: string) => {
    if (subscription.maxTenders !== null && subscription.tendersUsed >= subscription.maxTenders) {
      setActiveView('pricing');
      return;
    }

    setLoading(true);
    setLoadingType('analysis');
    setCurrentStepIndex(0);
    
    try {
      await simulateProgress(ANALYSIS_STEPS, async () => {
        const result = await gemini.analyzeTender(fileContent, jurisdiction);
        setAnalysis(result);
        setSubscription(prev => ({ ...prev, tendersUsed: prev.tendersUsed + 1 }));
        setActiveView('analysis');
      });
    } catch (error) {
      console.error("Analysis failed", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateProposal = async () => {
    if (!analysis) return;
    if (subscription.tier === SubscriptionTier.FREE) {
       setActiveView('pricing');
       return;
    }

    setLoading(true);
    setLoadingType('generation');
    setCurrentStepIndex(0);

    try {
      await simulateProgress(GENERATION_STEPS, async () => {
        const result = await gemini.generateTechnicalProposal(analysis, companyProfile, jurisdiction);
        setProposal(result);
        setActiveView('generator');
      });
    } catch (error) {
      console.error("Generation failed", error);
    } finally {
      setLoading(false);
    }
  };

  if (activeView === 'landing') {
    return (
      <>
        <LandingPage onStart={() => setActiveView('dashboard')} lang={lang} setLang={setLang} onSelectPlan={handleSelectPlan} />
        {pendingPlan && (
          <CheckoutModal 
            tierId={pendingPlan} 
            onClose={() => setPendingPlan(null)} 
            onSuccess={() => handleUpgrade(pendingPlan)} 
            lang={lang} 
          />
        )}
      </>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {loading && (
        <ProgressOverlay 
          title={loadingType === 'analysis' ? "Processing Intel" : "Architecting Bid"}
          steps={loadingType === 'analysis' ? ANALYSIS_STEPS : GENERATION_STEPS}
          currentStepIndex={currentStepIndex}
        />
      )}

      {pendingPlan && (
        <CheckoutModal 
          tierId={pendingPlan} 
          onClose={() => setPendingPlan(null)} 
          onSuccess={() => handleUpgrade(pendingPlan)} 
          lang={lang} 
        />
      )}

      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-slate-100 p-4 flex justify-between items-center sticky top-0 z-40">
        <div className="flex items-center space-x-2">
           <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold">TL</div>
           <span className="font-extrabold text-slate-900 tracking-tight">TenderLogic</span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-slate-600"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isSidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
          </svg>
        </button>
      </div>

      <Sidebar 
        activeView={activeView} 
        setActiveView={navigateTo} 
        jurisdiction={jurisdiction}
        setJurisdiction={setJurisdiction}
        subscription={subscription}
        isOpen={isSidebarOpen}
        lang={lang}
        setLang={setLang}
      />
      
      <main className={`flex-1 bg-[#fcfcfd] min-h-screen overflow-y-auto ${lang === Language.AR ? 'text-right' : 'text-left'}`}>
        <header className="hidden lg:flex sticky top-0 z-10 bg-[#fcfcfd]/80 backdrop-blur-md px-12 py-8 justify-between items-center border-b border-slate-100">
          <div className={lang === Language.AR ? 'text-right' : 'text-left'}>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight capitalize">
              {activeView === 'dashboard' ? (lang === Language.AR ? 'نظرة عامة' : 'Overview') : activeView.replace('-', ' ')}
            </h1>
            <nav className={`flex items-center space-x-2 text-[12px] font-bold text-slate-400 mt-1 uppercase tracking-widest rtl:space-x-reverse ${lang === Language.AR ? 'flex-row-reverse' : ''}`}>
              <span className="cursor-pointer hover:text-dayone-orange" onClick={() => setActiveView('landing')}>Home</span>
              <span>/</span>
              <span className="text-dayone-orange">{activeView}</span>
            </nav>
          </div>
          <div className="flex items-center space-x-6 rtl:space-x-reverse">
             <div className="flex bg-slate-100 rounded-lg p-1">
                <button 
                  onClick={() => setLang(Language.EN)}
                  className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${lang === Language.EN ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-50'}`}
                >
                  EN
                </button>
                <button 
                  onClick={() => setLang(Language.FR)}
                  className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${lang === Language.FR ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
                >
                  FR
                </button>
                <button 
                  onClick={() => setLang(Language.AR)}
                  className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${lang === Language.AR ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
                >
                  AR
                </button>
             </div>
             <div className="text-right rtl:text-left">
                <p className="text-sm font-bold text-slate-900">Elite User</p>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">{subscription.tier} License</p>
             </div>
             <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center font-bold text-slate-400 border border-slate-200 cursor-pointer hover:border-dayone-orange transition-all">
               EU
             </div>
          </div>
        </header>

        <div className="px-4 lg:px-12 pb-12 max-w-7xl mx-auto mt-6 lg:mt-0">
          {activeView === 'dashboard' && (
            <Dashboard 
              onNewTender={() => navigateTo('analysis')} 
              jurisdiction={jurisdiction}
            />
          )}
          
          {activeView === 'analysis' && !analysis && (
            <FileUploadZone onUpload={handleFileUpload} />
          )}

          {activeView === 'analysis' && analysis && (
            <AnalysisResult 
              analysis={analysis} 
              onGenerate={handleGenerateProposal} 
              isGenerating={loading}
              tier={subscription.tier}
              lang={lang}
            />
          )}

          {activeView === 'generator' && proposal && (
            <ResponseEditor proposal={proposal} />
          )}

          {activeView === 'image-editor' && (
            <ImageEditor />
          )}

          {activeView === 'team' && (
            <TeamWorkspace lang={lang} />
          )}

          {activeView === 'settings' && (
            <SettingsView 
              profile={companyProfile} 
              onSave={setCompanyProfile} 
              tier={subscription.tier}
              lang={lang}
            />
          )}

          {activeView === 'pricing' && (
            <PricingView subscription={subscription} onUpgrade={handleSelectPlan} lang={lang} />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;