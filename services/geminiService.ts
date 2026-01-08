
import { GoogleGenAI, Type } from "@google/genai";
import { ExtractedData } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    // Initialized with the direct process.env.API_KEY as per instructions.
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async processAudio(base64Audio: string, mimeType: string, fileName: string): Promise<{ fullText: string; insights: ExtractedData }> {
    const model = "gemini-3-flash-preview";

    // 1. Get Transcription & Initial Analysis
    const transcriptionResponse = await this.ai.models.generateContent({
      model,
      contents: [
        {
          parts: [
            { inlineData: { data: base64Audio, mimeType } },
            { text: `Please provide a verbatim transcription of this audio. Also, identify if this is a business call. Filename: ${fileName}` }
          ]
        }
      ]
    });

    const fullText = transcriptionResponse.text || "No transcription available.";

    // 2. Extract Structured Data with specific lead-gen focus
    const extractionResponse = await this.ai.models.generateContent({
      model,
      contents: [
        {
          parts: [
            { text: `You are an expert Call Quality Auditor. Analyze the following transcription and file metadata. 
            Extract detailed business information into the specified JSON format.
            
            Context:
            - Filename: ${fileName}
            - Transcription: ${fullText}
            
            Rules:
            - Extract 'callDateTime' from the conversation if mentioned, or infer it from the filename.
            - 'dncRequested' is true if the client asks to be removed from the list or not to be called again.
            - 'isAutoAgent' is true if the initial speaker is an automated system or AI.
            - 'isTransferred' is true if the call moves from one agent/system to another person.` }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            keyTopics: { type: Type.ARRAY, items: { type: Type.STRING } },
            actionItems: { type: Type.ARRAY, items: { type: Type.STRING } },
            speakers: { type: Type.ARRAY, items: { type: Type.STRING } },
            sentiment: { type: Type.STRING },
            companyName: { type: Type.STRING, description: "Name of the business representing the caller." },
            callerName: { type: Type.STRING, description: "Name of the person who initiated or is handling the call." },
            offeredProduct: { type: Type.STRING, description: "The specific product or service being discussed or offered." },
            callerContact: { type: Type.STRING, description: "Caller's phone, email, or office address." },
            clientContact: { type: Type.STRING, description: "The client/customer's email or physical address." },
            dncRequested: { type: Type.BOOLEAN, description: "True if 'Do Not Call' was requested." },
            isAutoAgent: { type: Type.BOOLEAN, description: "True if an automated agent/bot was detected." },
            isTransferred: { type: Type.BOOLEAN, description: "True if the call was transferred to another person." },
            callDateTime: { type: Type.STRING, description: "Date and time of the call extracted from context." }
          },
          required: [
            "summary", "keyTopics", "actionItems", "speakers", "sentiment", 
            "companyName", "callerName", "offeredProduct", "callerContact", 
            "clientContact", "dncRequested", "isAutoAgent", "isTransferred", "callDateTime"
          ]
        }
      }
    });

    try {
      // Accessing the .text property directly as per Gemini API guidelines.
      const insights = JSON.parse(extractionResponse.text || "{}") as ExtractedData;
      return { fullText, insights };
    } catch (error) {
      console.error("Failed to parse JSON insights:", error);
      throw new Error("Failed to extract structured lead data from transcription.");
    }
  }
}
