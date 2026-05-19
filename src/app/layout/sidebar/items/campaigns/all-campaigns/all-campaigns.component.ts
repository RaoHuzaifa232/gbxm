import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { Campaign, CampaignHotel, CampaignService } from '@gbxm/core/services/campaign.service';
import {
  GenericTableComponent,
  TableAction,
  TableColumn,
} from '@gbxm/shared/components/generic-table/generic-table.component';
import {
  CampaignFilterComponent,
  CampaignFilterValue,
} from '../campaign-filter/campaign-filter.component';

type ViewState = 'table' | 'campaign-details' | 'property-view';

@Component({
  selector: 'app-all-campaigns',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    GenericTableComponent,
    CampaignFilterComponent,
  ],
  templateUrl: './all-campaigns.component.html',
  styleUrl: './all-campaigns.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AllCampaignsComponent {
  private campaignsService = inject(CampaignService);

  viewState = signal<ViewState>('table');
  selectedCampaign = signal<Campaign | null>(null);
  propertyViewCampaignId = signal<string>('');

  pageSizeOptions = [5, 10, 25, 50];

  // ── Filters (table view only) ────────────────────────────────────────────────

  private filters = signal<CampaignFilterValue>({
    campaignId: '',
    operatorId: 'all',
    typeKey: 'all',
    status: 'all',
    viewNoPickLists: true,
  });

  onFiltersChange(value: CampaignFilterValue): void {
    this.filters.set(value);
  }

  filteredCampaigns = computed(() => {
    const campaigns = this.campaignsService.campaigns();
    const f = this.filters();

    return campaigns.filter((campaign) => {
      const operatorMatches = f.operatorId === 'all' || campaign.operatorId === f.operatorId;
      const typeMatches = f.typeKey === 'all' || campaign.typeKey === f.typeKey;
      const pickListMatches = f.viewNoPickLists || campaign.pickListDate.trim().length > 0;
      return operatorMatches && typeMatches && pickListMatches;
    });
  });

  tableData = computed(() => this.filteredCampaigns() as unknown as Record<string, unknown>[]);

  columns: TableColumn[] = [
    { key: 'id', header: 'ID', sortable: true },
    { key: 'name', header: 'Name', sortable: true },
    { key: 'typeLabel', header: 'Type', sortable: true },
    { key: 'pickListDate', header: 'Pick List Date', sortable: true },
    { key: 'count', header: 'No', sortable: true },
  ];

  campaignActions: TableAction[] = [
    {
      label: 'View Details',
      icon: 'visibility',
      tooltip: 'View campaign properties',
      handler: (row) => this.openCampaignDetails(row as unknown as Campaign),
    },
  ];

  // ── Campaign details ─────────────────────────────────────────────────────────

  campaignDetailColumns: TableColumn[] = [
    { key: 'name', header: 'Property' },
    { key: 'gm', header: 'GM' },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Phone' },
    { key: 'logOn', header: 'Log On' },
    { key: 'excom', header: 'Excom' },
  ];

  campaignDetailActions: TableAction[] = [
    // {
    //   label: 'View Property',
    //   icon: 'visibility',
    //   tooltip: 'View Property',
    //   handler: (row) => this.openPropertyView(row as unknown as CampaignHotel)
    // }
  ];

  campaignDetailData = computed(() => {
    const campaign = this.selectedCampaign();
    if (!campaign) return [];
    return this.campaignsService.getHotelsForCampaign(campaign.id) as unknown as Record<
      string,
      unknown
    >[];
  });

  // ── Property view ────────────────────────────────────────────────────────────

  allCampaigns = computed(() => this.campaignsService.campaigns());

  propertyViewCampaign = computed(
    () =>
      this.campaignsService.campaigns().find((c) => c.id === this.propertyViewCampaignId()) ?? null
  );

  propertyViewColumns: TableColumn[] = [
    { key: 'name', header: 'Property' },
    { key: 'gm', header: 'GM' },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Phone' },
    { key: 'logOn', header: 'Log On' },
    { key: 'excom', header: 'Excom' },
  ];

  propertyViewActions: TableAction[] = [
    {
      label: 'View',
      icon: 'visibility',
      tooltip: 'View',
      handler: () => {},
    },
  ];

  propertyViewData = computed(() => {
    const id = this.propertyViewCampaignId();
    if (!id) return [];
    return this.campaignsService.getHotelsForCampaign(id) as unknown as Record<string, unknown>[];
  });

  // ── Navigation ───────────────────────────────────────────────────────────────

  openCampaignDetails(campaign: Campaign): void {
    this.selectedCampaign.set(campaign);
    this.viewState.set('campaign-details');
  }

  openPropertyView(hotel: CampaignHotel): void {
    this.propertyViewCampaignId.set(this.selectedCampaign()?.id ?? '');
    this.viewState.set('property-view');
  }

  backToTable(): void {
    this.selectedCampaign.set(null);
    this.viewState.set('table');
  }

  backToCampaignDetails(): void {
    this.viewState.set('campaign-details');
  }

  onCampaignChange(campaignId: string): void {
    this.propertyViewCampaignId.set(campaignId);
  }
}
