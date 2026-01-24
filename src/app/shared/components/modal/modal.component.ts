import { CommonModule } from '@angular/common'
import {
  Component,
  contentChild,
  input,
  output,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core'

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'app-modal',
  },
})
export class ModalComponent {
  // Inputs
  isOpen = input<boolean>(false)
  title = input.required<string>()
  subtitle = input<string>()
  size = input<'sm' | 'md' | 'lg' | 'xl' | 'full'>('md')
  showFooter = input<boolean>(true)
  showCloseButton = input<boolean>(true)
  closeOnBackdrop = input<boolean>(false)

  // Footer buttons
  cancelText = input<string>('Cancelar')
  confirmText = input<string>('Guardar')
  confirmIcon = input<string>()
  showCancelButton = input<boolean>(true)
  showConfirmButton = input<boolean>(true)
  confirmDisabled = input<boolean>(false)
  confirmLoading = input<boolean>(false)
  confirmVariant = input<'primary' | 'danger' | 'success'>('primary')

  // Outputs
  closed = output<void>()
  cancelled = output<void>()
  confirmed = output<void>()

  // Content templates
  headerIcon = contentChild<TemplateRef<unknown>>('headerIcon')
  headerActions = contentChild<TemplateRef<unknown>>('headerActions')
  footerExtra = contentChild<TemplateRef<unknown>>('footerExtra')

  onClose(): void {
    if (this.confirmLoading()) return
    this.closed.emit()
  }

  onCancel(): void {
    if (this.confirmLoading()) return
    this.cancelled.emit()
    this.closed.emit()
  }

  onConfirm(): void {
    this.confirmed.emit()
  }

  onBackdropClick(): void {
    if (this.confirmLoading()) return
    if (this.closeOnBackdrop()) {
      this.closed.emit()
    }
  }

  getSizeClass(): string {
    const sizes = {
      sm: 'max-w-sm',
      md: 'max-w-lg',
      lg: 'max-w-2xl',
      xl: 'max-w-4xl',
      full: 'max-w-[90vw]',
    }
    return sizes[this.size()]
  }

  getConfirmClass(): string {
    const variants = {
      primary: 'btn-primary',
      danger: 'btn-danger',
      success: 'btn-success',
    }
    return variants[this.confirmVariant()]
  }
}
