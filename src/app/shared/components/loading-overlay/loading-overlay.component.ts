import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

export type LoadingPosition = 'center' | 'absolute' | 'fixed';

@Component({
  selector: 'loading-overlay',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading-overlay.component.html',
  styleUrl: './loading-overlay.component.scss',
  host: {
    class: 'loading-overlay-host',
    '[class.position-fixed]': 'position() === "fixed"',
    '[class.position-absolute]': 'position() === "absolute"',
    '[class.position-center]': 'position() === "center"',
    '[class.visible]': 'visible()'
  }
})
export class LoadingOverlayComponent {
  title = input.required<string>();
  subtitle = input<string>();
  visible = input<boolean>(false);
  position = input<LoadingPosition>('fixed');
}
