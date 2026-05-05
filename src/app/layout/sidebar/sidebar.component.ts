import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [MatExpansionModule, MatListModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent {
  isMobile = input(false);
  closeSidebar = output<void>();

  onItemClick() {
    if (this.isMobile()) {
      this.closeSidebar.emit();
    }
  }
}
