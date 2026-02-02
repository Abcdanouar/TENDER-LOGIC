
import { db, DBLog } from './db.ts';
import { User, TenderAnalysis, CompanyProfile, SubscriptionTier } from '../types.ts';

export class BackendService {
  async saveUser(user: User) {
    await db.users.put(user);
    await this.log({
      timestamp: new Date().toISOString(),
      event: `User ${user.email} session saved/updated`,
      type: 'INFO',
      userId: user.id
    });
  }

  async getUser(id: string) {
    return await db.users.get(id);
  }

  async saveTender(userId: string, analysis: TenderAnalysis) {
    const entry = {
      ...analysis,
      userId,
      createdAt: new Date().toISOString()
    };
    const id = await db.tenders.add(entry);
    await this.log({
      timestamp: new Date().toISOString(),
      event: `New tender analyzed: ${analysis.title}`,
      type: 'SUCCESS',
      userId
    });
    return id;
  }

  async getTenders(userId: string) {
    return await db.tenders.where('userId').equals(userId).toArray();
  }

  async saveProfile(userId: string, profile: CompanyProfile) {
    await db.profiles.put({ ...profile, userId });
  }

  async getProfile(userId: string) {
    return await db.profiles.get(userId);
  }

  async log(log: DBLog) {
    await db.logs.add(log);
  }

  async getAllLogs() {
    return await db.logs.orderBy('timestamp').reverse().limit(50).toArray();
  }

  async exportDatabase() {
    const users = await db.users.toArray();
    const tenders = await db.tenders.toArray();
    const logs = await db.logs.toArray();
    const profiles = await db.profiles.toArray();
    
    const data = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      tables: { users, tenders, logs, profiles }
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tenderlogic_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  }

  async importDatabase(jsonFile: File) {
    const text = await jsonFile.text();
    const data = JSON.parse(text);
    
    // Fix: transaction method is inherited from the Dexie base class on the db instance
    await db.transaction('rw', [db.users, db.tenders, db.logs, db.profiles], async () => {
      await db.users.clear();
      await db.tenders.clear();
      await db.logs.clear();
      await db.profiles.clear();
      
      await db.users.bulkAdd(data.tables.users);
      await db.tenders.bulkAdd(data.tables.tenders);
      await db.logs.bulkAdd(data.tables.logs);
      await db.profiles.bulkAdd(data.tables.profiles);
    });
    
    return true;
  }
}

export const backend = new BackendService();
