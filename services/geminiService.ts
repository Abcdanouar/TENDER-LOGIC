
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { Jurisdiction, TenderAnalysis, GeneratedResponse, CompanyProfile } from "../types";
import { JURISDICTION_CONFIGS } from "../constants";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    // Safely retrieve the API key from process.env, with a fallback to empty string to prevent crash
    const apiKey = typeof process !== 'undefined' && process.env ? process.env.API_KEY : '';
    this.ai = new GoogleGenAI({ apiKey: apiKey || '' });
  }

  async analyzeTender(text: string, jurisdiction: Jurisdiction): Promise<TenderAnalysis> {
    const config = JURISDICTION_CONFIGS[jurisdiction];
    
    const response = await this.ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Context: ${config.prompt}\n\nDocument Text:\n${text.substring(0, 100000)}`,
      config: {
        systemInstruction: `Extract key tender information. Output MUST be in JSON format. Analyze with expert precision.`,
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

    return JSON.parse(response.text || '{}');
  }

  async generateTechnicalProposal(analysis: TenderAnalysis, company: CompanyProfile, jurisdiction: Jurisdiction): Promise<GeneratedResponse> {
    const config = JURISDICTION_CONFIGS[jurisdiction];
    
    const ragContext = company.bidHistory 
      ? `### HISTORICAL WINNING DNA (RAG SOURCE - 10 YEARS BID ARCHIVE) ###\n${company.bidHistory}\n\n`
      : "";

    const response = await this.ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `${ragContext}Tender Analysis: ${JSON.stringify(analysis)}\nCompany Profile: ${JSON.stringify(company)}`,
      config: {
        systemInstruction: `${config.prompt}. Generate a professional 'Mémoire Technique'. IF Historical Bidding DNA is provided, use it as a reference for tone, technical phrasing, and strategic approach. The output MUST be superior quality and highly tailored.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            technicalMemory: { type: Type.STRING, description: "Markdown technical proposal" },
            complianceChecklist: { type: Type.ARRAY, items: { type: Type.STRING } },
            estimatedScore: { type: Type.NUMBER },
            ragInsights: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Specific references to historical successes used in this bid." }
          },
          required: ["technicalMemory", "complianceChecklist", "estimatedScore"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  }

  async generateProjectVisual(prompt: string): Promise<string | undefined> {
    const response = await this.ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: `A high-end professional 3D architectural or technical concept visualization for a procurement project: ${prompt}. Professional, photorealistic, cinematic lighting, corporate engineering style.` }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9",
        }
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
    const response = await this.ai.models.generateContent({
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
