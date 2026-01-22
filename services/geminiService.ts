
import { GoogleGenAI, Type } from "@google/genai";
import { ExtractedData } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async processAudio(base64Audio: string, mimeType: string, fileName: string): Promise<{ fullText: string; insights: ExtractedData }> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const model = "gemini-3-flash-preview";

    // 1. Verbatim Transcription
    const transcriptionResponse = await ai.models.generateContent({
      model,
      contents: [
        {
          parts: [
            { inlineData: { data: base64Audio, mimeType } },
            { text: `Transcribe this audio verbatim. Mark [Connection Tone], [Disconnection Tone], [Hold Music], [Noticeable Delay], [IVR Prompt], and [Pre-recorded Message] in brackets where they occur. Filename provided: ${fileName}` }
          ]
        }
      ]
    });

    const fullText = transcriptionResponse.text || "No transcription available.";

    // 2. Structured Extraction
    const extractionResponse = await ai.models.generateContent({
      model,
      contents: [
        {
          parts: [
            { inlineData: { data: base64Audio, mimeType } },
            { text: `Analyze the transcript, audio, and the filename: "${fileName}".
            
            EXTREMELY IMPORTANT:
            1. Extract 'callerContact' (Phone Number), 'callDateTime' (Date/Time), and 'companyName' by first analyzing the FILENAME string. 
            2. High-Level Summary: Provide a concise 2-3 sentence narrative in the 'summary' field explaining the purpose of the call and the outcome.
            3. Detailed Notes: Populate 'structuredNotes' with 4 specific points covering identity, the offer details, contact info mentioned, and entity relations.
            4. Determine 'dncStatusDescription': "Opted Out" if DNC/Opt-out was requested, else "Opted In".
            5. Detect 'isAutoAgent' (Bot/IVR), 'hasHoldMusic', 'agentMentionedAutoDialer'.
            
            Contextual Transcript: ${fullText}` }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: "Concise narrative summary of the call." },
            structuredNotes: { type: Type.ARRAY, items: { type: Type.STRING } },
            keyTopics: { type: Type.ARRAY, items: { type: Type.STRING } },
            actionItems: { type: Type.ARRAY, items: { type: Type.STRING } },
            speakers: { type: Type.ARRAY, items: { type: Type.STRING } },
            sentiment: { type: Type.STRING },
            companyName: { type: Type.STRING },
            callerName: { type: Type.STRING },
            offeredProduct: { type: Type.STRING },
            callerContact: { type: Type.STRING },
            clientContact: { type: Type.STRING },
            dncRequested: { type: Type.BOOLEAN },
            dncStatusDescription: { type: Type.STRING },
            entityRelations: { type: Type.STRING },
            isAutoAgent: { type: Type.BOOLEAN },
            isTransferred: { type: Type.BOOLEAN },
            callDateTime: { type: Type.STRING },
            callDirection: { type: Type.STRING },
            audioSignatures: { type: Type.ARRAY, items: { type: Type.STRING } },
            automationScore: { type: Type.INTEGER },
            technicalNotes: { type: Type.STRING },
            wasDisconnected: { type: Type.BOOLEAN },
            hasHoldMusic: { type: Type.BOOLEAN },
            agentMentionedAutoDialer: { type: Type.BOOLEAN }
          },
          required: [
            "summary", "companyName", "callerName", "offeredProduct", "callerContact", "clientContact", 
            "dncRequested", "dncStatusDescription", "entityRelations", "isAutoAgent", "isTransferred", 
            "callDateTime", "callDirection", "audioSignatures", "automationScore", "technicalNotes", 
            "wasDisconnected", "hasHoldMusic", "agentMentionedAutoDialer"
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
