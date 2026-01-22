
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
  callerContact: string;
  clientContact: string;
  dncRequested: boolean; // Also used for DNC Status
  dncStatusDescription: string; // "Opted In" or "Opted Out"
  entityRelations: string; // Description of other companies and relationships
  
  isAutoAgent: boolean;
  isTransferred: boolean;
  callDateTime: string;

  // Technical Call Signatures
  callDirection: 'Inbound' | 'Outbound' | 'Unknown';
  audioSignatures: string[]; 
  automationScore: number; 
  technicalNotes: string;
  
  // Call Termination
  wasDisconnected: boolean; 
  
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
