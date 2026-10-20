// CreditAccountDrawer · contenido del panel derecho en cartera: estado de cuenta del cliente seleccionado
// conecta con: wallet.slice (cliente seleccionado); muestra CreditAccountEmpty o CreditAccountDetail; lo muestra DrawerRight
// ojo: antes este archivo traía todo (detalle, abono y facturas); ahora solo decide qué mostrar
import React from 'react'
import { useAppSelector } from '@/global/hooks/useRedux'
import { CreditAccountEmpty } from './CreditAccountEmpty'
import { CreditAccountDetail } from './CreditAccountDetail'

export const CreditAccountDrawer: React.FC = () => {
  const { customers, selectedCustomerId } = useAppSelector((state) => state.wallet)
  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId)

  return selectedCustomer ? <CreditAccountDetail customer={selectedCustomer} /> : <CreditAccountEmpty />
}

export default CreditAccountDrawer
