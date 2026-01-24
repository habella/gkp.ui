import { Component, input, output } from '@angular/core'

@Component({
  selector: 'app-empty-state',
  imports: [],
  templateUrl: './empty-state.html',
  styleUrl: './empty-state.scss',
  host: {
    class:
      'empty-state flex flex-col items-center justify-center h-full w-full',
  },
})
export class EmptyStateComponent {
  // Inputs
  icon = input<string>('box')
  title = input<string>('No hay elementos')
  subtitle = input<string>('Comienza creando un nuevo elemento')
  showCreateButton = input<boolean>(true)
  showRefreshButton = input<boolean>(true)
  createButtonText = input<string>('Crear nuevo')
  refreshButtonText = input<string>('Refrescar')
  isLoading = input<boolean>(false)

  // Outputs
  create = output<void>()
  refresh = output<void>()

  onCreateClick(): void {
    this.create.emit()
  }

  onRefreshClick(): void {
    this.refresh.emit()
  }
}
