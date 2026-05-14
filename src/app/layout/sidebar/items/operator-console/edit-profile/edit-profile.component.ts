import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ProfileFormComponent } from '@gbxm/shared/components/profile-form/profile-form.component';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [ProfileFormComponent],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditProfileComponent {}
