// WalletScreen · pantalla de cartera: KPIs arriba y tabla de clientes
// conecta con: WalletKpiHeader, CreditClientsTable; la monta MainContent
// src/features/wallet/screens/WalletScreen.tsx
import React from 'react'
import './WalletScreen.css'
import { WalletKpiHeader } from '../components/kpis/WalletKpiHeader'
import { CreditClientsTable } from '../components/clientsTable/CreditClientsTable'

export const WalletScreen: React.FC = () => {
  return (
    <div className="wallet-screen">
      {/* 1. Métricas KPI Superiores
      <section className="wallet-section-kpis">
        <WalletKpiHeader />
      </section> */}

      {/* 2. Tabla Principal de Clientes y Cupos */}
      <section className="wallet-section-table">
        {/* 1. Métricas KPI Superiores */}
        <section className="wallet-section-kpis">
          <WalletKpiHeader />
        </section>
        <CreditClientsTable />
      </section>
    </div>
  )
}

export default WalletScreen
