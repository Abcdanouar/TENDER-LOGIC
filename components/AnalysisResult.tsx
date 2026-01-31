
import React from 'react';
import { TenderAnalysis, SubscriptionTier } from '../types';

interface AnalysisResultProps {
  analysis: TenderAnalysis;
  onGenerate: () => void;
  isGenerating: boolean;
  tier: SubscriptionTier;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ analysis, onGenerate, isGenerating, tier }) => {
  const isFree = tier === SubscriptionTier.FREE;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{analysis.title}</h2>
          <p className="text-slate-500">Deep Scan completed successfully</p>
        </div>
        <div className="flex items-center space-x-4">
          {isFree && (
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full border border-blue-100 uppercase">
              Pro Feature
            </span>
          )}
          <button 
            onClick={onGenerate}
            disabled={isGenerating}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all flex items-center space-x-2"
          >
            <span>{isFree ? 'Upgrade to Generate' : 'Generate Full Response'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white p-6 rounded-xl border border-slate-200">
            <h3 className="text-lg font-bold mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Technical Specifications
            </h3>
            <ul className="space-y-2">
              {analysis.technicalSpecs.map((spec, i) => (
                <li key={i} className="flex items-start text-slate-600 text-sm">
                  <span className="mr-2 text-blue-400 font-bold">•</span> {spec}
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-white p-6 rounded-xl border border-slate-200">
            <h3 className="text-lg font-bold mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /></svg>
              Scoring Criteria
            </h3>
            <div className="space-y-3">
              {analysis.scoringCriteria.map((criterion, i) => (
                <div key={i} className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-sm text-slate-700">
                  {criterion}
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="bg-red-50 p-6 rounded-xl border border-red-100">
            <h3 className="text-lg font-bold text-red-900 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              Compliance Risks
            </h3>
            <div className="space-y-4">
              {analysis.riskAlerts.map((risk, i) => (
                <div key={i} className="bg-white p-3 rounded border border-red-200">
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                      risk.level === 'High' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {risk.level} Risk
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-900">{risk.clause}</p>
                  <p className="text-xs text-slate-50 mt-1 bg-red-600 px-2 py-1 rounded-sm">{risk.risk}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white p-6 rounded-xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Critical Data</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-400">Deadline</label>
                <p className="font-bold text-slate-900">{analysis.deadlines}</p>
              </div>
              <div>
                <label className="text-xs text-slate-400">Penalties</label>
                <p className="font-bold text-slate-900">{analysis.penalties}</p>
              </div>
              <div>
                <label className="text-xs text-slate-400">Mandatory Certs</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {analysis.certifications.map((c, i) => (
                    <span key={i} className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded border border-slate-200">
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
