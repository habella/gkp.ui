import { inject, Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { BaseService } from '../../../core/services/base.service'
import {
  ICreateRolePermissionRelationRequest,
  ICreateRoleRequest,
  IRole,
  IRolePermissionRelation,
  IUpdateRoleRequest,
  IUserRoleRelation,
} from '../models'

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private readonly base = inject(BaseService)
  private readonly API = 'api/v1/role'

  /**
   * Get all roles
   */
  getAll(): Observable<IRole[]> {
    return this.base.get<IRole[]>(this.API)
  }

  /**
   * Get role by ID
   */
  getById(roleId: string): Observable<IRole> {
    return this.base.get<IRole>(`${this.API}/${roleId}`)
  }

  /**
   * Get users assigned to a role
   */
  getUsersByRoleId(roleId: string): Observable<IUserRoleRelation[]> {
    return this.base.get<IUserRoleRelation[]>(`${this.API}/${roleId}/user`)
  }

  /**
   * Create a new role
   */
  create(data: ICreateRoleRequest): Observable<IRole> {
    return this.base.post<IRole>(this.API, data)
  }

  /**
   * Update an existing role
   */
  update(data: IUpdateRoleRequest): Observable<IRole> {
    return this.base.put<IRole>(this.API, data)
  }

  /**
   * Delete a role
   */
  delete(roleId: string): Observable<void> {
    return this.base.delete<void>(`${this.API}/${roleId}`)
  }
}

@Injectable({
  providedIn: 'root',
})
export class RolePermissionRelationService {
  private readonly base = inject(BaseService)
  private readonly API = 'api/v1/role'

  /**
   * Get permissions assigned to a role
   */
  getByRoleId(roleId: string): Observable<IRolePermissionRelation[]> {
    return this.base.get<IRolePermissionRelation[]>(
      `${this.API}/${roleId}/permission`,
    )
  }

  /**
   * Get roles that have a specific permission
   */
  getByPermissionId(
    permissionId: string,
  ): Observable<IRolePermissionRelation[]> {
    return this.base.get<IRolePermissionRelation[]>(
      `${this.API}/permission/${permissionId}`,
    )
  }

  /**
   * Assign permission to role
   */
  create(
    data: ICreateRolePermissionRelationRequest,
  ): Observable<IRolePermissionRelation> {
    return this.base.post<IRolePermissionRelation>(
      `${this.API}/permission`,
      data,
    )
  }

  /**
   * Remove permission from role
   */
  delete(id: string): Observable<void> {
    return this.base.delete<void>(`${this.API}/permission/${id}`)
  }
}
