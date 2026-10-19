// src/features/cartera/screens/CarteraScreen.tsx
import React from 'react'
import './CarteraScreen.css'
import { CarteraKPIHeader } from '../components/CarteraKPIHeader'
import { CreditClientsTable } from '../components/CreditClientsTable'

export const CarteraScreen: React.FC = () => {
  return (
    <div className="cartera-screen">
      {/* 1. Métricas KPI Superiores */}
      <section className="cartera-section-kpis">
        <CarteraKPIHeader />
      </section>

      {/* 2. Tabla Principal de Clientes y Cupos */}
      <section className="cartera-section-table">
        <CreditClientsTable />
      </section>
    </div>
  )
}

export default CarteraScreen
