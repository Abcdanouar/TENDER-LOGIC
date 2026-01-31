import React, { useState, useRef } from 'react';
import { GeneratedResponse, ExportSettings } from '../types.ts';

interface ResponseEditorProps {
  proposal: GeneratedResponse;
}

const EXPORT_TEMPLATES = [
  { id: 'corporate-pro', name: 'Corporate Pro', desc: 'Sober, high-authority legal layout', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
  { id: 'tech-modern', name: 'Modern Tech', desc: 'Visual-first, dynamic infrastructure style', icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  { id: 'minimal-strict', name: 'Minimalist', desc: 'Focus on pure compliance text', icon: 'M4 6h16M4 12h16m-7 6h7' },
];

const BRAND_COLORS = ['#3b82f6', '#10b981', '#6366f1', '#f59e0b', '#ef4444', '#1e293b'];

const ResponseEditor: React.FC<ResponseEditorProps> = ({ proposal }) => {
  const [content, setContent] = useState(proposal.technicalMemory);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportSettings, setExportSettings] = useState<ExportSettings>({
    templateId: 'corporate-pro',
    brandColor: '#3b82f6',
    logoUrl: null,
    includeCoverPage: true,
    includeTableOfContents: true,
    headerFooterText: 'Proprietary & Confidential - Elite Engineering Group'
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setExportSettings(prev => ({ ...prev, logoUrl: event.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFinalExport = () => {
    alert(`Generating ${exportSettings.templateId} PDF with brand color ${exportSettings.brandColor}...`);
    setShowExportModal(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Main Editor Section */}
      <div className="lg:col-span-3">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[700px]">
          <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex justify-between items-center">
            <div className="flex space-x-2">
              <button className="p-1.5 hover:bg-slate-200 rounded text-slate-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
              </button>
              <div className="w-px h-6 bg-slate-300 mx-2" />
              <button className="p-1.5 hover:bg-slate-200 rounded text-slate-600 font-bold w-8 h-8 flex items-center justify-center">B</button>
              <button className="p-1.5 hover:bg-slate-200 rounded text-slate-600 italic w-8 h-8 flex items-center justify-center">I</button>
              <button className="p-1.5 hover:bg-slate-200 rounded text-slate-600 underline w-8 h-8 flex items-center justify-center">U</button>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 uppercase tracking-tighter">Compliance Validated</span>
              <span className="text-xs font-medium text-slate-400 italic">Auto-saved to Cloud</span>
            </div>
          </div>
          <textarea 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-1 w-full p-10 focus:outline-none text-slate-800 leading-relaxed font-mono text-sm resize-none bg-white selection:bg-blue-100"
            placeholder="Technical proposal content..."
          />
        </div>
        <div className="mt-6 flex justify-end space-x-4">
          <button 
            onClick={() => setShowExportModal(true)}
            className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-white hover:border-slate-300 transition-all flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /></svg>
            <span>Export Configuration</span>
          </button>
          <button 
            onClick={() => setShowExportModal(true)}
            className="px-10 py-2.5 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            <span>Final Export</span>
          </button>
        </div>
      </div>

      {/* Sidebar Info Section */}
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-500 uppercase mb-4 flex items-center">
             <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
             Win Probability
          </h3>
          <div className="flex items-center space-x-4">
            <div className="relative w-20 h-20">
              <svg className="w-20 h-20 transform -rotate-90">
                <circle cx="40" cy="40" r="36" stroke="#f1f5f9" strokeWidth="8" fill="none" />
                <circle cx="40" cy="40" r="36" stroke="#10b981" strokeWidth="8" strokeDasharray={`${proposal.estimatedScore * 2.26} 226`} fill="none" className="transition-all duration-1000" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-bold text-xl text-slate-900">
                {Math.round(proposal.estimatedScore)}
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-emerald-600">Optimal Response</p>
              <p className="text-[10px] text-slate-400 leading-tight">Meets 100% of the mandatory scoring criteria extracted from CPS.</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-500 uppercase mb-4 flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
            Compliance Checklist
          </h3>
          <div className="space-y-3">
            {proposal.complianceChecklist.map((item, i) => (
              <div key={i} className="flex items-start space-x-3 group">
                <div className="mt-1 flex-shrink-0 w-4 h-4 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="w-2.5 h-2.5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-[11px] text-slate-600 leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Export Configuration Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Export & Branding Settings</h3>
                <p className="text-sm text-slate-500">Configure your technical proposal for final submission</p>
              </div>
              <button 
                onClick={() => setShowExportModal(false)}
                className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l18 18" /></svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="space-y-8">
                {/* Template Selection */}
                <section>
                  <h4 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-widest">1. Select Layout Template</h4>
                  <div className="space-y-3">
                    {EXPORT_TEMPLATES.map((tpl) => (
                      <button 
                        key={tpl.id}
                        onClick={() => setExportSettings({ ...exportSettings, templateId: tpl.id })}
                        className={`w-full flex items-center p-4 rounded-2xl border transition-all text-left ${
                          exportSettings.templateId === tpl.id 
                            ? 'border-blue-500 bg-blue-50/50 ring-2 ring-blue-500/20' 
                            : 'border-slate-100 bg-slate-50 hover:bg-white hover:border-slate-200 shadow-sm'
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 transition-colors ${
                          exportSettings.templateId === tpl.id ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'
                        }`}>
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={tpl.icon} /></svg>
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{tpl.name}</p>
                          <p className="text-xs text-slate-500">{tpl.desc}</p>
                        </div>
                        {exportSettings.templateId === tpl.id && (
                          <div className="ml-auto text-blue-600">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </section>

                {/* Brand Identity */}
                <section>
                  <h4 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-widest">2. Brand Identity</h4>
                  <div className="space-y-6">
                    <div>
                      <label className="text-xs font-semibold text-slate-500 block mb-3">Primary Theme Color</label>
                      <div className="flex flex-wrap gap-3">
                        {BRAND_COLORS.map(color => (
                          <button 
                            key={color}
                            onClick={() => setExportSettings({...exportSettings, brandColor: color})}
                            className={`w-10 h-10 rounded-full border-2 transition-transform hover:scale-110 flex items-center justify-center ${
                              exportSettings.brandColor === color ? 'border-white ring-2 ring-slate-900 scale-110 shadow-lg' : 'border-transparent'
                            }`}
                            style={{ backgroundColor: color }}
                          >
                            {exportSettings.brandColor === color && (
                              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-500 block mb-3">Corporate Logo</label>
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="cursor-pointer h-24 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition-all bg-slate-50"
                      >
                        {exportSettings.logoUrl ? (
                          <div className="relative group">
                            <img src={exportSettings.logoUrl} alt="Logo" className="h-16 object-contain" />
                            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-bold rounded">Change Logo</div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                             <svg className="w-6 h-6 text-slate-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                             <span className="text-xs text-slate-400 font-medium">Click to upload high-res PNG/SVG</span>
                          </div>
                        )}
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleLogoUpload} />
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              <div className="space-y-8 lg:border-l lg:pl-10 border-slate-100">
                {/* Export Options */}
                <section>
                  <h4 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-widest">3. Document structure</h4>
                  <div className="space-y-4">
                    <label className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl cursor-pointer hover:bg-white border border-transparent hover:border-slate-100 transition-all">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">Include Automated Cover Page</p>
                          <p className="text-[10px] text-slate-500 italic">Gemini will generate a contextual cover summary</p>
                        </div>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={exportSettings.includeCoverPage} 
                        onChange={(e) => setExportSettings({...exportSettings, includeCoverPage: e.target.checked})}
                        className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                    </label>

                    <label className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl cursor-pointer hover:bg-white border border-transparent hover:border-slate-100 transition-all">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">Dynamic Table of Contents</p>
                          <p className="text-[10px] text-slate-500 italic">Auto-indexed based on technical memory sections</p>
                        </div>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={exportSettings.includeTableOfContents} 
                        onChange={(e) => setExportSettings({...exportSettings, includeTableOfContents: e.target.checked})}
                        className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                    </label>
                  </div>
                </section>

                <section>
                  <label className="text-xs font-semibold text-slate-500 block mb-2 uppercase">Custom Footer Text</label>
                  <input 
                    type="text" 
                    value={exportSettings.headerFooterText}
                    onChange={(e) => setExportSettings({...exportSettings, headerFooterText: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                  />
                </section>

                {/* Visual Preview (Mock) */}
                <section>
                  <label className="text-xs font-semibold text-slate-500 block mb-4 uppercase tracking-tighter">Live Preview Context</label>
                  <div className="bg-slate-900 rounded-2xl p-6 aspect-[4/3] relative overflow-hidden flex flex-col items-center justify-center text-center">
                    <div className="absolute top-0 left-0 w-full h-2" style={{ backgroundColor: exportSettings.brandColor }}></div>
                    <div className="absolute top-6 left-6 opacity-20 text-slate-600 text-[10px] font-bold uppercase">Mockup View</div>
                    
                    {exportSettings.logoUrl ? (
                      <img src={exportSettings.logoUrl} className="h-10 mb-4 brightness-0 invert opacity-60" />
                    ) : (
                      <div className="w-10 h-10 bg-slate-800 rounded mb-4 animate-pulse"></div>
                    )}
                    <h5 className="text-white font-bold text-base mb-1">PROJET: MÉMOIRE TECHNIQUE</h5>
                    <p className="text-slate-500 text-[10px] uppercase tracking-[0.2em]">MARCHÉ PUBLIC NO. 2024/042</p>
                    <div className="mt-8 space-y-1">
                       <div className="w-32 h-1.5 bg-slate-800 rounded mx-auto"></div>
                       <div className="w-24 h-1.5 bg-slate-800 rounded mx-auto"></div>
                       <div className="w-28 h-1.5 bg-slate-800 rounded mx-auto"></div>
                    </div>
                  </div>
                </section>
              </div>
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
              <p className="text-xs text-slate-500 font-medium max-w-sm">
                PDF rendering is optimized for high-DPI printing standards using standard procurement fonts.
              </p>
              <div className="flex space-x-3">
                <button 
                  onClick={() => setShowExportModal(false)}
                  className="px-6 py-2.5 rounded-xl border border-slate-300 text-slate-600 font-bold hover:bg-white transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleFinalExport}
                  className="px-8 py-2.5 bg-slate-900 text-white rounded-xl font-bold shadow-xl hover:bg-black transition-all"
                >
                  Export Secure PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResponseEditor;