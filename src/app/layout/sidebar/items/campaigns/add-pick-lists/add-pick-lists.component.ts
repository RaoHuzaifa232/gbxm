import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { DEFAULT_DIALOG_CONFIG, DIALOG_SIZES } from '@gbxm/core/models/dialog.model';
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
import { PropertyDetailsComponent } from '../property-details/property-details.component';
import { BrowseDialogComponent, BrowseDialogData } from './browse-dialog/browse-dialog.component';
import {
  AddPropertyDialogComponent,
  AddPropertyDialogData,
  AddPropertyDialogResult,
} from './add-property-dialog/add-property-dialog.component';

@Component({
  selector: 'app-add-pick-lists',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    GenericTableComponent,
    CampaignFilterComponent,
    PropertyDetailsComponent,
    AddPropertyDialogComponent,
  ],
  templateUrl: './add-pick-lists.component.html',
  styleUrl: './add-pick-lists.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddPickListsComponent {
  private campaignService = inject(CampaignService);
  private dialog = inject(MatDialog);

  campaigns = this.campaignService.campaigns;
  viewState = signal<'table' | 'property-view' | 'property-details'>('table');
  propertyViewCampaignId = signal<string>('');
  selectedHotel = signal<CampaignHotel | null>(null);

  filters = signal<CampaignFilterValue>({
    campaignId: '',
    operatorId: 'all',
    typeKey: 'all',
    status: 'all',
    viewNoPickLists: true,
  });

  selectedCampaign = computed(() => {
    const id = this.filters().campaignId || (this.campaigns()[0]?.id ?? '');
    return this.campaigns().find((c) => c.id === id) ?? null;
  });

  filteredCampaigns = computed(() => {
    const f = this.filters();
    return this.campaigns().filter((c) => {
      const campaignMatches = !f.campaignId || c.id === f.campaignId;
      const operatorMatches = f.operatorId === 'all' || c.operatorId === f.operatorId;
      const typeMatches = f.typeKey === 'all' || c.typeKey === f.typeKey;
      const pickListMatches = f.viewNoPickLists || c.pickListDate.trim().length > 0;
      return campaignMatches && operatorMatches && typeMatches && pickListMatches;
    });
  });

  tableData = computed(() => this.filteredCampaigns() as unknown as Record<string, unknown>[]);

  // Hotels added locally via the Add Property dialog, keyed by campaign ID
  private addedHotels = signal<Record<string, CampaignHotel[]>>({});

  propertyViewData = computed(() => {
    const id = this.propertyViewCampaignId();
    if (!id) return [];
    const fromService = this.campaignService.getHotelsForCampaign(id);
    const fromLocal = this.addedHotels()[id] ?? [];
    return [...fromService, ...fromLocal] as unknown as Record<string, unknown>[];
  });

  propertyViewCampaign = computed(() => {
    const id = this.propertyViewCampaignId();
    return this.campaigns().find((c) => c.id === id) ?? null;
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
      handler: (row) => this.openPropertyDetails(row as unknown as CampaignHotel),
    },
  ];

  openPropertyView(campaign: Campaign): void {
    this.propertyViewCampaignId.set(campaign.id);
    this.viewState.set('property-view');
  }

  backToTable(): void {
    this.viewState.set('table');
  }

  openPropertyDetails(hotel: CampaignHotel): void {
    this.selectedHotel.set(hotel);
    this.viewState.set('property-details');
  }

  backToPropertyView(): void {
    this.selectedHotel.set(null);
    this.viewState.set('property-view');
  }

  onAddProperty(): void {
    const campaign = this.propertyViewCampaign();
    if (!campaign) return;

    this.dialog
      .open<AddPropertyDialogComponent, AddPropertyDialogData, AddPropertyDialogResult>(
        AddPropertyDialogComponent,
        {
          ...DIALOG_SIZES.small,
          ...DEFAULT_DIALOG_CONFIG,
          data: { campaignName: campaign.name },
        }
      )
      .afterClosed()
      .subscribe((result) => {
        if (!result) return;
        const newHotel: CampaignHotel = {
          name: result.propertyName,
          location: '',
          status: 'Pending',
        };
        this.addedHotels.update((map) => ({
          ...map,
          [campaign.id]: [...(map[campaign.id] ?? []), newHotel],
        }));
      });
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
