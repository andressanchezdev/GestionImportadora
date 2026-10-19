// src/features/cartera/components/CreditClientsTable.tsx
import React, { useMemo } from 'react'
import './CreditClientsTable.css'
import { useAppDispatch, useAppSelector } from '@/app/store/store'
import { SearchBar } from '@/global/components/UI/molecules/SearchBar'
import type { CreditStatus } from '../types/cartera.types'
import {
  setSearchQuery,
  setStatusFilter,
  setSelectedCustomer,
  resetFilters,
} from '../slices/cartera.slice'

export const CreditClientsTable: React.FC = () => {
  const dispatch = useAppDispatch()
  const { customers, filters, selectedCustomerId } = useAppSelector(
    (state) => state.cartera
  )

  const formatCOP = (val: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(val)
  }

  // Filtrado reactivo de clientes
  const filteredCustomers = useMemo(() => {
    return customers.filter((cust) => {
      // 1. Búsqueda por texto (NIT, Razón Social, Contacto, Ciudad)
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase().trim()
        const matchesDoc = cust.documentId.toLowerCase().includes(query)
        const matchesName = cust.businessName.toLowerCase().includes(query)
        const matchesContact = cust.contactName.toLowerCase().includes(query)
        const matchesCity = cust.city.toLowerCase().includes(query)
        if (!matchesDoc && !matchesName && !matchesContact && !matchesCity) {
          return false
        }
      }

      // 2. Filtro por estado
      if (filters.statusFilter !== 'todos') {
        if (cust.creditStatus !== filters.statusFilter) return false
      }

      return true
    })
  }, [customers, filters])

  const getStatusBadge = (status: CreditStatus) => {
    switch (status) {
      case 'al_dia':
        return <span className="credit-badge badge-al-dia">● Al día</span>
      case 'alerta_30':
        return <span className="credit-badge badge-alerta">● Alerta 30d</span>
      case 'mora_60':
        return <span className="credit-badge badge-mora">● Mora &gt;60d</span>
      case 'bloqueado':
        return <span className="credit-badge badge-bloqueado">● Bloqueado</span>
      default:
        return null
    }
  }

  const getUsagePercentage = (used: number, limit: number) => {
    if (limit <= 0) return 0
    return Math.min(100, Math.round((used / limit) * 100))
  }

  const getUsageColorClass = (pct: number) => {
    if (pct >= 90) return 'progress-critical'
    if (pct >= 70) return 'progress-warning'
    return 'progress-normal'
  }

  return (
    <div className="credit-clients-card">
      {/* Barra de Filtros y Búsqueda */}
      <div className="credit-table-toolbar">
        <SearchBar
          value={filters.searchQuery}
          onChange={(val) => dispatch(setSearchQuery(val))}
          placeholder="Buscar por NIT, razón social, contacto o ciudad..."
          className="credit-search-bar"
        />

        {/* Pestañas de Estado Crediticio */}
        <div className="credit-status-tabs">
          {(
            [
              { key: 'todos', label: 'Todos' },
              { key: 'al_dia', label: 'Al Día' },
              { key: 'alerta_30', label: 'Alerta (30d)' },
              { key: 'mora_60', label: 'En Mora (>60d)' },
              { key: 'bloqueado', label: 'Bloqueados' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => dispatch(setStatusFilter(tab.key))}
              className={`credit-tab-btn ${filters.statusFilter === tab.key ? 'credit-tab-btn-active' : ''
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tabla de Clientes */}
      <div className="credit-table-responsive">
        <table className="credit-table">
          <thead>
            <tr>
              <th>Cliente / Razón Social</th>
              <th>Contacto / Ciudad</th>
              <th>Cupo Total</th>
              <th>Saldo Adeudado</th>
              <th style={{ width: 140 }}>Uso de Cupo</th>
              <th>Disponible</th>
              <th>Estado</th>
              <th style={{ textAlign: 'right' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((cust) => {
                const pct = getUsagePercentage(cust.usedCredit, cust.creditLimit)
                const isSelected = selectedCustomerId === cust.id
                return (
                  <tr
                    key={cust.id}
                    className={`credit-row ${isSelected ? 'credit-row-selected' : ''}`}
                    onClick={() => dispatch(setSelectedCustomer(cust.id))}
                  >
                    <td>
                      <div className="cust-business-name">{cust.businessName}</div>
                      <div className="cust-document">NIT: {cust.documentId}</div>
                    </td>
                    <td>
                      <div className="cust-contact">{cust.contactName}</div>
                      <div className="cust-city">{cust.city} · {cust.phone}</div>
                    </td>
                    <td className="cust-currency font-mono">{formatCOP(cust.creditLimit)}</td>
                    <td className="cust-currency font-mono font-semibold text-rose">
                      {formatCOP(cust.usedCredit)}
                    </td>
                    <td>
                      <div className="credit-usage-wrapper">
                        <div className="credit-progress-bar">
                          <div
                            className={`credit-progress-fill ${getUsageColorClass(pct)}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="credit-usage-text">{pct}%</span>
                      </div>
                    </td>
                    <td className="cust-currency font-mono text-emerald">
                      {formatCOP(cust.availableCredit)}
                    </td>
                    <td>{getStatusBadge(cust.creditStatus)}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          dispatch(setSelectedCustomer(cust.id))
                        }}
                        className="credit-btn-detail"
                      >
                        Ver Estado →
                      </button>
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan={8} className="credit-empty-td">
                  <div className="credit-empty-content">
                    <p>No se encontraron clientes con los filtros seleccionados.</p>
                    <button
                      type="button"
                      onClick={() => dispatch(resetFilters())}
                      className="credit-reset-link"
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
