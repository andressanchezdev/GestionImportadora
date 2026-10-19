import React, { useState } from 'react'
import './DrawerRight.css'
import { useAppSelector } from '@/app/store/store'
import { ShopCartDrawer } from '@/features/shop'
import { CreditAccountDrawer } from '@/features/cartera'
import fileTextIcon from '@/assets/icons/file-text.svg'
import cartIcon from '@/assets/icons/cart.svg'
import walletIcon from '@/assets/icons/wallet.svg'

export const DrawerLateralDerecho: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true)
  const { activeModule } = useAppSelector((state) => state.ui)
  const { cart } = useAppSelector((state) => state.shop)

  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0)

  const renderDrawerBody = () => {
    if (activeModule === 'tienda') {
      return <ShopCartDrawer />
    }

    if (activeModule === 'cartera') {
      return <CreditAccountDrawer />
    }

    return (
      <div className="drawer-placeholder" style={{ padding: '2rem 1rem', textAlign: 'center' }}>
        <img
          src={fileTextIcon}
          alt=""
          className="drawer-placeholder-icon"
          style={{ width: 32, height: 32, opacity: 0.5, marginBottom: 8 }}
        />
        <p style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
          Panel lateral contextual para <strong>{activeModule}</strong>.
        </p>
      </div>
    )
  }

  return (
    <aside
      className={`drawer-lateral ${
        isOpen ? 'drawer-lateral-open' : 'drawer-lateral-collapsed'
      }`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="drawer-toggle-btn"
        title={isOpen ? 'Contraer panel' : 'Expandir panel'}
      >
        {isOpen ? '›' : '‹'}
      </button>

      {isOpen ? (
        <div className="drawer-content" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {renderDrawerBody()}
        </div>
      ) : (
        <div className="drawer-collapsed-view">
          <button
            onClick={() => setIsOpen(true)}
            className="drawer-collapsed-icon-btn"
            title="Expandir panel"
          >
            <img
              src={
                activeModule === 'tienda'
                  ? cartIcon
                  : activeModule === 'cartera'
                  ? walletIcon
                  : fileTextIcon
              }
              alt="Icono"
              className="drawer-collapsed-icon"
            />
            {activeModule === 'tienda' && cartItemsCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: -4,
                  right: -4,
                  background: '#2563eb',
                  color: '#fff',
                  fontSize: 10,
                  fontWeight: 700,
                  borderRadius: 9999,
                  width: 18,
                  height: 18,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {cartItemsCount}
              </span>
            )}
          </button>
        </div>
      )}
    </aside>
  )
}

export default DrawerLateralDerecho
