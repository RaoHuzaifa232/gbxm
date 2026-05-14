import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { OperatorProfileService } from '@gbxm/core/services/operator-profile.service';
import { OperatorProfile, OperatorStatus } from '@gbxm/core/models/operator-profile.model';
import { GenericTableComponent, TableAction, TableColumn } from '@gbxm/shared/components/generic-table/generic-table.component';
import { ProfileFormComponent } from '@gbxm/shared/components/profile-form/profile-form.component';
import { ConfirmationDialogComponent } from '@gbxm/shared/components/confirmation-dialog/confirmation-dialog.component';
import { DIALOG_SIZES } from '@gbxm/core/models/dialog.model';
import { ToastService } from '@gbxm/core/services/toast.service';

@Component({
  selector: 'app-view-all-profiles',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatTooltipModule,
    GenericTableComponent,
    ProfileFormComponent
  ],
  templateUrl: './view-all-profiles.component.html',
  styleUrl: './view-all-profiles.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewAllProfilesComponent {
  private profileService = inject(OperatorProfileService);
  private dialog = inject(MatDialog);
  private toast = inject(ToastService);

  viewingProfile = signal<OperatorProfile | null>(null);

  tableData = computed(() =>
    this.profileService.profiles().map(p => ({
      ...p,
      fullName: `${p.firstName} ${p.lastName}`,
      displayDate: this.formatDate(p.updatedAt)
    })) as unknown as Record<string, unknown>[]
  );

  columns: TableColumn[] = [
    { key: 'userId', header: 'User ID', sortable: true },
    { key: 'fullName', header: 'Name', sortable: true },
    { key: 'operator', header: 'Operator Role', sortable: true },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      badge: (row) => {
        const status = row['status'] as OperatorStatus;
        const map: Record<OperatorStatus, { text: string; cssClass: string }> = {
          draft: { text: 'Draft', cssClass: 'badge-draft' },
          pending: { text: 'Pending', cssClass: 'badge-pending' },
          verified: { text: 'Verified', cssClass: 'badge-verified' },
          rejected: { text: 'Rejected', cssClass: 'badge-rejected' }
        };
        return map[status] ?? null;
      }
    },
    { key: 'displayDate', header: 'Date', sortable: true }
  ];

  actions: TableAction[] = [
    {
      label: 'View Profile',
      icon: 'person',
      tooltip: 'View / Edit Profile',
      color: 'primary',
      handler: (row) => this.openProfile(row as unknown as OperatorProfile)
    }
  ];

  openProfile(row: OperatorProfile): void {
    // Fetch the latest profile data from the service to ensure freshness
    const fresh = this.profileService.getProfile(row.userId) ?? row;
    this.viewingProfile.set(fresh);
  }

  backToTable(): void {
    this.viewingProfile.set(null);
  }

  changeStatus(status: OperatorStatus): void {
    const profile = this.viewingProfile();
    if (!profile) return;

    const labels: Record<OperatorStatus, string> = {
      draft: 'Draft',
      pending: 'Pending',
      verified: 'Verify',
      rejected: 'Reject'
    };

    this.dialog.open(ConfirmationDialogComponent, {
      ...DIALOG_SIZES.small,
      data: {
        title: `${labels[status]} Operator`,
        message: `Are you sure you want to set this operator's status to "${labels[status]}"?`,
        confirmText: labels[status],
        cancelText: 'Cancel'
      }
    }).afterClosed().subscribe(result => {
      if (result) {
        this.profileService.updateStatus(profile.userId, status);
        // Reactively update the viewing profile from the signal
        const updated = this.profileService.getProfile(profile.userId);
        if (updated) this.viewingProfile.set(updated);
        this.toast.success(`Status updated to "${labels[status]}".`);
      }
    });
  }

  onFormSaved(): void {
    this.toast.success('Profile saved successfully!');
  }

  onFormSubmitted(): void {
    this.toast.success('Profile submitted successfully!');
    this.backToTable();
  }

  onEmailLink(): void {
    // Toast shown by profile-form itself; nothing extra needed here
  }

  getStatusLabel(status: OperatorStatus): string {
    const map: Record<OperatorStatus, string> = {
      draft: 'Draft',
      pending: 'Pending',
      verified: 'Verified',
      rejected: 'Rejected'
    };
    return map[status];
  }

  getStatusClass(status: OperatorStatus): string {
    return `badge-${status}`;
  }

  formatEventDate(iso: string): string {
    if (!iso) return '—';
    try {
      return new Date(iso).toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return iso;
    }
  }

  private formatDate(iso: string): string {
    if (!iso) return '—';
    try {
      return new Date(iso).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return iso;
    }
  }
}
