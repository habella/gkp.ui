import { CommonModule } from '@angular/common'
import { Component, OnInit, inject } from '@angular/core'
import { NavigationEnd, Router, RouterModule } from '@angular/router'
import Keycloak from 'keycloak-js'
import { filter } from 'rxjs'
import { environment } from '../../../environments/environment.development'
import { HasRolesDirective } from '../../core/directives/hasRoles.directive'
import { MenuService } from '../../core/services/menu.service'
import { SvgIconComponent } from '../../shared/components/svg-icon/svg-icon.component'

@Component({
  selector: 'app-base-page',
  standalone: true,
  templateUrl: './base-page.component.html',
  styleUrls: ['./base-page.component.scss'],
  imports: [CommonModule, RouterModule, HasRolesDirective, SvgIconComponent],
})
export class BasePageComponent implements OnInit {
  isMaximized = false
  version = '0.0.4'
  title = environment.name
  currentRoute = ''
  expandedSubmenus: Record<string, boolean> = {}

  router = inject(Router)
  readonly keycloak = inject(Keycloak)
  menu = inject(MenuService)

  user$ = this.keycloak.loadUserProfile()
  menu$ = this.menu.get()

  ngOnInit() {
    // Track current route for active menu highlighting
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.url
      })

    // Set initial route
    this.currentRoute = this.router.url
  }

  logout = () => {
    this.keycloak.logout()
  }

  navigationChanged = (path: string) => {
    if (path.startsWith('http')) {
      window.open(path, '_blank')
    } else {
      this.router.navigate([path])
      this.isMaximized = false
    }
  }

  isMenuItemActive = (path?: string): boolean => {
    if (!path) return false
    return (
      this.currentRoute === `/${path}` ||
      this.currentRoute.startsWith(`/${path}/`)
    )
  }

  toggleExpanded = (item: any) => {
    this.isMaximized = !this.isMaximized
  }

  toggleSubmenu = (menuId: string) => {
    this.expandedSubmenus[menuId] = !this.expandedSubmenus[menuId]
  }

  isGroupActive = (item: any): boolean => {
    if (!item.subnodes) return false
    return item.subnodes.some((subnode: any) => {
      if (this.isMenuItemActive(subnode.menuItem.path)) return true
      if (subnode.subnodes) {
        return subnode.subnodes.some((level3: any) =>
          this.isMenuItemActive(level3.menuItem.path)
        )
      }
      return false
    })
  }
}
