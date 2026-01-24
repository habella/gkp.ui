import { NgTemplateOutlet } from '@angular/common'
import {
  Component,
  computed,
  contentChild,
  input,
  TemplateRef,
} from '@angular/core'

export type BoxVariant = 'default' | 'compact'

@Component({
  selector: 'box',
  imports: [NgTemplateOutlet],
  templateUrl: './box.component.html',
  styleUrl: './box.component.scss',
  host: {
    class: 'box flex flex-col min-h-0 overflow-hidden',
    '[class.box-compact]': 'variant() === "compact"',
  },
})
export class BoxComponent {
  title = input<string>()
  subtitle = input<string>()
  variant = input<BoxVariant>('compact')
  iconColor = input<string>()
  headerColor = input<string>()
  showHeader = input<boolean | undefined>(undefined)

  // Icono dinámico via ng-template
  headerIcon = contentChild<TemplateRef<unknown>>('boxIcon')
  headerActions = contentChild<TemplateRef<unknown>>('boxActions')

  // Mostrar header solo si hay título, icono o acciones (o si showHeader es true)
  shouldShowHeader = computed(() => {
    const explicit = this.showHeader()
    if (explicit !== undefined) return explicit
    return !!(this.title() || this.headerIcon() || this.headerActions())
  })
}
