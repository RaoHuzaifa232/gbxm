import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { Campaign, CampaignHotel } from '@gbxm/core/services/campaign.service';

interface HotelsDialogData {
  campaign: Campaign;
  hotels: CampaignHotel[];
}

@Component({
  selector: 'app-hotels-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, MatTableModule],
  templateUrl: './hotels-dialog.component.html',
  styleUrl: './hotels-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HotelsDialogComponent {
  private data = inject<HotelsDialogData>(MAT_DIALOG_DATA);

  campaign = this.data.campaign;
  hotels = this.data.hotels;

  displayedColumns = ['id', 'name', 'location', 'rating', 'rooms', 'status'];
}
