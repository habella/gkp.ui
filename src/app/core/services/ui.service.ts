import { inject, Injectable, signal } from '@angular/core';
import { defer, finalize, Observable, tap } from 'rxjs';
import { NotifyService } from './notify.service';

@Injectable({
  providedIn: 'root',
})
export class UiService {
  private readonly notifyS = inject(NotifyService);

  readonly isLoading = signal(false);
  readonly loadingTitle = signal<string>('Loading...');
  readonly loadingSubtitle = signal<string | undefined>(undefined);

  /**
   * * Show loading panel
   */
  show = (title: string = 'Loading...', subtitle?: string) => {
    this.loadingTitle.set(title);
    this.loadingSubtitle.set(subtitle);
    this.isLoading.set(true);
  };

  /**
   * * Hide loading panel
   */
  hide = () => {
    this.isLoading.set(false);
    // Reset defaults logic could go here if needed, but not strictly necessary as show() overrides
  };

  /**
   * Ejecuta un Observable mostrando el loader y disparando notificaciones.
   * @param action Función que crea el Observable (no lo subscriba aquí, lo dejamos al componente)
   * @param successMsg Mensaje en caso de completar sin errores
   * @param errorMsg  Mensaje en caso de error
   * @returns Observable<T> que emite igual que el original
   */
  runWithFeedback<T>(
    action: () => Observable<T>,
    successMsg: string,
    errorMsg = 'Ocurrió un error.',
    loadingTitle?: string,
    loadingSubtitle?: string
  ): Observable<T> {
    // espera a que alguien se suscriba
    return defer(() => {
      this.show(loadingTitle, loadingSubtitle);
      return action().pipe(
        tap({
          complete: () => {
            if (successMsg) {
              this.notifyS.success(successMsg);
            }
          },
          error: () => this.notifyS.error(errorMsg),
        }),
        finalize(() => this.hide())
      );
    });
  }
}
