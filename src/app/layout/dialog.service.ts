import { Injectable } from '@angular/core';
import { confirm } from 'devextreme/ui/dialog';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor() {}

  confirm = (message: string, title: string) => {
    return confirm(message, title);
  };
}
