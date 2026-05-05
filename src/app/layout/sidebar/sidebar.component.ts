import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NAVIGATION_DATA } from '@gbxm/core/models/nav-item.model';

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

  navData = NAVIGATION_DATA;

  onItemClick() {
    if (this.isMobile()) {
      this.closeSidebar.emit();
    }
  }

  getIconUrl(icon?: string): string {
    return icon ? `url('./assets/icons/${icon}')` : 'none';
  }
}
