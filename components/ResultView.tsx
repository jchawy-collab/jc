
import React, { useState, useMemo } from 'react';
import { TranscriptionResult } from '../types';
import { 
  FileText, Phone, ShoppingBag, 
  Calendar, Ban, PhoneIncoming, PhoneOutgoing, Activity,
  Music, Volume2, CheckCircle2,
  Clock, Layers, Megaphone,
  Mail, ShieldCheck, History, UserCheck,
  Link, Sparkles, User, ExternalLink, Smartphone, MailPlus, Info,
  Quote, Brain, ArrowRight, AlertTriangle, VolumeX, PhoneOff, ListOrdered,
  Signal, ShieldCheck as Shield, Cpu, Zap, Timer, Bell, BellOff
} from 'lucide-react';

interface ResultViewProps {
  result: TranscriptionResult;
}

type TabType = 'intelligence' | 'contact' | 'transcript';

export const ResultView: React.FC<ResultViewProps> = ({ result }) => {
  const { fullText, insights, fileName } = result;
  const [activeTab, setActiveTab] = useState<TabType>('intelligence');

  const displayDirection = insights.callDirection !== 'Unknown' && insights.callDirection
    ? insights.callDirection 
    : (fileName.toLowerCase().includes('inbound') ? 'Inbound' : 'Outbound');

  const audioEvents = useMemo(() => {
    const matches = fullText.match(/\[(.*?)\]/g);
    return matches ? Array.from(new Set(matches.map(m => m.slice(1, -1)))) : [];
  }, [fullText]);

  const atdsIconMap: Record<string, any> = {
    "Hold Music": Music,
    "Pre-recorded Message": Megaphone,
    "Noticeable Delay": Timer,
    "Connection Tone": Zap,
    "Disconnection Tone": BellOff
  };

  const renderTranscriptWithHighlights = (text: string) => {
    if (!text || text.trim() === "") return <span className="text-gray-400 italic">No audio content captured.</span>;

    const parts = text.split(/(\[.*?\])/g);
    return parts.map((part, i) => {
      if (part.startsWith('[') && part.endsWith(']')) {
        const isSignal = part.includes('Signal');
        const isBusy = part.includes('Busy');
        const isClear = part.includes('Clear') || part.includes('Normal') || part.includes('Connected');
        const isSilent = part.includes('Silent') || part.includes('No Interaction');
        const isAtds = part.includes('Delay') || part.includes('Tone') || part.includes('Message');
        
        return (
          <span 
            key={i} 
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg font-black text-xs uppercase tracking-tight mx-1 shadow-sm border ${
              isBusy ? 'bg-red-100 text-red-800 border-red-200' :
              isClear ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
              isSilent ? 'bg-gray-200 text-gray-800 border-gray-300' :
              isAtds ? 'bg-purple-100 text-purple-800 border-purple-200' :
              'bg-indigo-100 text-indigo-800 border-indigo-200'
            }`}
          >
            {isSignal && <Signal size={12} />}
            {isBusy && <PhoneOff size={12} />}
            {isClear && <CheckCircle2 size={12} />}
            {isSilent && <VolumeX size={12} />}
            {isAtds && <Cpu size={12} />}
            {part}
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  const TabButton = ({ type, label, icon: Icon }: { type: TabType, label: string, icon: any }) => (
    <button
      onClick={() => setActiveTab(type)}
      className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all text-sm uppercase tracking-wider ${
        activeTab === type 
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
        : 'bg-white text-gray-500 hover:bg-indigo-50 border border-gray-100'
      }`}
    >
      <Icon size={18} />
      {label}
    </button>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24 max-w-7xl mx-auto px-4 md:px-0">
      
      {/* LINE VERIFICATION BANNER */}
      <div className={`p-5 rounded-3xl flex items-center gap-5 border-2 ${
        insights.isBusySignal ? 'bg-red-50 border-red-200 text-red-900' : 
        'bg-emerald-50 border-emerald-100 text-emerald-900'
      }`}>
        <div className={`p-3 rounded-2xl ${
          insights.isBusySignal ? 'bg-red-100' : 'bg-emerald-100'
        }`}>
          {insights.isBusySignal ? <PhoneOff size={28} className="text-red-600" /> : <Signal size={28} className="text-emerald-600" />}
        </div>
        <div className="flex-1">
          <p className="font-black uppercase tracking-[0.2em] text-[10px] mb-1 opacity-70">Forensic Line Analysis</p>
          <p className="text-lg font-black leading-none">{insights.signalStatus}</p>
        </div>
        {!insights.isBusySignal && <CheckCircle2 size={24} className="text-emerald-500 opacity-50" />}
      </div>

      <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-900 to-indigo-900 p-8 md:p-12 text-white">
          <div className="flex flex-col md:flex-row justify-between gap-8">
            <div className="space-y-6 w-full">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-indigo-300 uppercase tracking-[0.2em] mb-2 block">Direction</span>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${displayDirection === 'Inbound' ? 'bg-blue-500' : 'bg-purple-500'}`}>
                      {displayDirection === 'Inbound' ? <PhoneIncoming size={20} /> : <PhoneOutgoing size={20} />}
                    </div>
                    <span className="text-2xl font-black">{displayDirection}</span>
                  </div>
                </div>
                
                <div className="bg-white/5 px-4 py-2 rounded-xl border border-white/10 flex items-center gap-2">
                  <Link size={14} className="text-indigo-300" />
                  <span className="text-[10px] font-mono text-indigo-200 truncate max-w-[200px]">ID: {fileName}</span>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-indigo-300 uppercase tracking-[0.2em] mb-2 block">Identified Entity</span>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none truncate">
                  {insights.companyName || (insights.isBusySignal ? 'Line Engaged' : 'Anonymous Participant')}
                </h1>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                <div>
                  <span className="text-xs font-bold text-indigo-300 uppercase tracking-[0.2em] mb-2 block">Primary Contact</span>
                  <a href={`tel:${insights.callerContact}`} className="flex items-center gap-3 text-2xl font-mono font-bold text-indigo-200 hover:text-white transition-colors group">
                    <Phone size={24} />
                    {insights.callerContact || 'N/A'}
                    <ExternalLink size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </div>
                <div>
                  <span className="text-xs font-bold text-indigo-300 uppercase tracking-[0.2em] mb-2 block">Timestamp</span>
                  <div className="flex items-center gap-3 text-lg font-medium text-gray-300">
                    <Calendar size={20} />
                    {insights.callDateTime || 'N/A'}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-4 self-start">
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 text-center min-w-[160px]">
                <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest block mb-2">Automation Score</span>
                <div className="text-4xl font-black mb-1">{insights.automationScore}%</div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className={`h-full transition-all duration-1000 ${insights.automationScore > 60 ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${insights.automationScore}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 px-1">
        <TabButton type="intelligence" label="Intelligence" icon={Brain} />
        <TabButton type="contact" label="Contact Details" icon={Smartphone} />
        <TabButton type="transcript" label="Full Transcript" icon={FileText} />
      </div>

      <div className="min-h-[500px]">
        {activeTab === 'intelligence' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-300">
            <div className="lg:col-span-2 space-y-8">
              {/* ATDS IDENTIFIERS SECTION (Conditional) */}
              {insights.atdsIdentifiers && insights.atdsIdentifiers.length > 0 && (
                <section className="bg-white p-8 rounded-[2rem] shadow-sm border-2 border-purple-100 border-l-8 border-l-purple-600 bg-purple-50/10">
                  <h4 className="flex items-center gap-2 font-black text-purple-900 mb-6 uppercase text-xs tracking-[0.2em]">
                    <Cpu size={18} className="text-purple-600" />
                    ATDS Dialing Identifiers
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {insights.atdsIdentifiers.map((id, i) => {
                      const Icon = atdsIconMap[id] || Zap;
                      return (
                        <div key={i} className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-purple-100 shadow-sm">
                          <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                            <Icon size={18} />
                          </div>
                          <span className="font-bold text-gray-800 text-sm">{id} Detected</span>
                        </div>
                      );
                    })}
                  </div>
                  <p className="mt-4 text-[10px] font-bold text-purple-400 uppercase tracking-widest">
                    Forensic evidence of automated dialing detected in audio stream.
                  </p>
                </section>
              )}

              <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 border-l-8 border-l-indigo-600">
                <h4 className="flex items-center gap-2 font-black text-gray-900 mb-4 uppercase text-xs tracking-[0.2em]">
                  <UserCheck className="text-indigo-600" size={18} />
                  Voice Profile
                </h4>
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-indigo-50 rounded-2xl text-indigo-600">
                    <User size={32} />
                  </div>
                  <div>
                    <span className="text-3xl font-black text-gray-900 tracking-tight">
                      {insights.callerName || (insights.isBusySignal ? "Busy Signal" : "Unidentified")}
                    </span>
                    <p className="text-sm text-gray-500 font-medium">Primary audio participant</p>
                  </div>
                </div>
              </section>

              <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 bg-gradient-to-br from-white to-indigo-50/30">
                <h4 className="flex items-center gap-2 font-black text-gray-900 mb-6 uppercase text-xs tracking-[0.2em]">
                  <Sparkles className="text-indigo-600" size={18} />
                  Executive Narrative
                </h4>
                <p className="text-lg text-gray-800 leading-relaxed font-medium">
                  {insights.summary || "No clear summary could be extracted."}
                </p>
              </section>

              {!insights.isBlankCall && !insights.isBusySignal && (
                <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                  <h4 className="flex items-center gap-2 font-black text-gray-900 mb-6 uppercase text-xs tracking-[0.2em]">
                    <Quote className="text-indigo-600" size={18} />
                    Verbatim Proof
                  </h4>
                  <div className="space-y-6">
                    {insights.keyQuotes && insights.keyQuotes.length > 0 ? insights.keyQuotes.map((quote, i) => (
                      <div key={i} className="relative p-6 bg-gray-50 rounded-2xl border-l-4 border-l-indigo-400 italic text-gray-700 font-medium leading-relaxed">
                        <Quote className="absolute -top-3 -left-1 text-indigo-100 w-10 h-10 -z-10" />
                        "{quote}"
                      </div>
                    )) : (
                      <p className="text-gray-400 italic text-sm">No verbatim proof was extracted from this audio file.</p>
                    )}
                  </div>
                </section>
              )}
            </div>

            <div className="space-y-8">
              <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                <h4 className="flex items-center gap-2 font-black text-gray-900 mb-6 uppercase text-xs tracking-[0.2em]">
                  <Activity className="text-indigo-600" size={18} />
                  Forensic Signals
                </h4>
                <div className="space-y-4">
                   <div className={`p-4 rounded-2xl border ${insights.isBusySignal ? 'bg-red-50 border-red-100' : 'bg-emerald-50 border-emerald-100'}`}>
                      <p className={`text-[10px] font-black uppercase mb-1 ${insights.isBusySignal ? 'text-red-400' : 'text-emerald-400'}`}>Signal Environment</p>
                      <p className={`text-sm font-bold ${insights.isBusySignal ? 'text-red-700' : 'text-emerald-700'}`}>{insights.signalStatus}</p>
                   </div>
                </div>
              </section>

              <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                <h4 className="flex items-center gap-2 font-black text-gray-900 mb-6 uppercase text-xs tracking-[0.2em]">
                  <Shield size={18} className="text-emerald-600" />
                  Regulatory Status
                </h4>
                <div className={`flex flex-col items-center justify-center p-8 rounded-3xl border-2 ${
                  insights.dncRequested ? 'bg-red-50 border-red-200 text-red-900' : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                }`}>
                  <div className={`p-4 rounded-full mb-4 ${insights.dncRequested ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                    {insights.dncRequested ? <Ban size={32} /> : <CheckCircle2 size={32} />}
                  </div>
                  <span className="text-xl font-black text-center">{insights.dncStatusDescription || (insights.dncRequested ? 'DNC Requested' : 'Lead Compliant')}</span>
                </div>
              </section>
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in zoom-in-95 duration-300">
            <div className="bg-white p-10 rounded-[2.5rem] shadow-lg border border-gray-100 flex flex-col items-center text-center space-y-6">
              <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shadow-inner">
                <Phone size={48} />
              </div>
              <h3 className="text-3xl font-black text-gray-900 tracking-tight">{insights.callerContact || 'N/A'}</h3>
              <a href={`tel:${insights.callerContact}`} className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-blue-200">
                Dial Prospect
              </a>
            </div>
            <div className="bg-white p-10 rounded-[2.5rem] shadow-lg border border-gray-100 flex flex-col items-center text-center space-y-6">
              <div className="w-24 h-24 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center shadow-inner">
                <Mail size={48} />
              </div>
              <h3 className="text-3xl font-black text-gray-900 tracking-tight truncate max-w-full">{insights.callerEmail || 'No Email Found'}</h3>
              <a href={insights.callerEmail ? `mailto:${insights.callerEmail}` : '#'} className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-sm ${insights.callerEmail ? 'bg-purple-600 text-white shadow-purple-200 shadow-xl' : 'bg-gray-300 text-white cursor-not-allowed'}`}>
                Compose Email
              </a>
            </div>
          </div>
        )}

        {activeTab === 'transcript' && (
          <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex items-center justify-between mb-8">
              <div className="space-y-1">
                <h4 className="flex items-center gap-2 font-black text-gray-900 uppercase text-xs tracking-[0.2em]">
                  <FileText className="text-indigo-600" size={18} />
                  Recording Transcript
                </h4>
                <p className={`text-[11px] font-black uppercase tracking-widest ${insights.isBusySignal ? 'text-red-500' : 'text-emerald-600'}`}>
                   Status: {insights.signalStatus}
                </p>
              </div>
              <button onClick={() => navigator.clipboard.writeText(fullText)} className="px-6 py-2 text-xs font-bold text-indigo-600 bg-indigo-50 rounded-xl border border-indigo-100">
                Copy Log
              </button>
            </div>
            <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 max-h-[800px] overflow-y-auto font-mono text-[15px] leading-relaxed text-gray-700 whitespace-pre-wrap scrollbar-thin">
              {renderTranscriptWithHighlights(fullText)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
