import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
  ViewChild
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SelectionModel } from '@angular/cdk/collections';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  Campaign,
  CampaignService,
  CampaignTypeKey
} from '@gbxm/core/services/campaign.service';
import { DIALOG_SIZES } from '@gbxm/core/models/dialog.model';
import { ExportColumn, ExportService } from '@gbxm/core/services/export.service';
import { ToastService } from '@gbxm/core/services/toast.service';
import { HotelsDialogComponent } from './hotels-dialog/hotels-dialog.component';

@Component({
  selector: 'app-all-campaigns',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatMenuModule,
    MatPaginatorModule,
    MatRadioModule,
    MatSelectModule,
    MatSortModule,
    MatTableModule,
    MatTooltipModule
  ],
  templateUrl: './all-campaigns.component.html',
  styleUrl: './all-campaigns.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AllCampaignsComponent implements AfterViewInit {
  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);
  private campaignsService = inject(CampaignService);
  private exportService = inject(ExportService);
  private toast = inject(ToastService);

  displayedColumns = ['select', 'id', 'name', 'type', 'pickListDate', 'count', 'action'];

  filtersForm = this.fb.group({
    operatorId: this.fb.control('all'),
    typeKey: this.fb.control<'all' | CampaignTypeKey>('all'),
    viewNoPickLists: this.fb.control(true)
  });

  dataSource = new MatTableDataSource<Campaign>([]);
  selection = new SelectionModel<Campaign>(true, []);
  selectedCount = signal(0);
  pageSizeOptions = [5, 10, 25, 50];

  @ViewChild(MatSort) sort?: MatSort;
  @ViewChild(MatPaginator) paginator?: MatPaginator;

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

  constructor() {
    effect(() => {
      const campaigns = this.filteredCampaigns();
      this.dataSource.data = campaigns;
      // Clear stale selections when the filtered set changes
      const visibleIds = new Set(campaigns.map(c => c.id));
      const stillSelected = this.selection.selected.filter(c => visibleIds.has(c.id));
      this.selection.clear();
      this.selection.select(...stillSelected);
      this.selectedCount.set(this.selection.selected.length);
    });
  }

  ngAfterViewInit(): void {
    if (this.sort) {
      this.dataSource.sort = this.sort;
      this.dataSource.sortingDataAccessor = (item, property) => {
        const value = item[property as keyof Campaign];
        if (typeof value === 'string') {
          const asNumber = Number(value);
          if (!Number.isNaN(asNumber) && value.trim() !== '') {
            return asNumber;
          }
          return value.toLowerCase();
        }
        if (typeof value === 'number') {
          return value;
        }
        return '';
      };
    }

    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  onSortChange(_event: Sort): void {
    this.selection.clear();
    this.selectedCount.set(0);
  }

  toggleSelection(row: Campaign): void {
    this.selection.toggle(row);
    this.selectedCount.set(this.selection.selected.length);
  }

  isAllVisibleSelected(): boolean {
    const visible = this.visibleRows();
    return visible.length > 0 && visible.every(row => this.selection.isSelected(row));
  }

  isSomeVisibleSelected(): boolean {
    const visible = this.visibleRows();
    return visible.some(row => this.selection.isSelected(row)) && !this.isAllVisibleSelected();
  }

  masterToggle(): void {
    const visible = this.visibleRows();
    if (this.isAllVisibleSelected()) {
      visible.forEach(row => this.selection.deselect(row));
    } else {
      this.selection.select(...visible);
    }
    this.selectedCount.set(this.selection.selected.length);
  }

  openHotels(campaign: Campaign): void {
    const hotels = this.campaignsService.getHotelsForCampaign(campaign.id);
    this.dialog.open(HotelsDialogComponent, {
      data: { campaign, hotels },
      ...DIALOG_SIZES.large
    });
  }

  exportAll(): void {
    const rows = this.dataSource.filteredData.length > 0
      ? this.dataSource.filteredData
      : this.dataSource.data;

    if (rows.length === 0) {
      this.toast.info('There are no campaigns to export.');
      return;
    }

    this.exportService.exportToExcel(rows, this.exportColumns(), 'all-campaigns');
    this.toast.success(`Exported ${rows.length} ${rows.length === 1 ? 'campaign' : 'campaigns'}.`);
  }

  exportSelected(): void {
    const rows = this.selection.selected;
    if (rows.length === 0) {
      this.toast.info('Select at least one row to export.');
      return;
    }

    this.exportService.exportToExcel(rows, this.exportColumns(), 'selected-campaigns');
    this.toast.success(`Exported ${rows.length} selected ${rows.length === 1 ? 'campaign' : 'campaigns'}.`);
  }

  private visibleRows(): Campaign[] {
    const data = this.dataSource.filteredData ?? this.dataSource.data;
    if (!this.paginator) {
      return data;
    }
    const start = this.paginator.pageIndex * this.paginator.pageSize;
    return data.slice(start, start + this.paginator.pageSize);
  }

  private exportColumns(): ExportColumn<Campaign>[] {
    return [
      { header: 'ID', selector: c => c.id },
      { header: 'Name', selector: c => c.name },
      { header: 'Type', selector: c => c.typeLabel },
      { header: 'Pick List Date', selector: c => c.pickListDate || '' },
      { header: 'No', selector: c => c.count || '0' },
      { header: 'Operator', selector: c => c.operatorId },
      { header: 'Descriptor', selector: c => c.descriptor ?? '' },
      { header: 'License Manager', selector: c => c.licenseManager ?? '' },
      { header: 'Director', selector: c => c.director ?? '' },
      { header: 'Campaign Lead', selector: c => c.campaignLead ?? '' },
      { header: 'Date Initiated', selector: c => c.dateInitiated ?? '' }
    ];
  }
}
