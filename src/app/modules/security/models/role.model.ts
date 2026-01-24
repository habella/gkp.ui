/**
 * Role model interfaces based on GateKeeper API
 */

export interface IRole {
  id: string
  name: string
  description?: string
  createdAt?: string
  updatedAt?: string
}

export interface ICreateRoleRequest {
  name: string
}

export interface IUpdateRoleRequest {
  id: string
  name: string
}

export interface IRolePermissionRelation {
  id: string
  roleId: string
  permissionId: string
  permission?: IPermission
  role?: IRole
  createdAt?: string
}

export interface ICreateRolePermissionRelationRequest {
  roleId: string
  permissionId: string
}

// Re-export for convenience
import { IPermission } from './permission.model'
