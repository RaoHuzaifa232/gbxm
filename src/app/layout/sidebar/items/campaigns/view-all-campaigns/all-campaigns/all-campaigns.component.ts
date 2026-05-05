import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-all-campaigns',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCheckboxModule,
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
  displayedColumns = ['id', 'name', 'type', 'pickListDate', 'count', 'action'];

  campaigns = [
    {
      id: '00001',
      name: 'Bali',
      type: 'Agent',
      pickListDate: '',
      count: ''
    },
    {
      id: '00002',
      name: 'San Diego, CA',
      type: 'Geographic',
      pickListDate: '',
      count: ''
    },
    {
      id: '00003',
      name: 'Spring Promo',
      type: 'Brand/syndicate',
      pickListDate: '04/25/2026',
      count: '12'
    },
    {
      id: '00004',
      name: 'Coastal Getaway',
      type: 'Thematic',
      pickListDate: '04/30/2026',
      count: '7'
    }
  ];
}
