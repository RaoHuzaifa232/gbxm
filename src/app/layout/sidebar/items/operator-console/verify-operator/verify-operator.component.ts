import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { OperatorProfileService } from '@gbxm/core/services/operator-profile.service';
import { OperatorProfile, OperatorStatus } from '@gbxm/core/models/operator-profile.model';
import { ProfileFormComponent } from '@gbxm/shared/components/profile-form/profile-form.component';
import { ToastService } from '@gbxm/core/services/toast.service';

@Component({
  selector: 'app-verify-operator',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDividerModule,
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

  onProfileVerified(): void {
    const profile = this.selectedProfile();
    if (profile) {
      this.profileService.updateStatus(profile.userId, 'verified');
      this.selectedProfile.set({ ...profile, status: 'verified' });
    }
  }

  onProfileRejected(): void {
    const profile = this.selectedProfile();
    if (profile) {
      this.profileService.updateStatus(profile.userId, 'rejected');
      this.selectedProfile.set({ ...profile, status: 'rejected' });
    }
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
