import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { OperatorProfileService } from '@gbxm/core/services/operator-profile.service';
import { OperatorProfile, OperatorStatus } from '@gbxm/core/models/operator-profile.model';
import { ConfirmationDialogComponent } from '@gbxm/shared/components/confirmation-dialog/confirmation-dialog.component';
import { DIALOG_SIZES } from '@gbxm/core/models/dialog.model';
import { ProfileFormComponent } from '@gbxm/shared/components/profile-form/profile-form.component';
import { ToastService } from '@gbxm/core/services/toast.service';

@Component({
  selector: 'app-verify-operator',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    MatDividerModule,
    MatTooltipModule,
    ProfileFormComponent
  ],
  templateUrl: './verify-operator.component.html',
  styleUrl: './verify-operator.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VerifyOperatorComponent {
  private fb = inject(FormBuilder);
  private profileService = inject(OperatorProfileService);
  private toast = inject(ToastService);
  private dialog = inject(MatDialog);

  readonly profiles = this.profileService.profiles;
  selectedProfile = signal<OperatorProfile | null>(null);

  operatorForm = this.fb.group({
    selectedUserId: this.fb.control<string | null>(null)
  });

  onOperatorChange(userId: string | null): void {
    if (!userId) {
      this.selectedProfile.set(null);
      return;
    }
    const profile = this.profileService.getProfile(userId);
    this.selectedProfile.set(profile ?? null);
  }

  changeStatus(status: OperatorStatus): void {
    const profile = this.selectedProfile();
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
        const updated = this.profileService.getProfile(profile.userId);
        if (updated) this.selectedProfile.set(updated);
        this.toast.success(`Status updated to "${labels[status]}".`);
      }
    });
  }

  getStatusLabel(status: OperatorStatus): string {
    const map: Record<OperatorStatus, string> = {
      draft: 'Draft',
      pending: 'Pending',
      verified: 'Verified',
      rejected: 'Rejected'
    };
    return map[status] ?? status;
  }
}
