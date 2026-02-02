
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

export enum UserRole {
  ADMIN = 'ADMIN',
  EDITOR = 'EDITOR',
  VIEWER = 'VIEWER'
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  subscriptionTier: SubscriptionTier;
  createdAt: string;
  provider: 'email' | 'google';
}

export interface Invitation {
  id: string;
  email?: string;
  role: UserRole;
  token: string;
  status: 'PENDING' | 'ACCEPTED';
  createdAt: string;
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
  bidHistory?: string; // Long-form text containing 10 years of successful bid excerpts (RAG Source)
}

export interface GeneratedResponse {
  technicalMemory: string;
  complianceChecklist: string[];
  estimatedScore: number;
  ragInsights?: string[]; // New: specific pointers found in historical data
}

export interface ExportSettings {
  templateId: string;
  brandColor: string;
  logoUrl: string | null;
  includeCoverPage: boolean;
  includeTableOfContents: boolean;
  headerFooterText: string;
}

export type ViewState = 'landing' | 'auth' | 'dashboard' | 'analysis' | 'generator' | 'image-editor' | 'settings' | 'pricing' | 'team' | 'admin-panel';
