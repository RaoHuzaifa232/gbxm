import { Injectable, signal } from '@angular/core';
import { OperatorProfile, OperatorStatus } from '@gbxm/core/models/operator-profile.model';

const MOCK_PROFILES: OperatorProfile[] = [
  {
    userId: '36574',
    firstName: 'John',
    lastName: 'Smith',
    preferred: 'Johnny',
    operator: 'Associate Representative',
    personalEmail: 'john.smith@email.com',
    cellAndText: '+1 234 567 8901',
    contactEmail: 'licensingM01@gbxm.com',
    companyEmail: 'john.smith@gbxm.com',
    linkedIn: 'linkedin.com/in/johnsmith',
    teamsId: 'john.smith',
    aboutMe: 'Experienced hospitality professional with over 10 years in the industry.',
    tradingEntity: 'Smith Hospitality Ltd',
    registrationNumber: 'REG-2021-001',
    digitalPresence1: 'www.johnsmith.com',
    status: 'pending',
    statusHistory: [
      { status: 'draft', timestamp: '2024-11-01T09:00:00.000Z' },
      { status: 'pending', timestamp: '2024-11-05T14:30:00.000Z' },
    ],
    updatedAt: '2024-11-05T14:30:00.000Z',
  },
  {
    userId: '47291',
    firstName: 'Sarah',
    lastName: 'Johnson',
    preferred: 'Sara',
    operator: 'Senior Representative',
    personalEmail: 'sarah.johnson@email.com',
    cellAndText: '+1 345 678 9012',
    contactEmail: 'licensingM02@gbxm.com',
    companyEmail: 'sarah.johnson@gbxm.com',
    linkedIn: 'linkedin.com/in/sarahjohnson',
    teamsId: 'sarah.johnson',
    aboutMe: 'Passionate about luxury hospitality and guest experience management.',
    tradingEntity: 'Johnson Hospitality Group',
    registrationNumber: 'REG-2021-002',
    digitalPresence1: 'www.sarahjohnson.com',
    digitalPresence2: 'instagram.com/sarahjohnson',
    status: 'verified',
    statusHistory: [
      { status: 'draft', timestamp: '2024-10-15T10:00:00.000Z' },
      { status: 'pending', timestamp: '2024-10-20T09:15:00.000Z' },
      { status: 'verified', timestamp: '2024-10-28T16:45:00.000Z' },
    ],
    updatedAt: '2024-10-28T16:45:00.000Z',
  },
  {
    userId: '58302',
    firstName: 'Michael',
    lastName: 'Williams',
    operator: 'Associate Representative',
    personalEmail: 'michael.williams@email.com',
    cellAndText: '+1 456 789 0123',
    contactEmail: 'licensingM03@gbxm.com',
    companyEmail: 'michael.williams@gbxm.com',
    tradingEntity: 'Williams & Co',
    registrationNumber: 'REG-2021-003',
    status: 'rejected',
    statusHistory: [
      { status: 'draft', timestamp: '2024-10-10T08:00:00.000Z' },
      { status: 'pending', timestamp: '2024-10-18T11:00:00.000Z' },
      { status: 'rejected', timestamp: '2024-11-02T09:30:00.000Z' },
    ],
    updatedAt: '2024-11-02T09:30:00.000Z',
  },
  {
    userId: '61459',
    firstName: 'Emily',
    lastName: 'Brown',
    preferred: 'Em',
    operator: 'Associate Representative',
    personalEmail: 'emily.brown@email.com',
    cellAndText: '+1 567 890 1234',
    contactEmail: 'licensingM04@gbxm.com',
    companyEmail: 'emily.brown@gbxm.com',
    linkedIn: 'linkedin.com/in/emilybrown',
    teamsId: 'emily.brown',
    status: 'draft',
    statusHistory: [{ status: 'draft', timestamp: '2024-11-08T13:00:00.000Z' }],
    updatedAt: '2024-11-08T13:00:00.000Z',
  },
];

@Injectable({ providedIn: 'root' })
export class OperatorProfileService {
  private static readonly STORAGE_KEY = 'operator-console:profile-form';

  readonly profiles = signal<OperatorProfile[]>(MOCK_PROFILES);

  getProfile(userId: string): OperatorProfile | undefined {
    return this.profiles().find((p) => p.userId === userId);
  }

  saveOwnProfile(data: Record<string, unknown>): void {
    try {
      localStorage.setItem(OperatorProfileService.STORAGE_KEY, JSON.stringify(data));
    } catch {}
  }

  loadOwnProfile(): Record<string, unknown> | null {
    try {
      const raw = localStorage.getItem(OperatorProfileService.STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Record<string, unknown>) : null;
    } catch {
      return null;
    }
  }

  clearOwnProfile(): void {
    try {
      localStorage.removeItem(OperatorProfileService.STORAGE_KEY);
    } catch {}
  }

  updateStatus(userId: string, status: OperatorStatus): void {
    const now = new Date().toISOString();
    this.profiles.update((profiles) =>
      profiles.map((p) =>
        p.userId === userId
          ? {
              ...p,
              status,
              updatedAt: now,
              statusHistory: [...p.statusHistory, { status, timestamp: now }],
            }
          : p
      )
    );
  }
}
