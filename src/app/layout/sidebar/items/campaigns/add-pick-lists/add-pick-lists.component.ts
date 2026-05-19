import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { DEFAULT_DIALOG_CONFIG, DIALOG_SIZES } from '@gbxm/core/models/dialog.model';
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
import { BrowseDialogComponent, BrowseDialogData } from './browse-dialog/browse-dialog.component';

@Component({
  selector: 'app-add-pick-lists',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    GenericTableComponent,
    CampaignFilterComponent,
  ],
  templateUrl: './add-pick-lists.component.html',
  styleUrl: './add-pick-lists.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddPickListsComponent {
  private campaignService = inject(CampaignService);
  private dialog = inject(MatDialog);

  campaigns = this.campaignService.campaigns;
  viewState = signal<'table' | 'property-view'>('table');
  selectedCampaignId = signal<string>(this.campaignService.campaigns()[0]?.id ?? '');
  propertyViewCampaignId = signal<string>('');

  private filters = signal<CampaignFilterValue>({
    campaignId: '',
    operatorId: 'all',
    typeKey: 'all',
    status: 'all',
    viewNoPickLists: true,
  });

  onFiltersChange(value: CampaignFilterValue): void {
    if (value.campaignId) {
      this.selectedCampaignId.set(value.campaignId);
    }
    this.filters.set(value);
  }

  selectedCampaign = computed(
    () => this.campaigns().find((c) => c.id === this.selectedCampaignId()) ?? null
  );

  filteredCampaigns = computed(() => {
    const f = this.filters();
    return this.campaigns().filter((c) => {
      const operatorMatches = f.operatorId === 'all' || c.operatorId === f.operatorId;
      const typeMatches = f.typeKey === 'all' || c.typeKey === f.typeKey;
      const pickListMatches = f.viewNoPickLists || c.pickListDate.trim().length > 0;
      return operatorMatches && typeMatches && pickListMatches;
    });
  });

  tableData = computed(() => this.filteredCampaigns() as unknown as Record<string, unknown>[]);

  propertyViewData = computed(() => {
    const id = this.propertyViewCampaignId();
    if (!id) return [];
    return this.campaignService.getHotelsForCampaign(id) as unknown as Record<string, unknown>[];
  });

  pageSizeOptions = [5, 10, 25, 50];

  columns: TableColumn[] = [
    { key: 'id', header: 'ID', sortable: true },
    { key: 'name', header: 'Name', sortable: true },
    { key: 'typeLabel', header: 'Type', sortable: true },
    { key: 'pickListDate', header: 'Pick List Date', sortable: true },
    { key: 'count', header: 'No', sortable: true },
  ];

  tableActions: TableAction[] = [
    {
      label: 'View',
      icon: 'visibility',
      tooltip: 'View pick list',
      handler: (row) => this.openPropertyView(row as unknown as Campaign),
    },
  ];

  propertyViewColumns: TableColumn[] = [
    { key: 'name', header: 'Property', sortable: true },
    { key: 'gm', header: 'GM', sortable: true },
    { key: 'email', header: 'Email', sortable: true },
    { key: 'phone', header: 'Phone', sortable: true },
    { key: 'logOn', header: 'Log On', sortable: true },
    { key: 'excom', header: 'Excom', sortable: true },
  ];

  propertyViewActions: TableAction[] = [
    {
      label: 'View',
      icon: 'visibility',
      tooltip: 'View property',
      handler: (_row) => {},
    },
  ];

  openPropertyView(campaign: Campaign): void {
    this.propertyViewCampaignId.set(campaign.id);
    this.viewState.set('property-view');
  }

  backToTable(): void {
    this.viewState.set('table');
  }

  onPropertyViewCampaignChange(campaignId: string): void {
    this.propertyViewCampaignId.set(campaignId);
  }

  onBrowseFile(): void {
    const campaign = this.selectedCampaign();
    if (!campaign) return;

    this.dialog.open<BrowseDialogComponent, BrowseDialogData>(BrowseDialogComponent, {
      ...DIALOG_SIZES.small,
      ...DEFAULT_DIALOG_CONFIG,
      data: { campaign },
    });
  }
}
