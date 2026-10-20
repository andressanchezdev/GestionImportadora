// ShopCartDrawer · carrito POS: lista de items (o vacío) y pie con total
// ojo: el encabezado (título y cantidad de artículos) ahora lo pinta el panel derecho (DrawerHeader) con shop.selectors (selectCartDrawerMeta)
// conecta con: shop.slice y shop.selectors; las partes son ShopCartItem, ShopCartEmpty y ShopCartFooter; lo muestra DrawerRight en la tienda
import React from 'react'
import './ShopCartDrawer.css'
import { useAppSelector } from '@/global/hooks/useRedux'
import { ShopCartItem } from './ShopCartItem'
import { ShopCartEmpty } from './ShopCartEmpty'
import { ShopCartFooter } from './ShopCartFooter'

export const ShopCartDrawer: React.FC = () => {
  const { cart } = useAppSelector((state) => state.shop)

  return (
    <div className="shop-cart-drawer">
      {/* Lista de Items en Carrito */}
      <div className="shop-cart-items-container">
        {cart.length > 0 ? (
          <div className="shop-cart-list">
            {cart.map((item) => (
              <ShopCartItem key={`${item.productId}-${item.priceLevel}`} item={item} />
            ))}
          </div>
        ) : (
          <ShopCartEmpty />
        )}
      </div>

      {/* Pie con Totales y Botones de Acción */}
      {cart.length > 0 && <ShopCartFooter />}
    </div>
  )
}

export default ShopCartDrawer
