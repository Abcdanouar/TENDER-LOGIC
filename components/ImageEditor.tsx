import React, { useState, useRef } from 'react';
import { GeminiService } from '../services/geminiService.ts';

const ImageEditor: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const gemini = new GeminiService();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async () => {
    if (!image || !prompt) return;
    setIsProcessing(true);
    try {
      const base64Data = image.split(',')[1];
      const result = await gemini.editSchemaImage(base64Data, prompt);
      if (result) {
        setImage(result);
        setPrompt('');
      }
    } catch (error) {
      console.error("Image editing failed", error);
      alert("AI Image Editing failed. Check prompt and API key.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Technical Diagram AI Assistant</h2>
        <p className="text-slate-500 mb-8">Edit your technical schemas, architectural drawings, or team photos for the tender response.</p>
        
        {!image ? (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="cursor-pointer h-80 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition-all"
          >
            <svg className="w-16 h-16 text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-slate-500 font-medium">Upload diagram (PNG/JPG)</span>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileUpload} 
            />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="relative rounded-xl overflow-hidden border border-slate-200 shadow-inner bg-slate-100 h-96 flex items-center justify-center">
              <img src={image} alt="Uploaded diagram" className="max-h-full max-w-full object-contain" />
              {isProcessing && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                  <div className="flex flex-col items-center">
                    <svg className="animate-spin h-10 w-10 text-blue-600 mb-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-blue-900 font-bold">Nano Banana Editing...</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex space-x-4">
              <input 
                type="text" 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. 'Add a professional watermark', 'Remove text on the right', 'Apply a retro blue blueprint filter'..."
                className="flex-1 border-slate-200 border rounded-xl px-6 py-4 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
              />
              <button 
                onClick={handleEdit}
                disabled={isProcessing || !prompt}
                className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-black transition-all disabled:opacity-50"
              >
                Apply Edit
              </button>
            </div>
            <button 
              onClick={() => setImage(null)}
              className="text-sm text-slate-500 hover:text-red-500"
            >
              Clear Image
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-slate-100 rounded-lg text-xs text-slate-500 border border-slate-200">
          <span className="font-bold block text-slate-700 mb-1">Remove Distractions</span>
          Use "Remove the background objects" to clean up site photos for the proposal.
        </div>
        <div className="p-4 bg-slate-100 rounded-lg text-xs text-slate-500 border border-slate-200">
          <span className="font-bold block text-slate-700 mb-1">Stylize Schemas</span>
          "Turn this into a clean 2D vector style" for consistent technical documentation.
        </div>
        <div className="p-4 bg-slate-100 rounded-lg text-xs text-slate-500 border border-slate-200">
          <span className="font-bold block text-slate-700 mb-1">Highlight Elements</span>
          "Circle the main transformer in red" to draw attention to specific technical assets.
        </div>
      </div>
    </div>
  );
};

export default ImageEditor;