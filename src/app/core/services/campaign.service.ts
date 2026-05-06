import { Injectable, effect, signal } from '@angular/core';

export type CampaignTypeKey = 'agent' | 'geo' | 'brand' | 'thematic';

export interface Campaign {
  id: string;
  name: string;
  typeKey: CampaignTypeKey;
  typeLabel: string;
  pickListDate: string;
  count: string;
  operatorId: string;
  descriptor?: string;
  tagline?: string;
  licenseManager?: string;
  director?: string;
  campaignLead?: string;
  dataCollator?: string;
  associateRep?: string;
  selfLicensing?: string;
  licenseType?: string;
  urlLink?: string;
  videoLink?: string;
  notesInternal?: string;
  notesExternal?: string;
  numberOfProperties?: string;
  productPriceVary?: string;
  agentSuccessFee?: string;
  dateInitiated?: string;
}

const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: '00001',
    name: 'Bali',
    typeKey: 'agent',
    typeLabel: 'Agent',
    pickListDate: '',
    count: '',
    operatorId: 'operator-1',
    descriptor: '',
    tagline: '',
    licenseManager: '',
    director: '',
    campaignLead: '',
    dataCollator: '',
    associateRep: '',
    selfLicensing: '',
    licenseType: '',
    urlLink: '',
    videoLink: '',
    notesInternal: '',
    notesExternal: '',
    numberOfProperties: '',
    productPriceVary: '',
    agentSuccessFee: '',
    dateInitiated: ''
  },
  {
    id: '00002',
    name: 'San Diego, CA',
    typeKey: 'geo',
    typeLabel: 'Geographic',
    pickListDate: '',
    count: '',
    operatorId: 'operator-2',
    descriptor: '',
    tagline: '',
    licenseManager: '',
    director: '',
    campaignLead: '',
    dataCollator: '',
    associateRep: '',
    selfLicensing: '',
    licenseType: '',
    urlLink: '',
    videoLink: '',
    notesInternal: '',
    notesExternal: '',
    numberOfProperties: '',
    productPriceVary: '',
    agentSuccessFee: '',
    dateInitiated: ''
  },
  {
    id: '00003',
    name: 'Spring Promo',
    typeKey: 'brand',
    typeLabel: 'Brand/syndicate',
    pickListDate: '04/25/2026',
    count: '12',
    operatorId: 'operator-1',
    descriptor: '',
    tagline: '',
    licenseManager: '',
    director: '',
    campaignLead: '',
    dataCollator: '',
    associateRep: '',
    selfLicensing: '',
    licenseType: '',
    urlLink: '',
    videoLink: '',
    notesInternal: '',
    notesExternal: '',
    numberOfProperties: '12',
    productPriceVary: '',
    agentSuccessFee: '',
    dateInitiated: '04/25/2026'
  },
  {
    id: '00004',
    name: 'Coastal Getaway',
    typeKey: 'thematic',
    typeLabel: 'Thematic',
    pickListDate: '04/30/2026',
    count: '7',
    operatorId: 'operator-2',
    descriptor: '',
    tagline: '',
    licenseManager: '',
    director: '',
    campaignLead: '',
    dataCollator: '',
    associateRep: '',
    selfLicensing: '',
    licenseType: '',
    urlLink: '',
    videoLink: '',
    notesInternal: '',
    notesExternal: '',
    numberOfProperties: '7',
    productPriceVary: '',
    agentSuccessFee: '',
    dateInitiated: '04/30/2026'
  }
];

@Injectable({
  providedIn: 'root'
})
export class CampaignService {
  private storageKey = 'gbxm.campaigns';
  private campaignsSignal = signal<Campaign[]>(this.loadCampaigns());
  campaigns = this.campaignsSignal.asReadonly();

  constructor() {
    effect(() => {
      this.saveCampaigns(this.campaignsSignal());
    });
  }

  addCampaign(campaign: Campaign) {
    this.campaignsSignal.update(items => [campaign, ...items]);
  }

  private loadCampaigns(): Campaign[] {
    const storage = this.getStorage();
    if (!storage) {
      return INITIAL_CAMPAIGNS;
    }

    const stored = storage.getItem(this.storageKey);
    if (!stored) {
      return INITIAL_CAMPAIGNS;
    }

    try {
      const parsed = JSON.parse(stored) as Campaign[];
      return Array.isArray(parsed) ? parsed : INITIAL_CAMPAIGNS;
    } catch {
      return INITIAL_CAMPAIGNS;
    }
  }

  private saveCampaigns(campaigns: Campaign[]) {
    const storage = this.getStorage();
    if (!storage) {
      return;
    }

    storage.setItem(this.storageKey, JSON.stringify(campaigns));
  }

  private getStorage(): Storage | null {
    if (typeof window === 'undefined' || !window.localStorage) {
      return null;
    }

    return window.localStorage;
  }
}
