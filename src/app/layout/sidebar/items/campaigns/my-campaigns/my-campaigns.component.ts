import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { Campaign, CampaignService } from '@gbxm/core/services/campaign.service';
import {
  GenericTableComponent,
  TableAction,
  TableColumn,
} from '@gbxm/shared/components/generic-table/generic-table.component';
import {
  CampaignFilterComponent,
  CampaignFilterValue,
} from '../campaign-filter/campaign-filter.component';

type ViewState = 'table' | 'campaign-details';

@Component({
  selector: 'app-my-campaigns',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    GenericTableComponent,
    CampaignFilterComponent,
  ],
  templateUrl: './my-campaigns.component.html',
  styleUrl: './my-campaigns.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyCampaignsComponent {
  private campaignService = inject(CampaignService);

  viewState = signal<ViewState>('table');
  selectedCampaign = signal<Campaign | null>(null);

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

  // ── Table view ────────────────────────────────────────────────────────────────

  filteredCampaigns = computed(() => {
    const { status } = this.filters();
    const campaigns = this.campaignService.campaigns();
    if (status === 'live') return campaigns.filter((c) => c.pickListDate.trim().length > 0);
    if (status === 'draft') return campaigns.filter((c) => c.pickListDate.trim() === '');
    return campaigns;
  });

  tableData = computed(() => this.filteredCampaigns() as unknown as Record<string, unknown>[]);

  pageSizeOptions = [5, 10, 25, 50];

  columns: TableColumn[] = [
    { key: 'id', header: 'ID', sortable: true },
    { key: 'name', header: 'Name', sortable: true },
    { key: 'typeLabel', header: 'Type', sortable: true },
    { key: 'count', header: 'No.', sortable: true },
    { key: 'dateInitiated', header: 'Initiate', sortable: true },
    { key: 'pickListDate', header: 'Live', sortable: true },
    { key: 'numberOfProperties', header: 'Log on', sortable: true },
    { key: 'campaignLead', header: 'Lead', sortable: true },
  ];

  tableActions: TableAction[] = [
    {
      label: 'View',
      icon: 'visibility',
      tooltip: 'View campaign details',
      handler: (row) => this.openCampaignDetails(row as unknown as Campaign),
    },
  ];

  // ── Campaign details ──────────────────────────────────────────────────────────

  campaignDetailColumns: TableColumn[] = [
    { key: 'name', header: 'Property' },
    { key: 'gm', header: 'GM' },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Phone' },
    { key: 'logOn', header: 'Log On' },
    { key: 'excom', header: 'Excom' },
  ];

  campaignDetailActions: TableAction[] = [];

  campaignDetailData = computed(() => {
    const campaign = this.selectedCampaign();
    if (!campaign) return [];
    return this.campaignService.getHotelsForCampaign(campaign.id) as unknown as Record<
      string,
      unknown
    >[];
  });

  // ── Navigation ────────────────────────────────────────────────────────────────

  openCampaignDetails(campaign: Campaign): void {
    this.selectedCampaign.set(campaign);
    this.viewState.set('campaign-details');
  }

  backToTable(): void {
    this.selectedCampaign.set(null);
    this.viewState.set('table');
  }
}
