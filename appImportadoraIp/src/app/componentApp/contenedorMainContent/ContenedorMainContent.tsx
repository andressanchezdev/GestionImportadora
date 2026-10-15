import React from 'react'
import './ContenedorMainContent.css'
import { useAppSelector } from '@/app/store/store'
import { StatCard } from '@/global/components/UI/molecules/StatCard'

export const ContenedorMainContent: React.FC = () => {
    const { activeModule, activeWarehouseName } = useAppSelector((state) => state.ui)

    return (
        <main className="contenedor-main-content">
            {/* Encabezado del Área de Trabajo */}
            <div className="main-content-header">
                <div>
                    <div className="main-content-breadcrumb">
                        <span>Inicio</span>
                        <span>/</span>
                        <span className="capitalize">{activeModule}</span>
                    </div>
                    <h2 className="main-content-title">
                        <span>📦</span>
                        <span>Módulo: {activeModule}</span>
                    </h2>
                    <p className="main-content-subtitle">
                        Espacio de trabajo operativo para <strong>{activeWarehouseName}</strong>
                    </p>
                </div>

                <div className="main-content-header-actions">
                    <button className="main-content-btn-sync">
                        Sincronizar
                    </button>
                    <button className="main-content-btn-action">
                        + Nueva Operación
                    </button>
                </div>
            </div>

            {/* Tarjetas Esqueleto de Métricas (KPIs visuales) */}
            <div className="main-content-kpis-grid">
                <StatCard
                    title="Operaciones de Hoy"
                    value="24 Registros"
                    subtitle="Sincronizado con base local"
                    trend={{ value: 'Activo', positive: true }}
                    icon="📊"
                />
                <StatCard
                    title="Bodega Seleccionada"
                    value={activeWarehouseName}
                    subtitle="Capacidad operativa 100%"
                    badge={{ text: 'En Línea', variant: 'emerald' }}
                    icon="🏢"
                />
                <StatCard
                    title="Estado del Sistema"
                    value="ERP Listo"
                    subtitle="Esqueleto visual conectado"
                    badge={{ text: 'Sin Músculos', variant: 'indigo' }}
                    icon="⚡"
                />
            </div>

            {/* Área del Lienzo Central (Slot para contenido) */}
            <section className="main-content-canvas-section">
                <div className="main-content-canvas-header">
                    <h3 className="main-content-canvas-title">
                        Lienzo Base del Contenedor Central
                    </h3>
                    <span className="main-content-canvas-tag">
                        src/app/componentesApp/contenedorMainContent
                    </span>
                </div>

                <div className="main-content-canvas-placeholder">
                    <span className="main-content-canvas-placeholder-icon">🧱</span>
                    <p className="main-content-canvas-placeholder-heading">
                        Estructura Esqueleto Unida
                    </p>
                    <p className="main-content-canvas-placeholder-text">
                        Aquí se integrará el contenido de cada módulo cuando decidamos comenzar a desarrollar los features.
                    </p>
                </div>
            </section>
        </main>
    )
}
