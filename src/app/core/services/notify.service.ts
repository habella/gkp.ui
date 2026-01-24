import { Injectable } from '@angular/core';
import notify from 'devextreme/ui/notify';

@Injectable({
  providedIn: 'root',
})
export class NotifyService {
  constructor() {}

  success = (message: string) => {
    notify(
      {
        message: message,
        height: 50,
        width: 400,
        minWidth: 400,
        type: 'success',
        displayTime: 3000,
        animation: {
          show: {
            type: 'fade',
            duration: 400,
            from: 0,
            to: 1,
          },
          hide: {
            type: 'fade',
            duration: 40,
            to: 0,
          },
        },
      },
      {
        position: 'top center',
        direction: 'down-push',
      }
    );
  };

  error = (message: string) => {
    notify(
      {
        message: message,
        height: 45,
        width: 400,
        minWidth: 400,
        type: 'error',
        displayTime: 3000,
        animation: {
          show: {
            type: 'fade',
            duration: 400,
            from: 0,
            to: 1,
          },
          hide: {
            type: 'fade',
            duration: 40,
            to: 0,
          },
        },
      },
      {
        position: 'top center',
        direction: 'down-push',
      }
    );
  };
}
