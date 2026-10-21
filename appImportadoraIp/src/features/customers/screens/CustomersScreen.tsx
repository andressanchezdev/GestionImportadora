// CustomersScreen · pantalla de Terceros > Clientes: búsqueda, tabla de clientes del backend y paginador
// conecta con: customers.slice/selectors (lista y búsqueda), useCustomersLoader (la pide), CustomersTable y global SearchBar y Pagination; la monta MainContent (screenRegistry); al elegir un cliente se abre CustomerDrawer en el panel derecho
// ojo: la búsqueda se aplica sobre la página cargada (el listado del backend solo filtra por empresa y página)
import React from 'react'
import './CustomersScreen.css'
import { useAppDispatch, useAppSelector } from '@/global/hooks/useRedux'
import { SearchBar } from '@/global/components/UI/molecules/SearchBar'
import { Pagination } from '@/global/components/UI/molecules/Pagination'
import { CustomersTable } from '../components/table/CustomersTable'
import { useCustomersLoader } from '../hooks/useCustomersLoader'
import { selectCustomersMeta, selectCustomersQuery, selectCustomersStatus } from '../selectors/customers.selectors'
import { setCustomersPage, setCustomersQuery } from '../slices/customers.slice'

export const CustomersScreen: React.FC = () => {
  const dispatch = useAppDispatch()
  useCustomersLoader()

  const query = useAppSelector(selectCustomersQuery)
  const meta = useAppSelector(selectCustomersMeta)
  const status = useAppSelector(selectCustomersStatus)

  return (
    <div className="customers-screen">
      <div className="customers-screen-card">
        <div className="customers-screen-toolbar">
          <SearchBar
            value={query}
            onChange={(value) => dispatch(setCustomersQuery(value))}
            placeholder="Buscar por nombre, documento, correo o razón social..."
            className="customers-screen-search"
          />
        </div>
        <CustomersTable />
      </div>
      {meta && (
        <Pagination
          meta={meta}
          disabled={status === 'loading'}
          label="Paginación de clientes"
          onPageChange={(page) => dispatch(setCustomersPage(page))}
        />
      )}
    </div>
  )
}

export default CustomersScreen
