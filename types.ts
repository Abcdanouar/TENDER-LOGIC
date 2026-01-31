
export enum Language {
  EN = 'en',
  FR = 'fr',
  AR = 'ar'
}

export enum Jurisdiction {
  MOROCCO = 'MA',
  EU = 'EU',
  USA = 'USA',
  UK = 'UK'
}

export enum SubscriptionTier {
  FREE = 'FREE',
  PRO = 'PRO',
  ENTERPRISE = 'ENTERPRISE'
}

export interface UserSubscription {
  tier: SubscriptionTier;
  tendersUsed: number;
  maxTenders: number | null; // null for unlimited
}

export interface TenderAnalysis {
  title: string;
  technicalSpecs: string[];
  deadlines: string;
  penalties: string;
  certifications: string[];
  scoringCriteria: string[];
  riskAlerts: {
    clause: string;
    risk: string;
    level: 'High' | 'Medium' | 'Low';
  }[];
}

export interface CompanyProfile {
  name: string;
  experience: string;
  certifications: string[];
  pastProjects: string[];
}

export interface GeneratedResponse {
  technicalMemory: string;
  complianceChecklist: string[];
  estimatedScore: number;
}

export interface ExportSettings {
  templateId: string;
  brandColor: string;
  logoUrl: string | null;
  includeCoverPage: boolean;
  includeTableOfContents: boolean;
  headerFooterText: string;
}

export type ViewState = 'landing' | 'dashboard' | 'analysis' | 'generator' | 'image-editor' | 'settings' | 'pricing';
