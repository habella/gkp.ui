import { inject, Injectable } from '@angular/core';
import { BaseService } from '../../core/services/base.service';

@Injectable({
  providedIn: 'root',
})
export class HermesDatasourceService {
  base = inject(BaseService);

  get = (code: string, q?: string) =>
    q
      ? this.base.get(`api/v1/datasource/${code}?q=${q}`)
      : this.base.get(`api/v1/datasource/${code}`);
}
