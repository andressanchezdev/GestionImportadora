// ShopCartFooter · pie del carrito: total a facturar, vaciar y finalizar pedido
// conecta con: shop.cart.thunks (vaciar en el backend), shop.selectors (total), global toast (aviso de pedido listo)
import React from 'react'
import { formatCOP } from '@/global/helpers/format'
import { toast } from '@/global/helpers/toast'
import { useAppDispatch, useAppSelector } from '@/global/hooks/useRedux'
import { clearCartThunk } from '../../thunks/shop.cart.update.thunks'
import { selectCartMutating, selectCartTotals } from '../../selectors/shop.selectors'
import './ShopCartFooter.css'

export const ShopCartFooter: React.FC = () => {
  const dispatch = useAppDispatch()
  const { totalAmount } = useAppSelector(selectCartTotals)
  const isBusy = useAppSelector(selectCartMutating)

  return (
    <div className="shop-cart-footer">
      <div className="shop-cart-total-row">
        <span className="shop-cart-total-label">Total a Facturar:</span>
        <span className="shop-cart-total-value">{formatCOP(totalAmount)}</span>
      </div>

      <div className="shop-cart-actions">
        <button type="button" onClick={() => dispatch(clearCartThunk())} disabled={isBusy} className="shop-cart-btn-clear">
          Vaciar
        </button>
        <button
          type="button"
          className="shop-cart-btn-checkout"
          onClick={() => toast.success('¡Pedido listo para confirmación de venta!')}
        >
          Finalizar Pedido →
        </button>
      </div>
    </div>
  )
}

export default ShopCartFooter
