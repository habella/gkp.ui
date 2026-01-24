import { inject, Injectable } from '@angular/core';
import { BaseService } from '../../../core/services/base.service';

@Injectable({
  providedIn: 'root',
})
export class HermesFormService {
  base = inject(BaseService);

  get = (code: string, p0?: string) => this.base.get(`api/v1/collection/form/${code}`);

  create = (code: string, data: any) =>
    this.base.post(`api/v1/collection/entity/${code}`, data);

  update = (code: string, id: string, data: any) =>
    this.base.put(`api/v1/collection/entity/${code}/${id}`, data);

  getEntity = (code: string, id: string) =>
    this.base.get(`api/v1/collection/entity/${code}/${id}`);
}
