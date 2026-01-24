import { inject, Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { BaseService } from '../../../core/services/base.service'
import {
  ICreateUserRoleRelationRequest,
  IRegisterUserRequest,
  IUser,
  IUserRoleRelation,
} from '../models'
import { IPermission } from '../models/permission.model'
import { IRole } from '../models/role.model'

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly base = inject(BaseService)
  private readonly API = 'api/v1/user'

  /**
   * Get all users
   */
  getAll(): Observable<IUser[]> {
    return this.base.get<IUser[]>(this.API)
  }

  /**
   * Get user by ID
   */
  getById(id: string): Observable<IUser> {
    return this.base.get<IUser>(`${this.API}/${id}`)
  }

  /**
   * Get current user info
   */
  getInfo(): Observable<IUser> {
    return this.base.get<IUser>(`${this.API}/info`)
  }

  /**
   * Get current user roles
   */
  getRoles(): Observable<IRole[]> {
    return this.base.get<IRole[]>(`${this.API}/roles`)
  }

  /**
   * Get current user permissions
   */
  getPermissions(): Observable<IPermission[]> {
    return this.base.get<IPermission[]>(`${this.API}/permissions`)
  }

  /**
   * Register a new user
   */
  register(data: IRegisterUserRequest): Observable<IUser> {
    return this.base.post<IUser>(`${this.API}/register`, data)
  }

  /**
   * Activate user
   */
  activate(userId: string): Observable<void> {
    return this.base.get<void>(`${this.API}/${userId}/active`)
  }

  /**
   * Inactivate user
   */
  inactivate(userId: string): Observable<void> {
    return this.base.get<void>(`${this.API}/${userId}/inactive`)
  }
}

@Injectable({
  providedIn: 'root',
})
export class UserRoleRelationService {
  private readonly base = inject(BaseService)
  private readonly API = 'api/v1/user'

  /**
   * Get roles assigned to a user
   */
  getByUserId(userId: string): Observable<IUserRoleRelation[]> {
    return this.base.get<IUserRoleRelation[]>(`${this.API}/${userId}/role`)
  }

  /**
   * Get users with a specific role
   */
  getByRoleId(roleId: string): Observable<IUserRoleRelation[]> {
    return this.base.get<IUserRoleRelation[]>(`${this.API}/role/${roleId}`)
  }

  /**
   * Assign role to user
   */
  create(data: ICreateUserRoleRelationRequest): Observable<IUserRoleRelation> {
    return this.base.post<IUserRoleRelation>(`${this.API}/role`, data)
  }

  /**
   * Remove role from user
   */
  delete(id: string): Observable<void> {
    return this.base.delete<void>(`${this.API}/role/${id}`)
  }
}
