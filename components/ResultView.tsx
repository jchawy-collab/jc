
import React from 'react';
import { TranscriptionResult } from '../types';
import { 
  FileText, ListChecks, Building2, Phone, ShoppingBag, 
  Calendar, Ban, Bot, PhoneIncoming, PhoneOutgoing, Activity,
  Music, Volume2, CheckCircle2,
  PhoneOff, Clock, Layers, Megaphone,
  Mail, ShieldCheck, MessageSquareQuote, History, UserCheck,
  Link, Sparkles, User
} from 'lucide-react';

interface ResultViewProps {
  result: TranscriptionResult;
}

export const ResultView: React.FC<ResultViewProps> = ({ result }) => {
  const { fullText, insights, fileName } = result;

  // Improved direction detection
  const displayDirection = insights.callDirection !== 'Unknown' && insights.callDirection
    ? insights.callDirection 
    : (fileName.toLowerCase().includes('inbound') ? 'Inbound' : 'Outbound');

  const hasIdentifiers = insights.audioSignatures.length > 0 || insights.hasHoldMusic || insights.agentMentionedAutoDialer;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24 max-w-7xl mx-auto px-4 md:px-0">
      
      {/* 1. MAIN HEADER */}
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
                  <span className="text-[10px] font-mono text-indigo-200 truncate max-w-[200px]">Source: {fileName}</span>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-indigo-300 uppercase tracking-[0.2em] mb-2 block">Company Name</span>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none">
                  {insights.companyName || 'Not Identified'}
                </h1>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                <div>
                  <span className="text-xs font-bold text-indigo-300 uppercase tracking-[0.2em] mb-2 block">Caller Number</span>
                  <div className="flex items-center gap-3 text-2xl font-mono font-bold text-indigo-200">
                    <Phone size={24} />
                    {insights.callerContact || 'N/A'}
                  </div>
                </div>
                <div>
                  <span className="text-xs font-bold text-indigo-300 uppercase tracking-[0.2em] mb-2 block">Date & Time</span>
                  <div className="flex items-center gap-3 text-lg font-medium text-gray-300">
                    <Calendar size={20} />
                    {insights.callDateTime || 'No timestamp record'}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-4 self-start">
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 text-center">
                <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest block mb-2">Lead Score</span>
                <div className="text-4xl font-black mb-1">{insights.automationScore}%</div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${insights.automationScore > 70 ? 'bg-red-500' : insights.automationScore > 30 ? 'bg-yellow-500' : 'bg-green-500'}`}
                    style={{ width: `${insights.automationScore}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT & CENTER COLUMNS */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* AGENT NAME - NEW SECTION */}
          <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 border-l-8 border-l-indigo-600">
            <h4 className="flex items-center gap-2 font-black text-gray-900 mb-4 uppercase text-xs tracking-[0.2em]">
              <UserCheck className="text-indigo-600" size={18} />
              Identified Agent
            </h4>
            <div className="flex items-center gap-4">
              <div className="p-4 bg-indigo-50 rounded-2xl text-indigo-600">
                <User size={32} />
              </div>
              <div>
                <span className="text-3xl font-black text-gray-900 tracking-tight">
                  {insights.callerName || "Unidentified Agent"}
                </span>
                <p className="text-sm text-gray-500 font-medium">Primary contact detected in recording</p>
              </div>
            </div>
          </section>

          {/* NARRATIVE SUMMARY */}
          <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 bg-gradient-to-br from-white to-indigo-50/30">
            <h4 className="flex items-center gap-2 font-black text-gray-900 mb-6 uppercase text-xs tracking-[0.2em]">
              <Sparkles className="text-indigo-600" size={18} />
              Narrative Summary
            </h4>
            <p className="text-lg text-gray-800 leading-relaxed font-medium">
              {insights.summary || "No high-level summary available for this recording."}
            </p>
          </section>

          {/* 2. TECHNICAL IDENTIFIERS */}
          {hasIdentifiers && (
            <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 border-l-8 border-l-amber-500">
              <h4 className="flex items-center gap-2 font-black text-gray-900 mb-6 uppercase text-xs tracking-[0.2em]">
                <Activity className="text-amber-500" size={18} />
                Technical Identifiers (ATDS / AAS)
              </h4>
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-4">Detected Indicators</span>
                  <div className="flex flex-wrap gap-3">
                    {insights.hasHoldMusic && (
                      <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-xl text-sm font-bold border border-amber-100">
                        <Music size={16} /> Holding Music
                      </div>
                    )}
                    {insights.audioSignatures.map((sig, i) => {
                      const s = sig.toLowerCase();
                      const Icon = s.includes('tone') ? Volume2 : s.includes('ivr') ? Layers : s.includes('pre-recorded') ? Megaphone : Clock;
                      return (
                        <div key={i} className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-700 rounded-xl text-sm font-bold border border-gray-100">
                          <Icon size={16} /> {sig}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {insights.agentMentionedAutoDialer && (
                  <div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-3">Dialer Mention</span>
                    <div className="p-4 bg-red-50 text-red-900 rounded-2xl border border-red-100 flex items-start gap-3">
                      <MessageSquareQuote size={20} className="mt-0.5 shrink-0" />
                      <p className="text-sm font-bold italic">"Agent explicitly mentioned using auto-dialing technology during the call"</p>
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* 4. CALL SUMMARY (STRUCTURED POINTS) */}
          <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
            <h4 className="flex items-center gap-2 font-black text-gray-900 mb-8 uppercase text-xs tracking-[0.2em]">
              <ListChecks className="text-indigo-600" size={18} />
              Structured Intelligence
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Caller Identity</label>
                  <div className="flex items-center gap-3 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
                    <UserCheck className="text-indigo-600" size={18} />
                    <span className="text-sm font-bold text-gray-900">{insights.callerName || 'Unidentified'} from {insights.companyName || 'Not Found'}</span>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Offer</label>
                  <div className="flex items-center gap-3 p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100/50">
                    <ShoppingBag className="text-emerald-600" size={18} />
                    <span className="text-sm font-bold text-gray-800">{insights.offeredProduct || 'No product identified'}</span>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Contact Info</label>
                  <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50 space-y-2">
                    <div className="flex items-center gap-3 text-sm font-medium text-gray-700">
                      <Mail size={16} className="text-blue-600" />
                      {insights.clientContact || 'No emails found in transcript'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">DNC Presence</label>
                  <div className={`flex items-center gap-3 p-4 rounded-2xl border ${insights.dncRequested ? 'bg-red-50 border-red-100 text-red-700' : 'bg-green-50 border-green-100 text-green-700'}`}>
                    {insights.dncRequested ? <Ban size={18} /> : <CheckCircle2 size={18} />}
                    <span className="text-sm font-black uppercase tracking-widest">{insights.dncRequested ? 'Yes' : 'No'}</span>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Entity Relations</label>
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <p className="text-xs text-gray-600 leading-relaxed italic">
                      {insights.entityRelations || 'No external relationships were identified in this conversation.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 5. TRANSCRIPTION SECTION */}
          <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <h4 className="flex items-center gap-2 font-black text-gray-900 uppercase text-xs tracking-[0.2em]">
                <FileText className="text-indigo-600" size={18} />
                Full Transcription
              </h4>
              <button 
                onClick={() => navigator.clipboard.writeText(fullText)}
                className="px-4 py-2 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-all border border-indigo-100"
              >
                Copy
              </button>
            </div>
            <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 max-h-[600px] overflow-y-auto font-mono text-[13px] leading-relaxed text-gray-700 whitespace-pre-wrap scrollbar-thin">
              {fullText}
            </div>
          </section>
        </div>

        {/* 3. RIGHT COLUMN: DNC STATUS & ACTIONS */}
        <div className="space-y-8">
          <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
            <h4 className="flex items-center gap-2 font-black text-gray-900 mb-6 uppercase text-xs tracking-[0.2em]">
              <ShieldCheck className="text-emerald-600" size={18} />
              DNC Status
            </h4>
            <div className={`flex flex-col items-center justify-center p-8 rounded-3xl border-2 transition-all ${
              insights.dncRequested ? 'bg-red-50 border-red-200 text-red-900' : 'bg-emerald-50 border-emerald-200 text-emerald-900'
            }`}>
              <div className={`p-4 rounded-full mb-4 ${insights.dncRequested ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                {insights.dncRequested ? <Ban size={32} /> : <ShieldCheck size={32} />}
              </div>
              <div className="text-center">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-60 block mb-1">Status</span>
                <span className="text-2xl font-black">{insights.dncStatusDescription || (insights.dncRequested ? 'Opted Out' : 'Opted In')}</span>
              </div>
            </div>
          </section>

          <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
            <h4 className="flex items-center gap-2 font-black text-gray-900 mb-6 uppercase text-xs tracking-[0.2em]">
              <History className="text-indigo-500" size={18} />
              Action Items
            </h4>
            <div className="space-y-3">
              {insights.actionItems.length > 0 ? insights.actionItems.map((item, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-xs font-medium text-gray-700 flex items-start gap-3">
                  <div className="w-5 h-5 rounded-lg bg-indigo-600 flex items-center justify-center text-white mt-0.5 shrink-0 text-[10px] font-bold">
                    {i+1}
                  </div>
                  {item}
                </div>
              )) : (
                <div className="text-center py-6 text-gray-400 text-xs italic">
                  No action items identified.
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
