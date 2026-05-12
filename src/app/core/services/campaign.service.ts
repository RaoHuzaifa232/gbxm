import { Injectable, effect, signal } from '@angular/core';

export type CampaignTypeKey = 'agent' | 'geo' | 'brand' | 'thematic';

export interface CampaignHotel {
  id: string;
  name: string;
  location: string;
  rating: number;
  rooms: number;
  status: string;
}

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
  hotels?: CampaignHotel[];
}

const SAMPLE_HOTELS_BY_CAMPAIGN: Record<string, CampaignHotel[]> = {
  '00001': [
    { id: 'H-1001', name: 'Ubud Tropical Resort', location: 'Ubud, Bali', rating: 4.7, rooms: 120, status: 'Active' },
    { id: 'H-1002', name: 'Seminyak Beach Villas', location: 'Seminyak, Bali', rating: 4.5, rooms: 80, status: 'Active' },
    { id: 'H-1003', name: 'Nusa Dua Pearl', location: 'Nusa Dua, Bali', rating: 4.6, rooms: 210, status: 'Pending' }
  ],

  '00002': [
    { id: 'H-2001', name: 'Pacific Crest Hotel', location: 'San Diego, CA', rating: 4.3, rooms: 156, status: 'Active' },
    { id: 'H-2002', name: 'Gaslamp Boutique', location: 'San Diego, CA', rating: 4.4, rooms: 92, status: 'Active' }
  ],

  '00003': [
    { id: 'H-3001', name: 'Spring Garden Inn', location: 'Lisbon, PT', rating: 4.2, rooms: 64, status: 'Active' },
    { id: 'H-3002', name: 'Lotus Bloom Resort', location: 'Porto, PT', rating: 4.6, rooms: 110, status: 'Active' },
    { id: 'H-3003', name: 'Cherry Blossom Hotel', location: 'Madrid, ES', rating: 4.5, rooms: 88, status: 'Pending' }
  ],

  '00004': [
    { id: 'H-4001', name: 'Coastline Grand', location: 'Brighton, UK', rating: 4.4, rooms: 140, status: 'Active' },
    { id: 'H-4002', name: 'Seabreeze Suites', location: 'Cornwall, UK', rating: 4.3, rooms: 75, status: 'Active' }
  ],

  '00005': [
    { id: 'H-5001', name: 'Desert Crown Palace', location: 'Dubai Marina, UAE', rating: 4.8, rooms: 320, status: 'Active' },
    { id: 'H-5002', name: 'Palm Oasis Resort', location: 'Palm Jumeirah, UAE', rating: 4.7, rooms: 210, status: 'Active' },
    { id: 'H-5003', name: 'Golden Dunes Hotel', location: 'Downtown Dubai, UAE', rating: 4.5, rooms: 180, status: 'Pending' }
  ],

  '00006': [
    { id: 'H-6001', name: 'Snow Peak Lodge', location: 'Aspen, USA', rating: 4.6, rooms: 95, status: 'Active' },
    { id: 'H-6002', name: 'Frost Valley Resort', location: 'Whistler, Canada', rating: 4.7, rooms: 150, status: 'Active' }
  ],

  '00007': [
    { id: 'H-7001', name: 'Royal Vienna Suites', location: 'Vienna, AT', rating: 4.4, rooms: 130, status: 'Active' },
    { id: 'H-7002', name: 'Paris Elite Stay', location: 'Paris, FR', rating: 4.8, rooms: 170, status: 'Active' },
    { id: 'H-7003', name: 'Rome Imperial Hotel', location: 'Rome, IT', rating: 4.5, rooms: 145, status: 'Pending' }
  ],

  '00008': [
    { id: 'H-8001', name: 'Phuket Paradise Resort', location: 'Phuket, Thailand', rating: 4.6, rooms: 220, status: 'Active' },
    { id: 'H-8002', name: 'Krabi Sunset Villas', location: 'Krabi, Thailand', rating: 4.5, rooms: 90, status: 'Active' }
  ],

  '00009': [
    { id: 'H-9001', name: 'Tokyo Sky Hotel', location: 'Tokyo, Japan', rating: 4.7, rooms: 250, status: 'Active' },
    { id: 'H-9002', name: 'Shibuya Central Inn', location: 'Shibuya, Tokyo', rating: 4.4, rooms: 110, status: 'Active' },
    { id: 'H-9003', name: 'Sakura Palace', location: 'Shinjuku, Tokyo', rating: 4.6, rooms: 175, status: 'Pending' }
  ],

  '00010': [
    { id: 'H-10001', name: 'Sunrise Budget Suites', location: 'Miami, USA', rating: 4.1, rooms: 140, status: 'Active' },
    { id: 'H-10002', name: 'Holiday Saver Inn', location: 'Orlando, USA', rating: 4.0, rooms: 105, status: 'Active' }
  ],

  '00011': [
    { id: 'H-11001', name: 'Maldives Water Villas', location: 'Male, Maldives', rating: 4.9, rooms: 75, status: 'Active' },
    { id: 'H-11002', name: 'Ocean Breeze Retreat', location: 'Vaavu Atoll, Maldives', rating: 4.8, rooms: 60, status: 'Active' }
  ],

  '00012': [
    { id: 'H-12001', name: 'Evergreen Mountain Lodge', location: 'Swiss Alps, CH', rating: 4.7, rooms: 98, status: 'Active' },
    { id: 'H-12002', name: 'Nature Bliss Retreat', location: 'Banff, Canada', rating: 4.5, rooms: 82, status: 'Pending' }
  ],

  '00013': [
    { id: 'H-13001', name: 'Manhattan Luxury Stay', location: 'New York, USA', rating: 4.6, rooms: 310, status: 'Active' },
    { id: 'H-13002', name: 'Central Park Suites', location: 'New York, USA', rating: 4.5, rooms: 180, status: 'Active' },
    { id: 'H-13003', name: 'Times Square Grand', location: 'New York, USA', rating: 4.4, rooms: 260, status: 'Pending' }
  ],

  '00014': [
    { id: 'H-14001', name: 'Savannah Wild Resort', location: 'Nairobi, Kenya', rating: 4.8, rooms: 120, status: 'Active' },
    { id: 'H-14002', name: 'Safari Explorer Camp', location: 'Serengeti, Tanzania', rating: 4.7, rooms: 70, status: 'Active' }
  ],

  '00015': [
    { id: 'H-15001', name: 'Eiffel View Palace', location: 'Paris, FR', rating: 4.9, rooms: 190, status: 'Active' },
    { id: 'H-15002', name: 'Louvre Boutique Hotel', location: 'Paris, FR', rating: 4.6, rooms: 105, status: 'Active' },
    { id: 'H-15003', name: 'Seine Riverside Suites', location: 'Paris, FR', rating: 4.5, rooms: 140, status: 'Pending' }
  ]
};

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
    dateInitiated: '',
    hotels: SAMPLE_HOTELS_BY_CAMPAIGN['00001']
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
    dateInitiated: '',
    hotels: SAMPLE_HOTELS_BY_CAMPAIGN['00002']
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
    dateInitiated: '04/25/2026',
    hotels: SAMPLE_HOTELS_BY_CAMPAIGN['00003']
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
    dateInitiated: '04/30/2026',
    hotels: SAMPLE_HOTELS_BY_CAMPAIGN['00004']
  },
  {
    id: '00005',
    name: 'Dubai Luxury Escape',
    typeKey: 'geo',
    typeLabel: 'Geographic',
    pickListDate: '05/01/2026',
    count: '10',
    operatorId: 'operator-3',
    descriptor: '',
    tagline: 'Luxury Desert Experience',
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
    numberOfProperties: '10',
    productPriceVary: '',
    agentSuccessFee: '',
    dateInitiated: '05/01/2026',
    hotels: SAMPLE_HOTELS_BY_CAMPAIGN['00005']
  },
  {
    id: '00006',
    name: 'Winter Adventure',
    typeKey: 'thematic',
    typeLabel: 'Thematic',
    pickListDate: '05/03/2026',
    count: '15',
    operatorId: 'operator-1',
    descriptor: '',
    tagline: 'Snow & Ski Resorts',
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
    numberOfProperties: '15',
    productPriceVary: '',
    agentSuccessFee: '',
    dateInitiated: '05/03/2026',
    hotels: SAMPLE_HOTELS_BY_CAMPAIGN['00006']
  },
  {
    id: '00007',
    name: 'European Tour',
    typeKey: 'brand',
    typeLabel: 'Brand/syndicate',
    pickListDate: '05/05/2026',
    count: '20',
    operatorId: 'operator-2',
    descriptor: '',
    tagline: 'Explore Europe',
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
    numberOfProperties: '20',
    productPriceVary: '',
    agentSuccessFee: '',
    dateInitiated: '05/05/2026',
    hotels: SAMPLE_HOTELS_BY_CAMPAIGN['00007']
  },
  {
    id: '00008',
    name: 'Thailand Beaches',
    typeKey: 'agent',
    typeLabel: 'Agent',
    pickListDate: '05/08/2026',
    count: '9',
    operatorId: 'operator-3',
    descriptor: '',
    tagline: 'Island Paradise',
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
    numberOfProperties: '9',
    productPriceVary: '',
    agentSuccessFee: '',
    dateInitiated: '05/08/2026',
    hotels: SAMPLE_HOTELS_BY_CAMPAIGN['00008']
  },
  {
    id: '00009',
    name: 'Tokyo Discovery',
    typeKey: 'geo',
    typeLabel: 'Geographic',
    pickListDate: '05/10/2026',
    count: '14',
    operatorId: 'operator-1',
    descriptor: '',
    tagline: 'Modern Japan',
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
    numberOfProperties: '14',
    productPriceVary: '',
    agentSuccessFee: '',
    dateInitiated: '05/10/2026',
    hotels: SAMPLE_HOTELS_BY_CAMPAIGN['00009']
  },
  {
    id: '00010',
    name: 'Summer Deals',
    typeKey: 'brand',
    typeLabel: 'Brand/syndicate',
    pickListDate: '05/12/2026',
    count: '18',
    operatorId: 'operator-2',
    descriptor: '',
    tagline: 'Hot Discounts',
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
    numberOfProperties: '18',
    productPriceVary: '',
    agentSuccessFee: '',
    dateInitiated: '05/12/2026',
    hotels: SAMPLE_HOTELS_BY_CAMPAIGN['00010']
  },
  {
    id: '00011',
    name: 'Maldives Honeymoon',
    typeKey: 'agent',
    typeLabel: 'Agent',
    pickListDate: '05/15/2026',
    count: '6',
    operatorId: 'operator-3',
    descriptor: '',
    tagline: 'Romantic Escape',
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
    numberOfProperties: '6',
    productPriceVary: '',
    agentSuccessFee: '',
    dateInitiated: '05/15/2026',
    hotels: SAMPLE_HOTELS_BY_CAMPAIGN['00011']
  },
  {
    id: '00012',
    name: 'Mountain Retreat',
    typeKey: 'thematic',
    typeLabel: 'Thematic',
    pickListDate: '05/18/2026',
    count: '11',
    operatorId: 'operator-1',
    descriptor: '',
    tagline: 'Nature & Relaxation',
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
    numberOfProperties: '11',
    productPriceVary: '',
    agentSuccessFee: '',
    dateInitiated: '05/18/2026',
    hotels: SAMPLE_HOTELS_BY_CAMPAIGN['00012']
  },
  {
    id: '00013',
    name: 'New York City Lights',
    typeKey: 'geo',
    typeLabel: 'Geographic',
    pickListDate: '05/20/2026',
    count: '22',
    operatorId: 'operator-2',
    descriptor: '',
    tagline: 'Urban Adventures',
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
    numberOfProperties: '22',
    productPriceVary: '',
    agentSuccessFee: '',
    dateInitiated: '05/20/2026',
    hotels: SAMPLE_HOTELS_BY_CAMPAIGN['00013']
  },
  {
    id: '00014',
    name: 'Safari Adventure',
    typeKey: 'thematic',
    typeLabel: 'Thematic',
    pickListDate: '05/22/2026',
    count: '13',
    operatorId: 'operator-3',
    descriptor: '',
    tagline: 'Wildlife Experience',
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
    numberOfProperties: '13',
    productPriceVary: '',
    agentSuccessFee: '',
    dateInitiated: '05/22/2026',
    hotels: SAMPLE_HOTELS_BY_CAMPAIGN['00014']
  },
  {
    id: '00015',
    name: 'Paris Romance',
    typeKey: 'brand',
    typeLabel: 'Brand/syndicate',
    pickListDate: '05/25/2026',
    count: '16',
    operatorId: 'operator-1',
    descriptor: '',
    tagline: 'City of Love',
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
    numberOfProperties: '16',
    productPriceVary: '',
    agentSuccessFee: '',
    dateInitiated: '05/25/2026',
    hotels: SAMPLE_HOTELS_BY_CAMPAIGN['00015']
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

  getHotelsForCampaign(campaignId: string): CampaignHotel[] {
    const campaign = this.campaignsSignal().find(c => c.id === campaignId);
    if (campaign?.hotels && campaign.hotels.length > 0) {
      return campaign.hotels;
    }
    return SAMPLE_HOTELS_BY_CAMPAIGN[campaignId] ?? [];
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
      if (!Array.isArray(parsed)) {
        return INITIAL_CAMPAIGNS;
      }
      return this.mergeWithInitial(parsed);
    } catch {
      return INITIAL_CAMPAIGNS;
    }
  }

  private mergeWithInitial(stored: Campaign[]): Campaign[] {
    const storedMap = new Map(stored.map(campaign => [campaign.id, campaign]));
    const merged = INITIAL_CAMPAIGNS.map(initial => {
      const override = storedMap.get(initial.id);
      const mergedCampaign = override ? { ...initial, ...override } : initial;
      return {
        ...mergedCampaign,
        hotels: mergedCampaign.hotels && mergedCampaign.hotels.length > 0
          ? mergedCampaign.hotels
          : SAMPLE_HOTELS_BY_CAMPAIGN[mergedCampaign.id] ?? []
      };
    });

    const additional = stored
      .filter(campaign => !INITIAL_CAMPAIGNS.some(initial => initial.id === campaign.id))
      .map(campaign => ({
        ...campaign,
        hotels: campaign.hotels && campaign.hotels.length > 0
          ? campaign.hotels
          : SAMPLE_HOTELS_BY_CAMPAIGN[campaign.id] ?? []
      }));

    return [...merged, ...additional];
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
