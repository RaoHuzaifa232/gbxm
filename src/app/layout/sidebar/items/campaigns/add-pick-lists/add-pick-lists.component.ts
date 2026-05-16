import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { toSignal } from '@angular/core/rxjs-interop';
import { Campaign, CampaignService, CampaignTypeKey } from '@gbxm/core/services/campaign.service';
import { DEFAULT_DIALOG_CONFIG, DIALOG_SIZES } from '@gbxm/core/models/dialog.model';
import { GenericTableComponent, TableAction, TableColumn } from '@gbxm/shared/components/generic-table/generic-table.component';
import { BrowseDialogComponent, BrowseDialogData } from './browse-dialog/browse-dialog.component';

@Component({
  selector: 'app-add-pick-lists',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatRadioModule,
    MatSelectModule,
    GenericTableComponent
  ],
  templateUrl: './add-pick-lists.component.html',
  styleUrl: './add-pick-lists.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddPickListsComponent {
  private fb = inject(FormBuilder);
  private campaignService = inject(CampaignService);
  private dialog = inject(MatDialog);

  campaigns = this.campaignService.campaigns;
  viewState = signal<'table' | 'property-view'>('table');
  selectedCampaignId = signal<string>(this.campaignService.campaigns()[0]?.id ?? '');
  propertyViewCampaignId = signal<string>('');

  filtersForm = this.fb.group({
    operatorId: this.fb.control<string>('all'),
    typeKey: this.fb.control<'all' | CampaignTypeKey>('all'),
    viewNoPickLists: this.fb.control<boolean>(true)
  });

  private filtersSignal = toSignal(this.filtersForm.valueChanges, {
    initialValue: this.filtersForm.getRawValue()
  });

  selectedCampaign = computed(() =>
    this.campaigns().find(c => c.id === this.selectedCampaignId()) ?? null
  );

  filteredCampaigns = computed(() => {
    const filters = this.filtersSignal();
    return this.campaigns().filter(c => {
      const operatorMatches = filters.operatorId === 'all' || c.operatorId === filters.operatorId;
      const typeMatches = filters.typeKey === 'all' || c.typeKey === filters.typeKey;
      const pickListMatches = filters.viewNoPickLists || c.pickListDate.trim().length > 0;
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
    { key: 'count', header: 'No', sortable: true }
  ];

  tableActions: TableAction[] = [
    {
      label: 'View',
      icon: 'visibility',
      tooltip: 'View pick list',
      handler: (row) => this.openPropertyView(row as unknown as Campaign)
    }
  ];

  propertyViewColumns: TableColumn[] = [
    { key: 'name', header: 'Property', sortable: true },
    { key: 'gm', header: 'GM', sortable: true },
    { key: 'email', header: 'Email', sortable: true },
    { key: 'phone', header: 'Phone', sortable: true },
    { key: 'logOn', header: 'Log On', sortable: true },
    { key: 'excom', header: 'Excom', sortable: true }
  ];

  propertyViewActions: TableAction[] = [
    {
      label: 'View',
      icon: 'visibility',
      tooltip: 'View property',
      handler: (_row) => {}
    }
  ];

  onCampaignChange(campaignId: string): void {
    this.selectedCampaignId.set(campaignId);
  }

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
      data: { campaign }
    });
  }
}
