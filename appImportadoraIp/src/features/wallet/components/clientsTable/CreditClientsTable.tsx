// CreditClientsTable · tabla de clientes: barra de filtros, encabezado y una fila por cliente
// conecta con: wallet.slice, wallet.selectors; las partes son CreditClientsToolbar y CreditClientRow; al hacer clic abre CreditAccountDrawer
import React from 'react'
import './CreditClientsTable.css'
import { useAppDispatch, useAppSelector } from '@/global/hooks/useRedux'
// ojo: el filtrado ahora sale de wallet.selectors y la fila vive en CreditClientRow (antes estaba todo aquí dentro)
import { selectFilteredCustomers } from '../../selectors/wallet.selectors'
import { resetFilters } from '../../slices/wallet.slice'
import { CreditClientsToolbar } from './CreditClientsToolbar'
import { CreditClientRow } from '../clientRow/CreditClientRow'

export const CreditClientsTable: React.FC = () => {
  const dispatch = useAppDispatch()
  const selectedCustomerId = useAppSelector((state) => state.wallet.selectedCustomerId)

  // Filtrado reactivo de clientes
  const filteredCustomers = useAppSelector(selectFilteredCustomers)

  return (
    <div className="credit-table-clients-card">
      <CreditClientsToolbar />

      {/* Tabla de Clientes */}
      <div className="credit-table-responsive">
        <table className="credit-table">
          <thead>
            <tr>
              <th>Cliente / Razón Social</th>
              <th>Contacto / Ciudad</th>
              <th>Cupo Total</th>
              <th>Saldo Adeudado</th>
              <th className="credit-table-th-usage">Uso de Cupo</th>
              <th>Disponible</th>
              <th>Estado</th>
              <th className="credit-table-align-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((cust) => (
                <CreditClientRow key={cust.id} customer={cust} isSelected={selectedCustomerId === cust.id} />
              ))
            ) : (
              <tr>
                <td colSpan={8} className="credit-table-empty-td">
                  <div className="credit-table-empty-content">
                    <p>No se encontraron clientes con los filtros seleccionados.</p>
                    <button
                      type="button"
                      onClick={() => dispatch(resetFilters())}
                      className="credit-table-reset-link"
                    >
                      Restablecer filtros
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default CreditClientsTable
