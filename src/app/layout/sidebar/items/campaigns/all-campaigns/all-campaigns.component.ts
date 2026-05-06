import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { toSignal } from '@angular/core/rxjs-interop';
import { Campaign, CampaignService, CampaignTypeKey } from '@gbxm/core/services/campaign.service';
import { DetailsDialogComponent } from './details-dialog/details-dialog.component';
import { DIALOG_SIZES } from '@gbxm/core/models/dialog.model';

@Component({
  selector: 'app-all-campaigns',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatFormFieldModule,
    MatRadioModule,
    MatSelectModule,
    MatTableModule
  ],
  templateUrl: './all-campaigns.component.html',
  styleUrl: './all-campaigns.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AllCampaignsComponent {
  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);
  private campaignsService = inject(CampaignService);

  displayedColumns = ['id', 'name', 'type', 'pickListDate', 'count', 'action'];

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
      const operatorMatches =
        filters.operatorId === 'all' || campaign.operatorId === filters.operatorId;
      const typeMatches = filters.typeKey === 'all' || campaign.typeKey === filters.typeKey;
      const pickListMatches =
        filters.viewNoPickLists || campaign.pickListDate.trim().length > 0;

      return operatorMatches && typeMatches && pickListMatches;
    });
  });

  openDetails(campaign: Campaign) {
    this.dialog.open(DetailsDialogComponent, {
      data: { campaign },
      ...DIALOG_SIZES.large
    });
  }
}
