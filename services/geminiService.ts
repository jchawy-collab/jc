
import { GoogleGenAI, Type } from "@google/genai";
import { ExtractedData } from "../types";

export class GeminiService {
  constructor() {}

  async processAudio(base64Audio: string, mimeType: string, fileName: string): Promise<{ fullText: string; insights: ExtractedData }> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const model = "gemini-3-pro-preview";

    // 1. Verbatim Transcription with ATDS Marker Detection
    const transcriptionResponse = await ai.models.generateContent({
      model,
      contents: [
        {
          parts: [
            { inlineData: { data: base64Audio, mimeType } },
            { 
              text: `TASK: Provide a verbatim transcript. 
              
              TECHNICAL AUDIT: Identify these specific ATDS (Automated Telephone Dialing System) markers:
              - [Hold Music]: Background music while waiting.
              - [Pre-recorded Message]: Automated voice playing a message.
              - [Noticeable Delay]: A gap of 2+ seconds of silence before the agent speaks (Dead Air/Connection Lag).
              - [Connection Tone]: A beep or tone immediately when the call connects.
              - [Disconnection Tone]: A beep or tone when the call ends.
              
              If you hear a sustained rhythmic 'beep-beep' engaged tone, label as [Signal: Verified Busy Signal]. 
              Otherwise, if it's a standard call, use [Signal: Clear Connection].
              
              Filename: ${fileName}` 
            }
          ]
        }
      ]
    });

    const fullText = transcriptionResponse.text || "No transcription available.";

    // 2. Structured Extraction for ATDS Evidence
    const extractionResponse = await ai.models.generateContent({
      model,
      contents: [
        {
          parts: [
            { inlineData: { data: base64Audio, mimeType } },
            { text: `Analyze the audio and this transcript: "${fullText}".
            
            ATDS IDENTIFIER RULES:
            Populate 'atdsIdentifiers' array ONLY with markers clearly heard:
            - "Hold Music"
            - "Pre-recorded Message"
            - "Noticeable Delay"
            - "Connection Tone"
            - "Disconnection Tone"
            
            If none are present, return an empty array. Do not guess.
            
            Also extract standard lead data.` }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            structuredNotes: { type: Type.ARRAY, items: { type: Type.STRING } },
            keyTopics: { type: Type.ARRAY, items: { type: Type.STRING } },
            actionItems: { type: Type.ARRAY, items: { type: Type.STRING } },
            speakers: { type: Type.ARRAY, items: { type: Type.STRING } },
            sentiment: { type: Type.STRING },
            companyName: { type: Type.STRING },
            callerName: { type: Type.STRING },
            offeredProduct: { type: Type.STRING },
            callerContact: { type: Type.STRING },
            callerEmail: { type: Type.STRING },
            clientContact: { type: Type.STRING },
            dncRequested: { type: Type.BOOLEAN },
            dncStatusDescription: { type: Type.STRING },
            entityRelations: { type: Type.STRING },
            keyQuotes: { type: Type.ARRAY, items: { type: Type.STRING } },
            isAutoAgent: { type: Type.BOOLEAN },
            isTransferred: { type: Type.BOOLEAN },
            callDateTime: { type: Type.STRING },
            callDirection: { type: Type.STRING },
            audioSignatures: { type: Type.ARRAY, items: { type: Type.STRING } },
            atdsIdentifiers: { type: Type.ARRAY, items: { type: Type.STRING } },
            automationScore: { type: Type.INTEGER },
            technicalNotes: { type: Type.STRING },
            wasDisconnected: { type: Type.BOOLEAN },
            isBusySignal: { type: Type.BOOLEAN },
            isBlankCall: { type: Type.BOOLEAN },
            signalStatus: { type: Type.STRING },
            hasHoldMusic: { type: Type.BOOLEAN },
            agentMentionedAutoDialer: { type: Type.BOOLEAN }
          },
          required: [
            "summary", "companyName", "callerName", "offeredProduct", "callerContact", "callerEmail", "clientContact", 
            "dncRequested", "dncStatusDescription", "entityRelations", "keyQuotes", "isAutoAgent", "isTransferred", 
            "callDateTime", "callDirection", "audioSignatures", "atdsIdentifiers", "automationScore", "technicalNotes", 
            "wasDisconnected", "isBusySignal", "isBlankCall", "signalStatus", "hasHoldMusic", "agentMentionedAutoDialer"
          ]
        }
      }
    });

    try {
      const insights = JSON.parse(extractionResponse.text || "{}") as ExtractedData;
      return { fullText, insights };
    } catch (error) {
      console.error("Extraction Parse Error:", error);
      throw new Error("Failed to extract structured intelligence.");
    }
  }
}
