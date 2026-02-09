
export interface ExtractedData {
  summary: string;
  structuredNotes: string[]; 
  keyTopics: string[];
  actionItems: string[];
  speakers: string[];
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  
  // Lead Generation Fields
  companyName: string;
  callerName: string;
  offeredProduct: string;
  callerContact: string; // Phone number
  callerEmail: string; // Email address
  clientContact: string; // Generic other contact info
  dncRequested: boolean; 
  dncStatusDescription: string; 
  entityRelations: string; 
  
  // Verbatim Grounding
  keyQuotes: string[]; // Verbatim significant excerpts

  isAutoAgent: boolean;
  isTransferred: boolean;
  callDateTime: string;

  // Technical Call Signatures
  callDirection: 'Inbound' | 'Outbound' | 'Unknown';
  audioSignatures: string[]; 
  atdsIdentifiers: string[]; // Specific ATDS markers: "Hold Music", "Pre-recorded Message", "Noticeable Delay", "Connection Tone", "Disconnection Tone"
  automationScore: number; 
  technicalNotes: string;
  
  // Call Termination & Status
  wasDisconnected: boolean; 
  isBusySignal: boolean;
  isBlankCall: boolean;
  signalStatus: string; 
  
  // Technical Audio Detection
  hasHoldMusic: boolean; 
  agentMentionedAutoDialer: boolean;
}

export interface TranscriptionResult {
  fullText: string;
  insights: ExtractedData;
  timestamp: number;
  fileName: string;
}

export enum AppStatus {
  IDLE = 'IDLE',
  RECORDING = 'RECORDING',
  UPLOADING = 'UPLOADING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}
