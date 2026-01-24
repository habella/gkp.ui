import { NgStyle, NgTemplateOutlet } from '@angular/common'
import { Component, contentChildren, input, model, output } from '@angular/core'
import { TabComponent } from './tab.component'

@Component({
  selector: 'app-tabs',
  imports: [NgTemplateOutlet, NgStyle],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss',
  host: {
    class:
      'app-tabs flex flex-col flex-1 w-full h-full min-h-0 overflow-hidden',
  },
})
export class TabsComponent {
  // Tabs hijos
  tabs = contentChildren(TabComponent)

  // Tab activo (índice o id)
  activeTab = model<number | string>(0)

  // Eventos
  tabChange = output<number | string>()

  // Configuración
  variant = input<'default' | 'pills' | 'underline'>('underline')
  headerBackground = input<string>() // Color de fondo personalizado del header
  showTopBorder = input<boolean>(true) // Mostrar/ocultar border superior

  selectTab(tab: TabComponent, index: number) {
    // Si está bloqueado o deshabilitado, no hacer nada
    if (tab.locked() || tab.disabled()) {
      return
    }

    // Si es un tab de acción, emitir el evento y no cambiar el tab activo
    if (tab.isAction()) {
      tab.tabAction.emit()
      return
    }

    const tabId = tab.id() || index
    this.activeTab.set(tabId)
    this.tabChange.emit(tabId)
  }

  isActive(tab: TabComponent, index: number): boolean {
    // Los tabs de acción nunca están activos
    if (tab.isAction()) {
      return false
    }

    const activeValue = this.activeTab()
    const tabId = tab.id()

    if (tabId) {
      return activeValue === tabId
    }
    return activeValue === index
  }

  getBadgeClasses(tab: TabComponent): string {
    const customColor = tab.badgeColor()
    if (customColor) {
      return 'tab-badge tab-badge-custom'
    }
    return `tab-badge tab-badge-${tab.badgeVariant()}`
  }

  getBadgeStyle(tab: TabComponent): { [key: string]: string } | null {
    const customColor = tab.badgeColor()
    if (customColor) {
      return { 'background-color': customColor }
    }
    return null
  }
}
