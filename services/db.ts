
// Fix: Use default Dexie import to ensure class methods like 'version' are correctly inherited and typed
import Dexie from 'dexie';
import type { Table } from 'dexie';
import { User, TenderAnalysis, CompanyProfile } from '../types';

export interface DBLog {
  id?: number;
  timestamp: string;
  event: string;
  type: 'INFO' | 'WARN' | 'SUCCESS' | 'ADMIN';
  userId?: string;
}

// Inherit from Dexie base class to manage IndexedDB tables
export class TenderLogicDatabase extends Dexie {
  users!: Table<User>;
  tenders!: Table<TenderAnalysis & { id?: number; userId: string; createdAt: string }>;
  profiles!: Table<CompanyProfile & { userId: string }>;
  logs!: Table<DBLog>;

  constructor() {
    super('TenderLogicDB');
    // Define the database schema. The 'version' method is inherited from Dexie.
    this.version(1).stores({
      users: 'id, email, role',
      tenders: '++id, userId, title, createdAt',
      profiles: 'userId, name',
      logs: '++id, timestamp, type, userId'
    });
  }
}

export const db = new TenderLogicDatabase();
