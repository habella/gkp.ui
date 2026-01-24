import { Component, inject } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { UiService } from './core/services/ui.service'
import { LoadingOverlayComponent } from './shared/components/loading-overlay/loading-overlay.component'

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoadingOverlayComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  ui = inject(UiService)
}
