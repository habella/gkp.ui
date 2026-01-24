import {
  Component,
  EventEmitter,
  Output,
  computed,
  input,
  signal,
} from '@angular/core'
import { AngularSvgIconModule } from 'angular-svg-icon'

export type ListControlEvent =
  | 'refresh'
  | 'create'
  | 'search'
  | 'save'
  | 'custom'

export interface ListControlCustomEvent {
  id: string
  title: string
  /**
   * Icono a mostrar. Puede ser:
   * - Nombre del archivo SVG en public/icons (ej: 'plus.svg', 'edit-05.svg')
   * - Contenido SVG completo (ej: '<svg>...</svg>')
   */
  icon?: string
  color?: string // Hex/RGB or TailWind class if applicable
  position: 'primary' | 'secondary' // primary = button bar, secondary = dropdown
  tooltip?: string
}

@Component({
  selector: 'list-controls',
  imports: [AngularSvgIconModule],
  templateUrl: './list-controls.component.html',
  styleUrl: './list-controls.component.scss',
  standalone: true,
})
export class ListControlsComponent {
  /**
   * Array de botones/controles a mostrar.
   * Valores permitidos: 'refresh', 'create', 'search', 'save'
   * Orden determina el orden visual de los elementos
   */
  controls = input<ListControlEvent[]>(['refresh', 'create', 'search'])

  /**
   * Configuración de controles personalizados
   */
  customControls = input<ListControlCustomEvent[]>([])

  /**
   * Placeholder para el input de búsqueda
   */
  searchPlaceholder = input('Search...')

  /**
   * Título para el botón create (ej: 'Crear Módulo', 'Crear Turbina')
   */
  createTitle = input('Create')

  /**
   * Título para el botón save
   */
  saveTitle = input('Save')

  /**
   * Eventos emitidos cuando interactúan con los controles
   */
  @Output() action = new EventEmitter<{
    type: ListControlEvent
    value?: string
  }>()

  searchTerm = signal('')
  menuOpen = signal(false)

  // Computed signals specific for UI separation
  primaryCustomControls = computed(() =>
    this.customControls().filter((c) => c.position === 'primary')
  )

  secondaryCustomControls = computed(() =>
    this.customControls().filter((c) => c.position === 'secondary')
  )

  onRefresh(): void {
    this.action.emit({ type: 'refresh' })
  }

  onCreate(): void {
    this.action.emit({ type: 'create' })
  }

  onSave(): void {
    this.action.emit({ type: 'save' })
  }

  onSearch(term: string): void {
    this.searchTerm.set(term)
    this.action.emit({ type: 'search', value: term })
  }

  onCustomAction(id: string): void {
    this.action.emit({ type: 'custom', value: id })
    this.menuOpen.set(false)
  }

  toggleMenu(): void {
    this.menuOpen.update((v) => !v)
  }

  hasControl(controlType: ListControlEvent): boolean {
    return this.controls().includes(controlType)
  }

  /**
   * Determina si un string es un nombre de icono (contiene .svg)
   * o contenido SVG directo (empieza con '<svg')
   */
  isIconName(icon: string | undefined): boolean {
    if (!icon) return false
    return icon.includes('.svg')
  }

  /**
   * Convierte el nombre del icono a la ruta completa
   */
  getIconPath(iconName: string): string {
    return `icons/${iconName}`
  }
}
