import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';

@Component({
  selector: 'app-coming-soon',
  imports: [MatIconModule, MatButtonModule, RouterLink, CommonModule],
  templateUrl: './coming-soon.component.html',
  styleUrl: './coming-soon.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComingSoonComponent {
  private route = inject(ActivatedRoute);

  featureName = toSignal(
    this.route.params.pipe(map(params => params['feature']?.replace(/-/g, ' ')))
  );
}
