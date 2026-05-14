import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProfileFormComponent } from '@gbxm/shared/components/profile-form/profile-form.component';
import { OperatorProfile, ProfileFormMode } from '@gbxm/core/models/operator-profile.model';

export interface ProfileFormDialogData {
  mode: ProfileFormMode;
  profile: OperatorProfile;
  title: string;
}

@Component({
  selector: 'app-profile-form-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule, ProfileFormComponent],
  templateUrl: './profile-form-dialog.component.html',
  styleUrl: './profile-form-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileFormDialogComponent {
  data = inject<ProfileFormDialogData>(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<ProfileFormDialogComponent>);

  onFormSaved(): void {
    // stays open after save
  }

  onFormSubmitted(): void {
    this.dialogRef.close({ action: 'submitted' });
  }

  onEmailLinkClicked(): void {
    this.dialogRef.close({ action: 'emailLink' });
  }

  onProfileVerified(): void {
    this.dialogRef.close({ action: 'verified' });
  }

  onProfileRejected(): void {
    this.dialogRef.close({ action: 'rejected' });
  }
}
