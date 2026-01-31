import React, { useState, useEffect } from 'react';

interface ProgressStep {
  id: string;
  label: string;
}

interface ProgressOverlayProps {
  steps: ProgressStep[];
  currentStepIndex: number;
  title: string;
}

const PROCUREMENT_TIPS = [
  "Tip: Ensure all technical specifications are cross-referenced with the Règlement de Consultation (RC).",
  "Fact: AI-driven compliance checks can reduce administrative errors by up to 40%.",
  "Tip: Focus on 'Value Add' clauses to boost your scoring beyond technical minimums.",
  "Fact: Moroccan CPS documents often have mandatory administrative signatures on every page.",
  "Tip: Gemini 3 Pro analyzes up to 2 million tokens to find contradictions across document sets."
];

const ProgressOverlay: React.FC<ProgressOverlayProps> = ({ steps, currentStepIndex, title }) => {
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % PROCUREMENT_TIPS.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md transition-all">
      <div className="bg-white w-full max-w-md p-10 rounded-[40px] shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-300">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-50 rounded-3xl mb-6">
            <svg className="w-10 h-10 text-dayone-orange animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">{title}</h2>
          <p className="text-slate-400 mt-2 font-bold text-[10px] uppercase tracking-[0.2em]">Powered by Gemini 3 Pro</p>
        </div>

        <div className="space-y-5 mb-10">
          {steps.map((step, index) => {
            const isCompleted = index < currentStepIndex;
            const isCurrent = index === currentStepIndex;

            return (
              <div key={step.id} className="flex items-center space-x-4">
                <div className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-500 ${
                  isCompleted ? 'bg-emerald-500 text-white' : 
                  isCurrent ? 'bg-dayone-orange text-white shadow-lg shadow-orange-200' : 'bg-slate-50 text-slate-300'
                }`}>
                  {isCompleted ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <span className="text-xs font-bold">{index + 1}</span>
                  )}
                </div>
                <span className={`text-[13px] font-bold ${
                  isCompleted ? 'text-slate-900' : 
                  isCurrent ? 'text-dayone-orange' : 'text-slate-300'
                }`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
          <p className="text-[10px] font-extrabold text-dayone-orange uppercase tracking-[0.2em] mb-2">Expert Intel</p>
          <p className="text-xs text-slate-500 font-medium leading-relaxed h-12 transition-opacity duration-500">
            {PROCUREMENT_TIPS[tipIndex]}
          </p>
        </div>

        <div className="mt-10 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
          <div 
            className="bg-dayone-orange h-full transition-all duration-1000 ease-out"
            style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProgressOverlay;