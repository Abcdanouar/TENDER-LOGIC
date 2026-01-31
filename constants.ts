
import { Jurisdiction, SubscriptionTier } from './types';

export const JURISDICTION_CONFIGS: Record<Jurisdiction, { name: string; law: string; prompt: string }> = {
  [Jurisdiction.MOROCCO]: {
    name: 'Morocco',
    law: 'Le Décret des Marchés Publics',
    prompt: 'You are a Moroccan Public Procurement expert. Analyze documents based on "Le Décret des Marchés Publics", focusing on CPS (Cahier des Prescriptions Spéciales) and RC (Règlement de Consultation).'
  },
  [Jurisdiction.EU]: {
    name: 'European Union',
    law: 'Directive 2014/24/EU',
    prompt: 'You are an EU Procurement Law expert. Analyze documents based on Directive 2014/24/EU, focusing on ESPD and TED standards.'
  },
  [Jurisdiction.USA]: {
    name: 'United States',
    law: 'FAR (Federal Acquisition Regulation)',
    prompt: 'You are a US Federal Procurement expert specializing in FAR. Focus on RFP/RFQ formats and SAM.gov compliance.'
  },
  [Jurisdiction.UK]: {
    name: 'United Kingdom',
    law: 'Public Contracts Regulations (PCR)',
    prompt: 'You are a UK Procurement expert specializing in PCR (post-Brexit standards).'
  }
};

export const PRICING_TIERS = [
  { 
    id: SubscriptionTier.FREE, 
    name: 'Free', 
    price: '$0', 
    description: 'Perfect for exploring TenderLogic capabilities.',
    features: ['1 Small PDF Analysis (50pgs)', 'Basic Tender Summary', 'Community Support'],
    limit: 1
  },
  { 
    id: SubscriptionTier.PRO, 
    name: 'Pro', 
    price: '$99/mo', 
    description: 'Advanced features for serious bidding teams.',
    features: ['10 Tenders/mo', 'Full Mémoire Technique generation', 'PDF Export with Branding', 'Standard Support'],
    limit: 10
  },
  { 
    id: SubscriptionTier.ENTERPRISE, 
    name: 'Enterprise', 
    price: '$499/mo', 
    description: 'The ultimate procurement powerhouse.',
    features: ['Unlimited Tenders', 'Custom Knowledge Base (RAG)', 'Team Collaboration', 'Priority 24/7 Support'],
    limit: null
  }
];
