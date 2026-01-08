
import React, { useState, useCallback } from 'react';
import { AudioControls } from './components/AudioControls';
import { ResultView } from './components/ResultView';
import { GeminiService } from './services/geminiService';
import { AppStatus, TranscriptionResult } from './types';
import { History, LayoutDashboard, BrainCircuit, RefreshCw } from 'lucide-react';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [result, setResult] = useState<TranscriptionResult | null>(null);
  const [history, setHistory] = useState<TranscriptionResult[]>([]);

  const geminiService = new GeminiService();

  const handleAudioReady = async (blob: Blob, fileName: string) => {
    setStatus(AppStatus.UPLOADING);
    
    try {
      // Convert Blob to Base64
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64data = (reader.result as string).split(',')[1];
        setStatus(AppStatus.PROCESSING);
        
        try {
          const { fullText, insights } = await geminiService.processAudio(base64data, blob.type, fileName);
          
          const newResult: TranscriptionResult = {
            fullText,
            insights,
            timestamp: Date.now(),
            fileName
          };
          
          setResult(newResult);
          setHistory(prev => [newResult, ...prev]);
          setStatus(AppStatus.COMPLETED);
        } catch (err) {
          console.error(err);
          alert("Error processing audio. Please try a shorter recording or check your network.");
          setStatus(AppStatus.ERROR);
        }
      };
    } catch (err) {
      console.error(err);
      setStatus(AppStatus.ERROR);
    }
  };

  const reset = () => {
    setResult(null);
    setStatus(AppStatus.IDLE);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-indigo-200 shadow-lg">
              <BrainCircuit size={24} />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-gray-900">EchoScribe<span className="text-indigo-600">AI</span></span>
          </div>
          
          <div className="flex items-center gap-6">
            <button className="text-gray-500 hover:text-indigo-600 transition-colors flex items-center gap-2 text-sm font-medium">
              <History size={18} />
              Recent
            </button>
            <button className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-all shadow-md">
              Upgrade
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      {(status === AppStatus.IDLE || status === AppStatus.ERROR) && !result && (
        <main className="max-w-4xl mx-auto px-6 pt-12 pb-24 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
            Enhanced Lead Intelligence
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
            Transcribe Calls into <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Actionable Leads</span>
          </h1>
          <p className="text-xl text-gray-500 mb-12 max-w-2xl mx-auto">
            Extract company details, product interests, DNC requests, and contact info automatically from any call recording.
          </p>
          
          <AudioControls status={status} onAudioReady={handleAudioReady} />
          
          <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4 font-bold">1</div>
              <h3 className="font-bold mb-2">Automated Extraction</h3>
              <p className="text-sm text-gray-500">Identifies Company, Caller, Product, and Contact details instantly.</p>
            </div>
            <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center mb-4 font-bold">2</div>
              <h3 className="font-bold mb-2">Compliance Flags</h3>
              <p className="text-sm text-gray-500">Detects DNC requests and automated agents for better call auditing.</p>
            </div>
            <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-10 h-10 bg-violet-50 text-violet-600 rounded-lg flex items-center justify-center mb-4 font-bold">3</div>
              <h3 className="font-bold mb-2">Lead Ready</h3>
              <p className="text-sm text-gray-500">Perfect for CRM integration with structured data output.</p>
            </div>
          </div>
        </main>
      )}

      {/* Results Section */}
      {(status === AppStatus.PROCESSING || status === AppStatus.UPLOADING || result) && (
        <main className="max-w-7xl mx-auto px-6 py-12">
          {result && (
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <LayoutDashboard className="text-indigo-600" size={32} />
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Call Intelligence</h2>
              </div>
              <button 
                onClick={reset}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all shadow-sm"
              >
                <RefreshCw size={18} />
                New Recording
              </button>
            </div>
          )}

          {result ? (
            <ResultView result={result} />
          ) : (
            <div className="max-w-2xl mx-auto">
              <AudioControls status={status} onAudioReady={handleAudioReady} />
            </div>
          )}
        </main>
      )}

      {/* Footer */}
      <footer className="border-t border-gray-100 mt-24 py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-gray-400 text-sm">
          <p>© 2024 EchoScribe AI. Professional Audio Intelligence System.</p>
          <div className="flex gap-8 mt-4 md:mt-0">
            <a href="#" className="hover:text-indigo-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Security</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">API Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
