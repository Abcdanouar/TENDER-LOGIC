import { GoogleGenAI, Type } from "@google/genai";
import { Jurisdiction, TenderAnalysis, GeneratedResponse, CompanyProfile } from "../types.ts";
import { JURISDICTION_CONFIGS } from "../constants.ts";

export class GeminiService {
  constructor() {}

  private getClient() {
    return new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async analyzeTender(text: string, jurisdiction: Jurisdiction): Promise<TenderAnalysis> {
    const ai = this.getClient();
    const config = JURISDICTION_CONFIGS[jurisdiction];
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Context: ${config.prompt}\n\nDocument Text:\n${text.substring(0, 500000)}`,
      config: {
        systemInstruction: `You are a high-level procurement legal analyst. Extract mission-critical tender information. Output MUST be in pure JSON format.`,
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
                  level: { type: Type.STRING, description: "High, Medium, or Low" }
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
      console.error("JSON parsing failed for analysis", e);
      throw new Error("Analysis failed to produce structured data.");
    }
  }

  async generateTechnicalProposal(analysis: TenderAnalysis, company: CompanyProfile, jurisdiction: Jurisdiction): Promise<GeneratedResponse> {
    const ai = this.getClient();
    const config = JURISDICTION_CONFIGS[jurisdiction];
    
    const ragContext = company.bidHistory 
      ? `### HISTORICAL WINNING BID ARCHIVE (RAG SOURCE) ###\n${company.bidHistory}\n\n`
      : "";

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `${ragContext}Tender Analysis: ${JSON.stringify(analysis)}\nCompany Profile: ${JSON.stringify(company)}`,
      config: {
        systemInstruction: `${config.prompt}. Generate a professional 'Mémoire Technique'. If RAG context is provided, prioritize the tone and technical strategies found within it. Output must be valid JSON.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            technicalMemory: { type: Type.STRING, description: "Full technical proposal in Markdown format." },
            complianceChecklist: { type: Type.ARRAY, items: { type: Type.STRING } },
            estimatedScore: { type: Type.NUMBER, description: "Score from 0-100 based on rubric match." },
            ragInsights: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Specific winning strategies reused." }
          },
          required: ["technicalMemory", "complianceChecklist", "estimatedScore"]
        }
      }
    });

    try {
      return JSON.parse(response.text || '{}');
    } catch (e) {
      console.error("JSON parsing failed for proposal", e);
      throw new Error("Proposal generation failed to produce structured data.");
    }
  }

  async generateProjectVisual(prompt: string): Promise<string | undefined> {
    const ai = this.getClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: `High-fidelity engineering concept visualization: ${prompt}. Cinematic 4k, professional lighting, technical realism.` }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9"
        }
      }
    });

    const parts = response.candidates?.[0]?.content?.parts;
    if (parts) {
      for (const part of parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
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
          { text: `Edit this technical diagram as follows: ${prompt}` }
        ]
      }
    });

    const parts = response.candidates?.[0]?.content?.parts;
    if (parts) {
      for (const part of parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    return undefined;
  }
}