import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Campaign } from '@gbxm/core/services/campaign.service';

interface DetailsDialogData {
  campaign: Campaign;
}

@Component({
  selector: 'app-details-dialog',
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './details-dialog.component.html',
  styleUrl: './details-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetailsDialogComponent {
  private data = inject<DetailsDialogData>(MAT_DIALOG_DATA);

  campaign = this.data.campaign;

  fields = [
    { label: 'Campaign ID', value: this.campaign.id },
    { label: 'Name', value: this.campaign.name },
    { label: 'Type', value: this.campaign.typeLabel },
    { label: 'Descriptor', value: this.campaign.descriptor },
    { label: 'Tagline', value: this.campaign.tagline },
    { label: 'License Manager', value: this.campaign.licenseManager },
    { label: 'Director', value: this.campaign.director },
    { label: 'Campaign Lead', value: this.campaign.campaignLead },
    { label: 'Data Collator', value: this.campaign.dataCollator },
    { label: 'Associate Rep', value: this.campaign.associateRep },
    { label: 'Self Licensing', value: this.campaign.selfLicensing },
    { label: 'License Type', value: this.campaign.licenseType },
    { label: 'Campaign URL', value: this.campaign.urlLink },
    { label: 'Campaign Video URL', value: this.campaign.videoLink },
    { label: 'Notes Internal', value: this.campaign.notesInternal },
    { label: 'Notes External', value: this.campaign.notesExternal },
    { label: 'Number of Properties', value: this.campaign.numberOfProperties },
    { label: 'Product Price Vary %', value: this.campaign.productPriceVary },
    { label: 'Agent Success Fee %', value: this.campaign.agentSuccessFee },
    { label: 'Date Initiated', value: this.campaign.dateInitiated },
    { label: 'Pick List Date', value: this.campaign.pickListDate },
    { label: 'No', value: this.campaign.count }
  ];

  getValue(value: string | undefined) {
    if (!value || value.trim().length === 0) {
      return 'N/A';
    }

    return value;
  }
}
