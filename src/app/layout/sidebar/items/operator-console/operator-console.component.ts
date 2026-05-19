import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-operator-console',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './operator-console.component.html',
  styleUrl: './operator-console.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OperatorConsoleComponent {}
