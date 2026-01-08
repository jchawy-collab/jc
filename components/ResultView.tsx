
import React from 'react';
import { TranscriptionResult } from '../types';
import { 
  FileText, ListChecks, Users, Hash, Info, 
  AlertTriangle, Building2, User, Phone, 
  MapPin, ShoppingBag, Calendar, Headset, 
  ArrowRightLeft, Ban, Bot, BarChart3
} from 'lucide-react';

interface ResultViewProps {
  result: TranscriptionResult;
}

export const ResultView: React.FC<ResultViewProps> = ({ result }) => {
  const { fullText, insights } = result;

  const Badge = ({ active, label, icon: Icon, colorClass }: { active: boolean, label: string, icon: any, colorClass: string }) => (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border ${
      active 
        ? `${colorClass} border-current opacity-100 shadow-sm` 
        : 'bg-gray-50 text-gray-400 border-gray-200 opacity-60'
    }`}>
      <Icon size={14} />
      {label}: {active ? 'YES' : 'NO'}
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Primary Call Intelligence Card */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-violet-700 p-6 text-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl">
                <BarChart3 size={28} />
              </div>
              <div>
                <h3 className="text-2xl font-bold">{insights.companyName || 'Unknown Company'}</h3>
                <div className="flex items-center gap-2 text-indigo-100 text-sm opacity-90">
                  <Calendar size={14} />
                  {insights.callDateTime || 'No date found'}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge active={insights.dncRequested} label="DNC" icon={Ban} colorClass="bg-red-50 text-red-600" />
              {/* Corrected: Using 'Bot' from lucide-react instead of 'Robot' */}
              <Badge active={insights.isAutoAgent} label="AUTO AGENT" icon={Bot} colorClass="bg-blue-50 text-blue-600" />
              <Badge active={insights.isTransferred} label="TRANSFER" icon={ArrowRightLeft} colorClass="bg-orange-50 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-100">
          <div className="p-6">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Agent/Caller</label>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><User size={18} /></div>
              <span className="font-semibold text-gray-800">{insights.callerName || 'Unknown'}</span>
            </div>
            <p className="text-xs text-gray-500 mt-2 truncate">{insights.callerContact || 'No contact info'}</p>
          </div>
          
          <div className="p-6">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Offer/Product</label>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><ShoppingBag size={18} /></div>
              <span className="font-semibold text-gray-800">{insights.offeredProduct || 'General Inquiry'}</span>
            </div>
          </div>

          <div className="p-6">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Client Details</label>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><MapPin size={18} /></div>
              <span className="font-medium text-gray-700 text-sm">{insights.clientContact || 'Not mentioned'}</span>
            </div>
          </div>

          <div className="p-6">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Tone Analysis</label>
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold ${
              insights.sentiment === 'Positive' ? 'bg-green-100 text-green-700' :
              insights.sentiment === 'Negative' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
            }`}>
              {insights.sentiment}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Summary & Insights */}
        <div className="lg:col-span-1 space-y-6">
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h4 className="flex items-center gap-2 font-bold text-gray-800 mb-4 uppercase text-xs tracking-widest">
              <Info className="text-indigo-500" size={16} />
              Call Summary
            </h4>
            <p className="text-gray-600 leading-relaxed text-sm">
              {insights.summary}
            </p>
          </section>

          <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h4 className="flex items-center gap-2 font-bold text-gray-800 mb-4 uppercase text-xs tracking-widest">
              <Users className="text-indigo-500" size={16} />
              Speakers Detected
            </h4>
            <div className="flex flex-wrap gap-2">
              {insights.speakers.map((s, i) => (
                <span key={i} className="px-3 py-1 bg-gray-50 text-gray-700 rounded-lg text-xs border border-gray-100">
                  {s}
                </span>
              ))}
            </div>
          </section>

          <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h4 className="flex items-center gap-2 font-bold text-gray-800 mb-4 uppercase text-xs tracking-widest">
              <Hash className="text-indigo-500" size={16} />
              Discussion Tags
            </h4>
            <div className="flex flex-wrap gap-2">
              {insights.keyTopics.map((t, i) => (
                <span key={i} className="px-3 py-1 bg-indigo-50/50 text-indigo-700 rounded-lg text-xs">
                  #{t}
                </span>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Transcription & Tasks */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h4 className="flex items-center gap-2 font-bold text-gray-800 mb-4 uppercase text-xs tracking-widest">
              <ListChecks className="text-indigo-500" size={16} />
              Action Items
            </h4>
            <ul className="space-y-3">
              {insights.actionItems.length > 0 ? insights.actionItems.map((item, i) => (
                <li key={i} className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-sm text-gray-700 flex items-start gap-3">
                  <div className="w-5 h-5 rounded bg-indigo-100 flex items-center justify-center text-indigo-600 mt-0.5 shrink-0">
                    <span className="text-[10px] font-bold">{i+1}</span>
                  </div>
                  {item}
                </li>
              )) : (
                <p className="text-sm text-gray-400 italic">No specific action items identified.</p>
              )}
            </ul>
          </section>

          <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h4 className="flex items-center gap-2 font-bold text-gray-800 uppercase text-xs tracking-widest">
                <FileText className="text-indigo-500" size={16} />
                Full Transcript
              </h4>
              <button 
                onClick={() => navigator.clipboard.writeText(fullText)}
                className="px-3 py-1 text-xs font-bold text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
              >
                Copy Transcript
              </button>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 max-h-[400px] overflow-y-auto scrollbar-thin">
              <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap font-mono">
                {fullText}
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
