
import React, { useState } from 'react';
import { CompanyProfile } from '../types';

interface SettingsViewProps {
  profile: CompanyProfile;
  onSave: (profile: CompanyProfile) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ profile, onSave }) => {
  const [formData, setFormData] = useState({
    name: profile.name,
    experience: profile.experience,
    certifications: profile.certifications.join('\n'),
    pastProjects: profile.pastProjects.join('\n'),
  });

  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    onSave({
      name: formData.name,
      experience: formData.experience,
      certifications: formData.certifications.split('\n').filter(s => s.trim() !== ''),
      pastProjects: formData.pastProjects.split('\n').filter(s => s.trim() !== ''),
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const inputClass = "mt-1 block w-full rounded-xl border-slate-200 bg-slate-50 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border transition-all";
  const labelClass = "block text-sm font-semibold text-slate-700 mb-1";

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Company Intelligence Profile</h2>
            <p className="text-slate-500">This data is used by Gemini to tailor technical proposals and compliance checks.</p>
          </div>
          <div className="flex items-center space-x-3">
            {isSaved && (
              <span className="text-green-600 text-sm font-bold flex items-center animate-bounce">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Changes Saved
              </span>
            )}
            <button 
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all"
            >
              Save Profile
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center">
              <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mr-3 text-sm">01</span>
              Identity & History
            </h3>
            
            <div>
              <label className={labelClass}>Legal Entity Name</label>
              <input 
                type="text" 
                className={inputClass}
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div>
              <label className={labelClass}>Company Experience Statement</label>
              <textarea 
                rows={4}
                className={inputClass}
                value={formData.experience}
                onChange={(e) => setFormData({...formData, experience: e.target.value})}
                placeholder="Describe your core business, years of operation, and specialized domains..."
              />
              <p className="mt-2 text-[10px] text-slate-400">Used for the 'Présentation de l'entreprise' section of the Mémoire Technique.</p>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center">
              <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center mr-3 text-sm">02</span>
              Technical Assets
            </h3>

            <div>
              <label className={labelClass}>Certifications (One per line)</label>
              <textarea 
                rows={4}
                className={`${inputClass} font-mono text-xs`}
                value={formData.certifications}
                onChange={(e) => setFormData({...formData, certifications: e.target.value})}
                placeholder="ISO 9001&#10;ISO 27001&#10;Class A Civil Works..."
              />
            </div>

            <div>
              <label className={labelClass}>Reference Projects (One per line)</label>
              <textarea 
                rows={4}
                className={`${inputClass} font-mono text-xs`}
                value={formData.pastProjects}
                onChange={(e) => setFormData({...formData, pastProjects: e.target.value})}
                placeholder="Smart City Rabat (2023)&#10;Casablanca Metro Extension (2022)..."
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 rounded-2xl p-6 text-white overflow-hidden relative">
        <div className="relative z-10 flex items-center justify-between">
          <div className="max-w-xl">
            <h4 className="text-lg font-bold mb-2">Security & Data Privacy</h4>
            <p className="text-slate-400 text-sm">
              Your company data is encrypted at rest and only processed locally during the generation phase. We do not use your proprietary documents to train public models.
            </p>
          </div>
          <div className="hidden md:block">
            <svg className="w-16 h-16 text-slate-800" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.9L9.03 9.122a2 2 0 001.938 0L17.834 4.9A2 2 0 0016 1.5H4a2 2 0 00-1.834 3.4zM18 8.167V13a2 2 0 01-2 2H4a2 2 0 01-2-2V8.167l6.53 4.02a4 4 0 003.94 0L18 8.167z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-3xl -mr-32 -mt-32"></div>
      </div>
    </div>
  );
};

export default SettingsView;
