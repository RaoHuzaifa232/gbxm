import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { toSignal } from '@angular/core/rxjs-interop';
import { Campaign, CampaignService, CampaignTypeKey } from '@gbxm/core/services/campaign.service';
import { DIALOG_SIZES } from '@gbxm/core/models/dialog.model';
import { HotelsDialogComponent } from './hotels-dialog/hotels-dialog.component';
import { GenericTableComponent, TableAction, TableColumn } from '@gbxm/shared/components/generic-table/generic-table.component';

const HOTELS_SVG = 'M12 5c-5.25 0-9.5 4.02-11 7 1.5 2.98 5.75 7 11 7s9.5-4.02 11-7c-1.5-2.98-5.75-7-11-7zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-2.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z';

@Component({
  selector: 'app-all-campaigns',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatRadioModule,
    MatSelectModule,
    GenericTableComponent
  ],
  templateUrl: './all-campaigns.component.html',
  styleUrl: './all-campaigns.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AllCampaignsComponent {
  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);
  private campaignsService = inject(CampaignService);

  pageSizeOptions = [5, 10, 25, 50];

  filtersForm = this.fb.group({
    operatorId: this.fb.control('all'),
    typeKey: this.fb.control<'all' | CampaignTypeKey>('all'),
    viewNoPickLists: this.fb.control(true)
  });

  private filtersSignal = toSignal(this.filtersForm.valueChanges, {
    initialValue: this.filtersForm.getRawValue()
  });

  filteredCampaigns = computed(() => {
    const campaigns = this.campaignsService.campaigns();
    const filters = this.filtersSignal();

    return campaigns.filter(campaign => {
      const operatorMatches = filters.operatorId === 'all' || campaign.operatorId === filters.operatorId;
      const typeMatches = filters.typeKey === 'all' || campaign.typeKey === filters.typeKey;
      const pickListMatches = filters.viewNoPickLists || campaign.pickListDate.trim().length > 0;
      return operatorMatches && typeMatches && pickListMatches;
    });
  });

  tableData = computed(() => this.filteredCampaigns() as unknown as Record<string, unknown>[]);

  columns: TableColumn[] = [
    { key: 'id', header: 'ID', sortable: true },
    { key: 'name', header: 'Name', sortable: true },
    { key: 'typeLabel', header: 'Type', sortable: true },
    { key: 'pickListDate', header: 'Pick List Date', sortable: true },
    { key: 'count', header: 'No', sortable: true }
  ];

  campaignActions: TableAction[] = [
    {
      label: 'Hotels',
      icon: '',
      svgPath: HOTELS_SVG,
      tooltip: 'View hotels associated with this campaign',
      buttonClass: 'cell--action',
      handler: (row) => this.openHotels(row as unknown as Campaign)
    }
  ];

  openHotels(campaign: Campaign): void {
    const hotels = this.campaignsService.getHotelsForCampaign(campaign.id);
    this.dialog.open(HotelsDialogComponent, {
      data: { campaign, hotels },
      ...DIALOG_SIZES.large
    });
  }
}
