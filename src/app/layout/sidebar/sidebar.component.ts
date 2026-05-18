import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NAVIGATION_DATA } from '@gbxm/core/models/nav-item.model';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, MatIcon, MatIconButton, MatExpansionModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent {
  isMobile = input(false);
  closeSidebar = output<void>();

  navData = NAVIGATION_DATA;

  // Tracks sections the user has manually collapsed. Default = all collapsed
  // (accordion is single-select, so only one is open at a time anyway).
  private collapsedSections = signal<Set<string>>(new Set());

  isCollapsed(label: string): boolean {
    return this.collapsedSections().has(label);
  }

  setCollapsed(label: string, collapsed: boolean): void {
    const next = new Set(this.collapsedSections());
    collapsed ? next.add(label) : next.delete(label);
    this.collapsedSections.set(next);
  }

  onItemClick(): void {
    if (this.isMobile()) this.closeSidebar.emit();
  }

  getIconUrl(icon?: string): string {
    return icon ? `url('./assets/icons/${icon}')` : 'none';
  }
}
