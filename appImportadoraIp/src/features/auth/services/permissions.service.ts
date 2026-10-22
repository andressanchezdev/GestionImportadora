// permissions.service · llamadas a Swagger para gestión jerárquica de permisos de empleados
// conecta con: apiClient, API_CONFIG (EMPLOYEES), permissions.types y RolesPermissionsScreen
import { apiClient, API_CONFIG, toPaginated, type APIResponse } from '@/api'
import type {
  EmployeePermissionsResponse,
  ModulePermission,
} from '../types/permissions.types'

export interface SimpleEmployee {
  employeeId: number
  name: string
  lastName?: string
  email: string
  identification: string
  workModality?: string
  primaryWarehouseId?: number
}

const { EMPLOYEES } = API_CONFIG.ENDPOINTS

export const fetchEmployeesList = async (companyId: number): Promise<SimpleEmployee[]> => {
  const { data } = await apiClient.post<APIResponse<any>>(EMPLOYEES.LIST, {
    companyId,
    limit: 50,
    page: 1,
  })

  const rawList = Array.isArray(data.data)
    ? data.data
    : toPaginated(data).items || []

  return rawList.map((emp: any) => ({
    employeeId: emp.employeeId || emp.userId || emp.id,
    name: emp.name || '',
    lastName: emp.lastName,
    email: emp.email || '',
    identification: emp.identification || '',
    workModality: emp.workModality,
    primaryWarehouseId: emp.primaryWarehouseId,
  }))
}

export const fetchEmployeePermissions = async (
  employeeId: number
): Promise<EmployeePermissionsResponse> => {
  const { data } = await apiClient.post<APIResponse<any>>(EMPLOYEES.PERMISSIONS, {
    employeeId,
  })

  const payload = data.data || {}
  return {
    branches: payload.branches || [],
    modules: payload.modules || [],
  }
}

export const saveEmployeePermissions = async (
  employeeId: number,
  modules: ModulePermission[]
): Promise<void> => {
  await apiClient.post(EMPLOYEES.SAVE_PERMISSIONS, {
    employeeId,
    modules,
  })
}
