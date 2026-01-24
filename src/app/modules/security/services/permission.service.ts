import { inject, Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { BaseService } from '../../../core/services/base.service'
import {
  ICreatePermissionRequest,
  IPermission,
  IUpdatePermissionRequest,
} from '../models'

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  private readonly base = inject(BaseService)
  private readonly API = 'api/v1/permission'

  /**
   * Get all permissions
   */
  getAll(): Observable<IPermission[]> {
    return this.base.get<IPermission[]>(this.API)
  }

  /**
   * Get permission by ID
   */
  getById(id: string): Observable<IPermission> {
    return this.base.get<IPermission>(`${this.API}/${id}`)
  }

  /**
   * Create a new permission
   */
  create(data: ICreatePermissionRequest): Observable<IPermission> {
    return this.base.post<IPermission>(this.API, data)
  }

  /**
   * Update an existing permission
   */
  update(data: IUpdatePermissionRequest): Observable<IPermission> {
    return this.base.put<IPermission>(this.API, data)
  }

  /**
   * Delete a permission
   */
  delete(id: string): Observable<void> {
    return this.base.delete<void>(`${this.API}/${id}`)
  }
}
