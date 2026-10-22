// permissions.types · contratos de permisos jerárquicos por empleado (Swagger)
// conecta con: auth.types, usePermissions, RolesPermissionsScreen y backend /employees/permissions

export interface BranchPermissionInfo {
  branchId: number
  branchName: string
  isPrimary: boolean
}

export interface ScreenPermission {
  screenId?: number
  screenKey?: string
  canRead: boolean
  canCreate: boolean
  canUpdate: boolean
  canDelete: boolean
}

export interface ModulePermission {
  moduleId?: number
  moduleKey: string
  canRead: boolean
  canCreate: boolean
  canUpdate: boolean
  canDelete: boolean
  screens: ScreenPermission[]
}

export interface EmployeePermissionsResponse {
  branches?: BranchPermissionInfo[]
  modules?: ModulePermission[]
}

export interface SaveModulePermissionsRequest {
  employeeId: number
  modules: ModulePermission[]
}

export interface GetEmployeePermissionsRequest {
  employeeId: number
}
