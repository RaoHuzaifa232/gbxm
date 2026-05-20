import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { Campaign, CampaignTypeKey } from '@gbxm/core/services/campaign.service';

export type CampaignStatusFilter = 'all' | 'live' | 'draft';

export interface CampaignFilterValue {
  campaignId: string;
  operatorId: string;
  typeKey: 'all' | CampaignTypeKey;
  status: CampaignStatusFilter;
  viewNoPickLists: boolean;
}

@Component({
  selector: 'app-campaign-filter',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatRadioModule,
    MatSelectModule,
  ],
  templateUrl: './campaign-filter.component.html',
  styleUrl: './campaign-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CampaignFilterComponent {
  private fb = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);

  campaigns = input<Campaign[]>([]);
  showCampaignSelect = input(false);
  showOperator = input(true);
  showType = input(true);
  showStatus = input(false);
  showViewNoPickLists = input(true);

  filtersChange = output<CampaignFilterValue>();

  form = this.fb.group({
    campaignId: this.fb.control<string>(''),
    operatorId: this.fb.control<string>('all'),
    typeKey: this.fb.control<'all' | CampaignTypeKey>('all'),
    status: this.fb.control<CampaignStatusFilter>('all'),
    viewNoPickLists: this.fb.control<boolean>(true),
  });

  constructor() {
    this.form.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.filtersChange.emit(this.form.getRawValue() as CampaignFilterValue));
  }

  clearFilters(): void {
    this.form.reset({
      campaignId: '',
      operatorId: 'all',
      typeKey: 'all',
      status: 'all',
      viewNoPickLists: true,
    });
  }
}
