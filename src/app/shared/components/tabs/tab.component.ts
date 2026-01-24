import {
  Component,
  contentChild,
  input,
  output,
  TemplateRef,
  viewChild,
} from '@angular/core'

export type BadgeVariant =
  | 'default'
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'

@Component({
  selector: 'app-tab',
  template: `
    <ng-template #content>
      <ng-content></ng-content>
    </ng-template>
  `,
  host: {
    class: 'app-tab',
    style: 'display: none;',
  },
})
export class TabComponent {
  // Identificador único del tab
  id = input<string>()

  // Título del tab
  label = input.required<string>()

  // Icono opcional (template)
  icon = contentChild<TemplateRef<unknown>>('tabIcon')

  // Badge/contador opcional
  badge = input<number | string>()

  // Color del badge (variant o color personalizado)
  badgeVariant = input<BadgeVariant>('default')
  badgeColor = input<string>() // Color personalizado (override variant)

  // Deshabilitado (no clickeable, opaco)
  disabled = input<boolean>(false)

  // Bloqueado (muestra icono de candado, no clickeable)
  locked = input<boolean>(false)

  // Tab como acción (en vez de mostrar contenido, emite evento)
  isAction = input<boolean>(false)

  // Evento cuando el tab es una acción
  tabAction = output<void>()

  // Acciones específicas del tab (renderizadas en el header)
  tabActions = contentChild<TemplateRef<unknown>>('tabActions')

  // Template del contenido
  contentTemplate = viewChild.required<TemplateRef<unknown>>('content')
}
