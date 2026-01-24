/**
 * Permission model interfaces based on GateKeeper API
 */

export interface IPermission {
  id: string
  name: string
  description: string
  group: string
  subGroup: string | null
  createdAt?: string
  updatedAt?: string
}

export interface ICreatePermissionRequest {
  name: string
  description: string
  group: string
  subGroup: string | null
}

export interface IUpdatePermissionRequest {
  id: string
  name: string
  description: string
  group: string
  subGroup: string | null
}
