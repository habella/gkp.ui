/**
 * User model interfaces based on GateKeeper API
 */

export enum UserStatus {
  Inactive = 0,
  Active = 1,
  EmailNotConfirmed = 2,
  UpdatePassword = 3,
}

export interface IUser {
  id: string
  email: string
  firstName: string
  lastName: string
  username?: string
  status: UserStatus
  isActive: boolean
  createdAt?: string
  updatedAt?: string
}

export interface IRegisterUserRequest {
  email: string
  firstName: string
  lastName: string
}

export interface IUserRoleRelation {
  id: string
  userId: string
  roleId: string
  role?: IRole
  user?: IUser
  createdAt?: string
}

export interface ICreateUserRoleRelationRequest {
  userId: string
  roleId: string
}

// Re-export for convenience
import { IRole } from './role.model'
