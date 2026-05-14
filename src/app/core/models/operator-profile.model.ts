export type OperatorStatus = 'draft' | 'pending' | 'verified' | 'rejected';

export interface StatusEvent {
  status: OperatorStatus;
  timestamp: string; // ISO 8601
}

export interface OperatorProfile {
  userId: string;
  firstName: string;
  lastName: string;
  preferred?: string;
  operator: string;
  personalEmail: string;
  cellAndText: string;
  contactEmail: string;
  companyEmail: string;
  linkedIn?: string;
  teamsId?: string;
  aboutMe?: string;
  tradingEntity?: string;
  registrationNumber?: string;
  digitalPresence1?: string;
  digitalPresence2?: string;
  digitalPresence3?: string;
  digitalPresence4?: string;
  status: OperatorStatus;
  statusHistory: StatusEvent[];
  updatedAt: string; // ISO 8601
}

export type ProfileFormMode = 'self' | 'view' | 'verify';
