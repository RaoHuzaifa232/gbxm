import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProfileFormComponent } from '@gbxm/shared/components/profile-form/profile-form.component';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [ProfileFormComponent, MatButtonModule, MatIconModule],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditProfileComponent {
  isPreviewing = signal(false);
}
