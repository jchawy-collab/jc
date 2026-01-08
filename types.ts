
export interface ExtractedData {
  summary: string;
  keyTopics: string[];
  actionItems: string[];
  speakers: string[];
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  
  // Specific Extraction Fields
  companyName: string;
  callerName: string;
  offeredProduct: string;
  callerContact: string; // Phone/Email/Address
  clientContact: string; // Email/Physical Address
  dncRequested: boolean; // Do Not Call
  isAutoAgent: boolean;
  isTransferred: boolean;
  callDateTime: string;
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
