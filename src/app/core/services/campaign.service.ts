import { Injectable, effect, signal } from '@angular/core';

export type CampaignTypeKey = 'agent' | 'geo' | 'brand' | 'thematic';

export interface CampaignHotel {
  name: string;
  location: string;
  status: string;
  gm?: string;
  email?: string;
  phone?: string;
  logOn?: string;
  excom?: string;
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
    {
      name: 'Ubud Tropical Resort',
      location: 'Ubud, Bali',
      status: 'Active',
      gm: 'Indra Sulimani Ibid',
      email: 'indrasulimni@UbudResort.id',
      phone: '+6230981673',
    },
    {
      name: 'Seminyak Beach Villas',
      location: 'Seminyak, Bali',
      status: 'Active',
      gm: 'Patrick Geddes',
      email: 'PatrickG@SeminyakVillas.com',
      phone: '+6230981673',
    },
    {
      name: 'Nusa Dua Pearl',
      location: 'Nusa Dua, Bali',
      status: 'Pending',
      gm: 'Ayu Pratiwi',
      email: 'apratiwi@NusaDuaPearl.id',
      phone: '+6230981674',
    },
  ],

  '00002': [
    {
      name: 'Pacific Crest Hotel',
      location: 'San Diego, CA',
      status: 'Active',
      gm: 'James Morrison',
      email: 'jmorrison@pacificcrest.com',
      phone: '+16195551234',
    },
    {
      name: 'Gaslamp Boutique',
      location: 'San Diego, CA',
      status: 'Active',
      gm: 'Linda Park',
      email: 'lpark@gaslampboutique.com',
      phone: '+16195555678',
    },
  ],

  '00003': [
    { name: 'Spring Garden Inn', location: 'Lisbon, PT', status: 'Active' },
    { name: 'Lotus Bloom Resort', location: 'Porto, PT', status: 'Active' },
    { name: 'Cherry Blossom Hotel', location: 'Madrid, ES', status: 'Pending' },
  ],

  '00004': [
    { name: 'Coastline Grand', location: 'Brighton, UK', status: 'Active' },
    { name: 'Seabreeze Suites', location: 'Cornwall, UK', status: 'Active' },
  ],

  '00005': [
    { name: 'Desert Crown Palace', location: 'Dubai Marina, UAE', status: 'Active' },
    { name: 'Palm Oasis Resort', location: 'Palm Jumeirah, UAE', status: 'Active' },
    { name: 'Golden Dunes Hotel', location: 'Downtown Dubai, UAE', status: 'Pending' },
  ],

  '00006': [
    { name: 'Snow Peak Lodge', location: 'Aspen, USA', status: 'Active' },
    { name: 'Frost Valley Resort', location: 'Whistler, Canada', status: 'Active' },
  ],

  '00007': [
    { name: 'Royal Vienna Suites', location: 'Vienna, AT', status: 'Active' },
    { name: 'Paris Elite Stay', location: 'Paris, FR', status: 'Active' },
    { name: 'Rome Imperial Hotel', location: 'Rome, IT', status: 'Pending' },
  ],

  '00008': [
    { name: 'Phuket Paradise Resort', location: 'Phuket, Thailand', status: 'Active' },
    { name: 'Krabi Sunset Villas', location: 'Krabi, Thailand', status: 'Active' },
  ],

  '00009': [
    { name: 'Tokyo Sky Hotel', location: 'Tokyo, Japan', status: 'Active' },
    { name: 'Shibuya Central Inn', location: 'Shibuya, Tokyo', status: 'Active' },
    { name: 'Sakura Palace', location: 'Shinjuku, Tokyo', status: 'Pending' },
  ],

  '00010': [
    { name: 'Sunrise Budget Suites', location: 'Miami, USA', status: 'Active' },
    { name: 'Holiday Saver Inn', location: 'Orlando, USA', status: 'Active' },
  ],

  '00011': [
    { name: 'Maldives Water Villas', location: 'Male, Maldives', status: 'Active' },
    { name: 'Ocean Breeze Retreat', location: 'Vaavu Atoll, Maldives', status: 'Active' },
  ],

  '00012': [
    { name: 'Evergreen Mountain Lodge', location: 'Swiss Alps, CH', status: 'Active' },
    { name: 'Nature Bliss Retreat', location: 'Banff, Canada', status: 'Pending' },
  ],

  '00013': [
    { name: 'Manhattan Luxury Stay', location: 'New York, USA', status: 'Active' },
    { name: 'Central Park Suites', location: 'New York, USA', status: 'Active' },
    { name: 'Times Square Grand', location: 'New York, USA', status: 'Pending' },
  ],

  '00014': [
    { name: 'Savannah Wild Resort', location: 'Nairobi, Kenya', status: 'Active' },
    { name: 'Safari Explorer Camp', location: 'Serengeti, Tanzania', status: 'Active' },
  ],

  '00015': [
    { name: 'Eiffel View Palace', location: 'Paris, FR', status: 'Active' },
    { name: 'Louvre Boutique Hotel', location: 'Paris, FR', status: 'Active' },
    { name: 'Seine Riverside Suites', location: 'Paris, FR', status: 'Pending' },
  ],
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
    hotels: SAMPLE_HOTELS_BY_CAMPAIGN['00001'],
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
    hotels: SAMPLE_HOTELS_BY_CAMPAIGN['00002'],
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
    hotels: SAMPLE_HOTELS_BY_CAMPAIGN['00003'],
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
    hotels: SAMPLE_HOTELS_BY_CAMPAIGN['00004'],
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
    hotels: SAMPLE_HOTELS_BY_CAMPAIGN['00005'],
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
    hotels: SAMPLE_HOTELS_BY_CAMPAIGN['00006'],
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
    hotels: SAMPLE_HOTELS_BY_CAMPAIGN['00007'],
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
    hotels: SAMPLE_HOTELS_BY_CAMPAIGN['00008'],
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
    hotels: SAMPLE_HOTELS_BY_CAMPAIGN['00009'],
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
    hotels: SAMPLE_HOTELS_BY_CAMPAIGN['00010'],
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
    hotels: SAMPLE_HOTELS_BY_CAMPAIGN['00011'],
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
    hotels: SAMPLE_HOTELS_BY_CAMPAIGN['00012'],
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
    hotels: SAMPLE_HOTELS_BY_CAMPAIGN['00013'],
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
    hotels: SAMPLE_HOTELS_BY_CAMPAIGN['00014'],
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
    hotels: SAMPLE_HOTELS_BY_CAMPAIGN['00015'],
  },
];

@Injectable({
  providedIn: 'root',
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
    this.campaignsSignal.update((items) => [campaign, ...items]);
  }

  getHotelsForCampaign(campaignId: string): CampaignHotel[] {
    const campaign = this.campaignsSignal().find((c) => c.id === campaignId);
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
    const storedMap = new Map(stored.map((campaign) => [campaign.id, campaign]));
    const merged = INITIAL_CAMPAIGNS.map((initial) => {
      const override = storedMap.get(initial.id);
      const mergedCampaign = override ? { ...initial, ...override } : initial;
      return {
        ...mergedCampaign,
        hotels:
          mergedCampaign.hotels && mergedCampaign.hotels.length > 0
            ? mergedCampaign.hotels
            : (SAMPLE_HOTELS_BY_CAMPAIGN[mergedCampaign.id] ?? []),
      };
    });

    const additional = stored
      .filter((campaign) => !INITIAL_CAMPAIGNS.some((initial) => initial.id === campaign.id))
      .map((campaign) => ({
        ...campaign,
        hotels:
          campaign.hotels && campaign.hotels.length > 0
            ? campaign.hotels
            : (SAMPLE_HOTELS_BY_CAMPAIGN[campaign.id] ?? []),
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
