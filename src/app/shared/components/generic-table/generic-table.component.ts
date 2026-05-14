import { SelectionModel } from '@angular/cdk/collections';
import { BreakpointObserver } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  inject,
  signal
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ExportService } from '@gbxm/core/services/export.service';
import { ToastService } from '@gbxm/core/services/toast.service';

export interface TableColumn {
  key: string;
  header: string;
  sortable?: boolean;
  cell?: (row: Record<string, unknown>) => string;
  badge?: (row: Record<string, unknown>) => { text: string; cssClass: string } | null;
  minWidth?: string;
}

export interface TableAction {
  label: string;
  icon: string;
  tooltip?: string;
  color?: 'primary' | 'warn' | 'accent';
  handler: (row: Record<string, unknown>) => void;
  show?: (row: Record<string, unknown>) => boolean;
  svgPath?: string;
  buttonClass?: string;
}

@Component({
  selector: 'app-generic-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatMenuModule
  ],
  templateUrl: './generic-table.component.html',
  styleUrl: './generic-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GenericTableComponent implements OnInit, AfterViewInit, OnChanges {
  @Input({ required: true }) columns: TableColumn[] = [];
  @Input() data: Record<string, unknown>[] = [];
  @Input() actions: TableAction[] = [];
  @Input() pageSizeOptions: number[] = [5, 10, 25];
  @Input() defaultPageSize: number = 10;
  @Input() selectable: boolean = false;
  @Input() mobileBreakpoint: number = 0;
  @Input() searchable: boolean = false;
  @Input() exportable: boolean = false;
  @Input() exportFileName: string = 'export';
  @Input() tableHeight: string = '';

  @Output() actionClicked = new EventEmitter<{ action: TableAction; row: Record<string, unknown> }>();
  @Output() selectionChange = new EventEmitter<Record<string, unknown>[]>();

  @ViewChild(MatSort) sort?: MatSort;
  @ViewChild(MatPaginator) paginator?: MatPaginator;

  private destroyRef = inject(DestroyRef);
  private breakpointObserver = inject(BreakpointObserver);
  private exportService = inject(ExportService);
  private toast = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);

  dataSource = new MatTableDataSource<Record<string, unknown>>([]);
  private readonly _selection = new SelectionModel<Record<string, unknown>>(true, []);
  selectedCount = signal(0);
  isMobile = signal(false);
  searchQuery = signal('');

  get displayedColumns(): string[] {
    const cols: string[] = [];
    if (this.selectable) cols.push('_select');
    cols.push(...this.columns.map(c => c.key));
    if (this.actions.length > 0) cols.push('_actions');
    return cols;
  }

  get allFilteredData(): Record<string, unknown>[] {
    return this.dataSource.filter ? this.dataSource.filteredData : this.dataSource.data;
  }

  ngOnInit(): void {
    if (this.mobileBreakpoint > 0) {
      this.breakpointObserver
        .observe(`(max-width: ${this.mobileBreakpoint}px)`)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(result => {
          this.isMobile.set(result.matches);
        });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.dataSource.data = this.data ?? [];
      if (this.selectable) {
        this._selection.clear();
        this.selectedCount.set(0);
        this.selectionChange.emit([]);
      }
    }
  }

  ngAfterViewInit(): void {
    if (this.sort) {
      this.dataSource.sort = this.sort;
      this.dataSource.sortingDataAccessor = (item, property) => {
        const value = item[property];
        if (typeof value === 'string') {
          const asNum = Number(value);
          return !Number.isNaN(asNum) && value.trim() !== '' ? asNum : value.toLowerCase();
        }
        return typeof value === 'number' ? value : '';
      };
    }
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
      // Re-check mobile cards when page changes (OnPush won't pick up paginator changes otherwise)
      this.paginator.page
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => this.cdr.markForCheck());
    }
  }

  // --- Selection ---

  isSelected(row: Record<string, unknown>): boolean {
    return this._selection.isSelected(row);
  }

  toggleRow(row: Record<string, unknown>): void {
    this._selection.toggle(row);
    this.emitSelection();
  }

  isAllVisibleSelected(): boolean {
    const visible = this.visibleRows();
    return visible.length > 0 && visible.every(r => this._selection.isSelected(r));
  }

  isSomeVisibleSelected(): boolean {
    const visible = this.visibleRows();
    return visible.some(r => this._selection.isSelected(r)) && !this.isAllVisibleSelected();
  }

  masterToggle(): void {
    const visible = this.visibleRows();
    if (this.isAllVisibleSelected()) {
      visible.forEach(r => this._selection.deselect(r));
    } else {
      this._selection.select(...visible);
    }
    this.emitSelection();
  }

  // --- Cell helpers ---

  getCellValue(row: Record<string, unknown>, column: TableColumn): string {
    if (column.cell) return column.cell(row);
    const value = row[column.key];
    return value != null ? String(value) : '';
  }

  getBadge(row: Record<string, unknown>, column: TableColumn): { text: string; cssClass: string } | null {
    return column.badge ? column.badge(row) : null;
  }

  onActionClick(action: TableAction, row: Record<string, unknown>): void {
    action.handler(row);
    this.actionClicked.emit({ action, row });
  }

  isActionVisible(action: TableAction, row: Record<string, unknown>): boolean {
    return action.show ? action.show(row) : true;
  }

  // --- Search ---

  onSearchChange(value: string): void {
    const trimmed = value.trim().toLowerCase();
    this.searchQuery.set(value);
    this.dataSource.filter = trimmed;
    if (this.paginator) this.paginator.firstPage();
    this.cdr.markForCheck();
  }

  clearSearch(): void {
    this.onSearchChange('');
  }

  // --- Export ---

  exportAll(): void {
    const rows = this.allFilteredData;
    if (rows.length === 0) {
      this.toast.info('There are no rows to export.');
      return;
    }
    this.exportService.exportToExcel(rows, this.buildExportColumns(), this.exportFileName);
    this.toast.success(`Exported ${rows.length} ${rows.length === 1 ? 'row' : 'rows'}.`);
  }

  exportSelected(): void {
    const rows = this._selection.selected;
    if (rows.length === 0) {
      this.toast.info('Select at least one row to export.');
      return;
    }
    this.exportService.exportToExcel(rows, this.buildExportColumns(), `${this.exportFileName}-selected`);
    this.toast.success(`Exported ${rows.length} selected ${rows.length === 1 ? 'row' : 'rows'}.`);
  }

  // --- Visible rows (public so template can use it for mobile cards) ---

  visibleRows(): Record<string, unknown>[] {
    const data = this.dataSource.filteredData ?? this.dataSource.data;
    if (!this.paginator) return data;
    const start = this.paginator.pageIndex * this.paginator.pageSize;
    return data.slice(start, start + this.paginator.pageSize);
  }

  private emitSelection(): void {
    this.selectedCount.set(this._selection.selected.length);
    this.selectionChange.emit([...this._selection.selected]);
  }

  private buildExportColumns() {
    return this.columns.map(col => ({
      header: col.header,
      selector: (row: Record<string, unknown>) => {
        if (col.badge) {
          const badge = col.badge(row);
          return badge?.text ?? '';
        }
        if (col.cell) return col.cell(row);
        const val = row[col.key];
        return val != null ? String(val) : '';
      }
    }));
  }
}
