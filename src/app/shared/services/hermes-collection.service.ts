import { inject, Injectable } from '@angular/core';
import { BaseService } from '../../core/services/base.service';

@Injectable({
  providedIn: 'root',
})
export class HermesCollectionService {
  base = inject(BaseService);

  deleteEntity = (code: string, id: string) =>
    this.base.delete(`api/v1/collection/entity/${code}/${id}`);
}
