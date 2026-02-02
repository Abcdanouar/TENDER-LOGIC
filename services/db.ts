
// Fix: Use standard Dexie class inheritance from 'dexie' package to ensure types are recognized correctly by the TypeScript compiler
import { Dexie, type Table } from 'dexie';
import { User, TenderAnalysis, CompanyProfile, SubscriptionTier } from '../types';

export interface DBLog {
  id?: number;
  timestamp: string;
  event: string;
  type: 'INFO' | 'WARN' | 'SUCCESS' | 'ADMIN';
  userId?: string;
}

export class TenderLogicDatabase extends Dexie {
  users!: Table<User>;
  tenders!: Table<TenderAnalysis & { id?: number; userId: string; createdAt: string }>;
  profiles!: Table<CompanyProfile & { userId: string }>;
  logs!: Table<DBLog>;

  constructor() {
    super('TenderLogicDB');
    // Fix: version method is inherited from the Dexie base class
    this.version(1).stores({
      users: 'id, email, role',
      tenders: '++id, userId, title, createdAt',
      profiles: 'userId, name',
      logs: '++id, timestamp, type, userId'
    });
  }
}

export const db = new TenderLogicDatabase();
