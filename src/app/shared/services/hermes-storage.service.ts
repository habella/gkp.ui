import { inject, Injectable } from '@angular/core';
import { BaseService } from '../../core/services/base.service';

@Injectable({
  providedIn: 'root',
})
export class HermesStorageService {
  base = inject(BaseService);

  get = (code: string) => this.base.get<any>(`api/v1/storage/${code}`);

  set = (code: string, data: { value: any; ttlSeconds: number }) => {
    return this.base.post(`api/v1/storage/${code}`, data);
  };

  setExpiry = (code: string, ttlSeconds: number) => {
    return this.base.put(`api/v1/storage/${code}/${ttlSeconds}`);
  };

  delete = (code: string) => {
    return this.base.delete(`api/v1/storage/${code}`);
  };
}
