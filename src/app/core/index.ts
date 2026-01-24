export interface Configuration {
  fleet_API_ENDPOINT: string
}

export interface MenuItem {
  ID: string
  name: string
  groupId?: string
  path?: string
  icon?: string
  isKpi?: boolean
  roles?: string[]
}

export interface MenuNode {
  menuItem: MenuItem
  subnodes: MenuNode[]
}

export interface BaseResponse {
  statusCode?: number
  value?: any
  isFailure?: boolean
  errors: string[]
}
