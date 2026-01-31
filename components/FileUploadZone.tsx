
import React, { useState } from 'react';

interface FileUploadZoneProps {
  onUpload: (content: string) => void;
}

const FileUploadZone: React.FC<FileUploadZoneProps> = ({ onUpload }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      onUpload(text);
    };
    reader.readAsText(file);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">Drop your tender documents. <br/><span className="text-[#0066FF]">AI handles the complexity.</span></h2>
        <p className="text-slate-500 mt-4 text-lg font-medium max-w-2xl mx-auto italic">Process CPS, RFP, and legal frameworks instantly with Gemini 3 Pro intelligence.</p>
      </div>

      <div 
        className={`relative h-[450px] border-2 border-dashed rounded-[40px] flex flex-col items-center justify-center transition-all duration-500 ${
          dragActive ? 'border-[#0066FF] bg-blue-50/50 scale-[1.01]' : 'border-slate-200 bg-white'
        } dayone-shadow`}
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
          }
        }}
      >
        <div className="w-24 h-24 bg-blue-50 rounded-[32px] flex items-center justify-center mb-8">
          <svg className="w-10 h-10 text-[#0066FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <p className="text-2xl font-bold text-slate-900">Start new analysis</p>
        <p className="text-slate-400 mt-2 font-medium">Drag a PDF or browse your computer</p>
        
        <label className="mt-10 cursor-pointer bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold hover:bg-black transition-all shadow-2xl">
          Browse Files
          <input type="file" className="hidden" accept=".pdf,.doc,.docx,.txt" onChange={onFileChange} />
        </label>

        <div className="mt-12 flex items-center space-x-10 text-slate-400 border-t border-slate-50 pt-8 w-full justify-center">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span className="text-[11px] font-bold uppercase tracking-wider">Secure Transfer</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span className="text-[11px] font-bold uppercase tracking-wider">Multi-Format Support</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUploadZone;
