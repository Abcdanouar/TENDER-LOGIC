
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
  "Tip: Gemini 3 Pro analyzes the 2M token window to find contradictions across large document sets."
];

const ProgressOverlay: React.FC<ProgressOverlayProps> = ({ steps, currentStepIndex, title }) => {
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % PROCUREMENT_TIPS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm transition-all">
      <div className="bg-white w-full max-w-md p-8 rounded-3xl shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-300">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4">
            <svg className="w-8 h-8 text-blue-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
          <p className="text-slate-500 mt-1">Harnessing Gemini 3 Pro Intelligence</p>
        </div>

        <div className="space-y-4 mb-8">
          {steps.map((step, index) => {
            const isCompleted = index < currentStepIndex;
            const isCurrent = index === currentStepIndex;

            return (
              <div key={step.id} className="flex items-center space-x-4">
                <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors duration-500 ${
                  isCompleted ? 'bg-green-500 text-white' : 
                  isCurrent ? 'bg-blue-600 text-white animate-bounce' : 'bg-slate-100 text-slate-400'
                }`}>
                  {isCompleted ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <span className="text-[10px] font-bold">{index + 1}</span>
                  )}
                </div>
                <span className={`text-sm font-medium ${
                  isCompleted ? 'text-slate-900' : 
                  isCurrent ? 'text-blue-600' : 'text-slate-400'
                }`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <p className="text-[11px] font-bold text-blue-600 uppercase tracking-wider mb-1">Did you know?</p>
          <p className="text-xs text-slate-600 italic leading-relaxed h-10 transition-opacity duration-500">
            {PROCUREMENT_TIPS[tipIndex]}
          </p>
        </div>

        <div className="mt-8 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
          <div 
            className="bg-blue-600 h-full transition-all duration-1000 ease-out"
            style={{ width: `${((currentStepIndex + 0.5) / steps.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProgressOverlay;
