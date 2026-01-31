import { GoogleGenAI, Type } from "@google/genai";
import { Jurisdiction, TenderAnalysis, GeneratedResponse, CompanyProfile } from "../types.ts";
import { JURISDICTION_CONFIGS } from "../constants.ts";

export class GeminiService {
  constructor() {}

  private getClient() {
    // يتم حقن API_KEY بواسطة Vite عند البناء
    return new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async analyzeTender(text: string, jurisdiction: Jurisdiction): Promise<TenderAnalysis> {
    const ai = this.getClient();
    const config = JURISDICTION_CONFIGS[jurisdiction];
    
    // استخدام gemini-3-pro-preview للمهام التحليلية المعقدة
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Context: ${config.prompt}\n\nDocument Text:\n${text.substring(0, 500000)}`,
      config: {
        systemInstruction: `You are an elite procurement analyst. Extract critical data from the tender document. Return ONLY valid JSON.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            technicalSpecs: { type: Type.ARRAY, items: { type: Type.STRING } },
            deadlines: { type: Type.STRING },
            penalties: { type: Type.STRING },
            certifications: { type: Type.ARRAY, items: { type: Type.STRING } },
            scoringCriteria: { type: Type.ARRAY, items: { type: Type.STRING } },
            riskAlerts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  clause: { type: Type.STRING },
                  risk: { type: Type.STRING },
                  level: { type: Type.STRING }
                }
              }
            }
          },
          required: ["title", "technicalSpecs", "deadlines", "penalties", "certifications", "scoringCriteria", "riskAlerts"]
        }
      }
    });

    try {
      return JSON.parse(response.text || '{}');
    } catch (e) {
      console.error("Failed to parse AI response:", e);
      throw new Error("Could not parse tender analysis data.");
    }
  }

  async generateTechnicalProposal(analysis: TenderAnalysis, company: CompanyProfile, jurisdiction: Jurisdiction): Promise<GeneratedResponse> {
    const ai = this.getClient();
    const config = JURISDICTION_CONFIGS[jurisdiction];
    
    const ragContext = company.bidHistory 
      ? `### HISTORICAL CONTEXT ###\n${company.bidHistory}\n\n`
      : "";

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `${ragContext}Tender Analysis: ${JSON.stringify(analysis)}\nCompany Profile: ${JSON.stringify(company)}`,
      config: {
        systemInstruction: `${config.prompt}. Write a high-winning 'Mémoire Technique'. Use historical context for tone if available. Return JSON.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            technicalMemory: { type: Type.STRING },
            complianceChecklist: { type: Type.ARRAY, items: { type: Type.STRING } },
            estimatedScore: { type: Type.NUMBER },
            ragInsights: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["technicalMemory", "complianceChecklist", "estimatedScore"]
        }
      }
    });

    try {
      return JSON.parse(response.text || '{}');
    } catch (e) {
      console.error("Failed to parse AI proposal response:", e);
      throw new Error("Could not generate technical proposal.");
    }
  }

  async generateProjectVisual(prompt: string): Promise<string | undefined> {
    const ai = this.getClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `Professional engineering visualization: ${prompt}` }]
      },
      config: {
        imageConfig: { aspectRatio: "16:9" }
      }
    });

    for (const part of response.candidates?.[0]?.content.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return undefined;
  }

  async editSchemaImage(base64Image: string, prompt: string): Promise<string | undefined> {
    const ai = this.getClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { data: base64Image, mimeType: 'image/png' } },
          { text: prompt }
        ]
      }
    });

    for (const part of response.candidates?.[0]?.content.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return undefined;
  }
}