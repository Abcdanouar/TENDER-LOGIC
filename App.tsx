
import React, { useState, useEffect } from 'react';
import { ViewState, Jurisdiction, TenderAnalysis, GeneratedResponse, CompanyProfile, UserSubscription, SubscriptionTier, Language, User, UserRole } from './types.ts';
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
import AuthView from './components/AuthView.tsx';
import AdminDashboard from './components/AdminDashboard.tsx';
import { GeminiService } from './services/geminiService.ts';
import { backend } from './services/backendService.ts';
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
  const [user, setUser] = useState<User | null>(null);
  
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

  // Load Initial Data from DB
  useEffect(() => {
    const init = async () => {
      const savedUserId = localStorage.getItem('tl_user_id');
      if (savedUserId) {
        const dbUser = await backend.getUser(savedUserId);
        if (dbUser) {
          setUser(dbUser);
          setSubscription(prev => ({ ...prev, tier: dbUser.subscriptionTier }));
          const profile = await backend.getProfile(dbUser.id);
          if (profile) setCompanyProfile(profile);
          setActiveView(dbUser.role === UserRole.ADMIN ? 'admin-panel' : 'dashboard');
        }
      }
    };
    init();
  }, []);

  useEffect(() => {
    document.documentElement.dir = lang === Language.AR ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const handleAuthSuccess = async (authUser: User) => {
    setUser(authUser);
    localStorage.setItem('tl_user_id', authUser.id);
    await backend.saveUser(authUser);
    setActiveView(authUser.role === UserRole.ADMIN ? 'admin-panel' : 'dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('tl_user_id');
    setActiveView('landing');
  };

  const handleUpgrade = async (tier: SubscriptionTier) => {
    const tierData = PRICING_TIERS.find(t => t.id === tier);
    setSubscription({
      tier,
      tendersUsed: 0,
      maxTenders: tierData?.limit ?? null
    });
    if (user) {
      const updatedUser = { ...user, subscriptionTier: tier };
      setUser(updatedUser);
      await backend.saveUser(updatedUser);
    }
    setPendingPlan(null);
    setActiveView('dashboard');
  };

  const navigateTo = (view: ViewState) => {
    if (!user && view !== 'landing' && view !== 'auth') {
       setActiveView('auth');
       return;
    }
    if (view === 'admin-panel' && user?.role !== UserRole.ADMIN) {
       setActiveView('dashboard');
       return;
    }
    setActiveView(view);
    setIsSidebarOpen(false);
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
        if (user) {
          await backend.saveTender(user.id, result);
        }
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

  const updateCompanyProfile = async (profile: CompanyProfile) => {
    setCompanyProfile(profile);
    if (user) await backend.saveProfile(user.id, profile);
  };

  if (activeView === 'landing') {
    return (
      <LandingPage 
        onStart={() => navigateTo(user ? 'dashboard' : 'auth')} 
        lang={lang} 
        setLang={setLang} 
        onSelectPlan={(tier) => {
          if (!user) setActiveView('auth');
          else setPendingPlan(tier);
        }} 
      />
    );
  }

  if (activeView === 'auth') {
    return <AuthView lang={lang} onAuthSuccess={handleAuthSuccess} onBack={() => setActiveView('landing')} />;
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {loading && <ProgressOverlay title={loadingType === 'analysis' ? "Processing Intel" : "Architecting Bid"} steps={loadingType === 'analysis' ? ANALYSIS_STEPS : GENERATION_STEPS} currentStepIndex={currentStepIndex} />}
      {pendingPlan && <CheckoutModal tierId={pendingPlan} onClose={() => setPendingPlan(null)} onSuccess={() => handleUpgrade(pendingPlan)} lang={lang} />}

      <Sidebar activeView={activeView} setActiveView={navigateTo} jurisdiction={jurisdiction} setJurisdiction={setJurisdiction} subscription={subscription} isOpen={isSidebarOpen} lang={lang} setLang={setLang} onLogout={handleLogout} user={user} />
      
      <main className={`flex-1 bg-[#fcfcfd] min-h-screen overflow-y-auto ${lang === Language.AR ? 'text-right' : 'text-left'}`}>
        <header className="hidden lg:flex sticky top-0 z-10 bg-[#fcfcfd]/80 backdrop-blur-md px-12 py-8 justify-between items-center border-b border-slate-100">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight capitalize">{activeView.replace('-', ' ')}</h1>
            <p className="text-[12px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{user?.name} | {subscription.tier} License</p>
          </div>
          <div className="flex items-center space-x-6 rtl:space-x-reverse">
             <div className="flex bg-slate-100 rounded-lg p-1">
                <button onClick={() => setLang(Language.EN)} className={`px-3 py-1 text-[10px] font-bold rounded-md ${lang === Language.EN ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>EN</button>
                <button onClick={() => setLang(Language.AR)} className={`px-3 py-1 text-[10px] font-bold rounded-md ${lang === Language.AR ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>AR</button>
             </div>
             <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center font-bold text-slate-400 border border-slate-200 uppercase">{user?.name?.[0]}</div>
          </div>
        </header>

        <div className="px-4 lg:px-12 pb-12 max-w-7xl mx-auto mt-6">
          {activeView === 'dashboard' && <Dashboard onNewTender={() => navigateTo('analysis')} jurisdiction={jurisdiction} />}
          {activeView === 'admin-panel' && <AdminDashboard lang={lang} />}
          {activeView === 'analysis' && !analysis && <FileUploadZone onUpload={handleFileUpload} />}
          {activeView === 'analysis' && analysis && <AnalysisResult analysis={analysis} onGenerate={handleGenerateProposal} isGenerating={loading} tier={subscription.tier} lang={lang} />}
          {activeView === 'generator' && proposal && <ResponseEditor proposal={proposal} />}
          {activeView === 'image-editor' && <ImageEditor />}
          {activeView === 'team' && <TeamWorkspace lang={lang} />}
          {activeView === 'settings' && <SettingsView profile={companyProfile} onSave={updateCompanyProfile} tier={subscription.tier} lang={lang} />}
          {activeView === 'pricing' && <PricingView subscription={subscription} onUpgrade={setPendingPlan} lang={lang} />}
        </div>
      </main>
    </div>
  );
};

export default App;
