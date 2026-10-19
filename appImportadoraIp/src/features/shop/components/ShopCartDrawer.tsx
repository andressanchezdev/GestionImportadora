import React from 'react'
import './ShopCartDrawer.css'
import { useAppDispatch, useAppSelector } from '@/app/store/store'
import {
  updateCartQuantity,
  removeFromCart,
  clearCart,
} from '../slices/shop.slice'
import cartIcon from '@/assets/icons/cart.svg'

export const ShopCartDrawer: React.FC = () => {
  const dispatch = useAppDispatch()
  const { cart } = useAppSelector((state) => state.shop)

  const formatCOP = (val: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(val)
  }

  const totalAmount = cart.reduce((acc, item) => acc + item.subtotal, 0)
  const totalItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0)

  return (
    <div className="shop-cart-drawer">
      {/* Encabezado del Carrito */}
      <div className="shop-cart-header">
        <div className="shop-cart-title-group">
          <img src={cartIcon} alt="" className="shop-cart-icon" />
          <h3 className="shop-cart-title">Carrito POS</h3>
        </div>
        <span className="shop-cart-badge">
          {totalItemsCount} {totalItemsCount === 1 ? 'artículo' : 'artículos'}
        </span>
      </div>

      {/* Lista de Items en Carrito */}
      <div className="shop-cart-items-container">
        {cart.length > 0 ? (
          <div className="shop-cart-list">
            {cart.map((item) => (
              <div key={`${item.productId}-${item.priceLevel}`} className="shop-cart-item">
                <div className="shop-cart-item-header">
                  <div>
                    <h4 className="shop-cart-item-name">{item.product.name}</h4>
                    <div className="shop-cart-item-meta">
                      <span className="shop-cart-item-sku">{item.product.code}</span>
                      <span className="shop-cart-item-brand">{item.product.brand}</span>
                      <span className="shop-cart-item-level-tag">{item.priceLevel}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => dispatch(removeFromCart(item.productId))}
                    className="shop-cart-item-remove-btn"
                    title="Eliminar del carrito"
                  >
                    ✕
                  </button>
                </div>

                <div className="shop-cart-item-footer">
                  {/* Stepper de Cantidad */}
                  <div className="shop-cart-stepper">
                    <button
                      type="button"
                      onClick={() =>
                        dispatch(
                          updateCartQuantity({
                            productId: item.productId,
                            quantity: item.quantity - 1,
                          })
                        )
                      }
                      className="shop-cart-stepper-btn"
                    >
                      -
                    </button>
                    <span className="shop-cart-stepper-value">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() =>
                        dispatch(
                          updateCartQuantity({
                            productId: item.productId,
                            quantity: item.quantity + 1,
                          })
                        )
                      }
                      className="shop-cart-stepper-btn"
                    >
                      +
                    </button>
                  </div>

                  {/* Precios */}
                  <div className="shop-cart-item-pricing">
                    <span className="shop-cart-item-unit-price">
                      {formatCOP(item.selectedPrice)} c/u
                    </span>
                    <span className="shop-cart-item-subtotal">
                      {formatCOP(item.subtotal)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="shop-cart-empty">
            <div className="shop-cart-empty-icon">🛒</div>
            <p className="shop-cart-empty-text">El carrito está vacío</p>
            <span className="shop-cart-empty-hint">
              Selecciona repuestos en el catálogo y haz clic en "Ordenar".
            </span>
          </div>
        )}
      </div>

      {/* Pie con Totales y Botones de Acción */}
      {cart.length > 0 && (
        <div className="shop-cart-footer">
          <div className="shop-cart-total-row">
            <span className="shop-cart-total-label">Total a Facturar:</span>
            <span className="shop-cart-total-value">{formatCOP(totalAmount)}</span>
          </div>

          <div className="shop-cart-actions">
            <button
              type="button"
              onClick={() => dispatch(clearCart())}
              className="shop-cart-btn-clear"
            >
              Vaciar
            </button>
            <button
              type="button"
              className="shop-cart-btn-checkout"
              onClick={() => alert('¡Pedido listo para confirmación de venta!')}
            >
              Finalizar Pedido →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ShopCartDrawer
