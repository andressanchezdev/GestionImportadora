// useCreditPayment · maneja el abono de un cliente: monto digitado, validación, registro y mensaje de éxito
// conecta con: CreditAccountDetail (lo usa); wallet.slice (registerPayment), wallet.helpers (parsePaymentAmount), global toast
// ojo: antes esta lógica vivía dentro de CreditAccountDrawer.tsx
import { useState } from 'react'
import { formatCOP } from '@/global/helpers/format'
import { toast } from '@/global/helpers/toast'
import { useAppDispatch } from '@/global/hooks/useRedux'
import { registerPayment } from '../slices/wallet.slice'
import { parsePaymentAmount } from '../helpers/wallet.helpers'

export const useCreditPayment = (customerId: string) => {
  const dispatch = useAppDispatch()
  const [paymentAmount, setPaymentAmount] = useState<string>('')
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // registra el abono: de una factura completa (fullAmount) o del monto digitado en el formulario
  const submitPayment = (invoiceId?: string, fullAmount?: number) => {
    const amount = fullAmount ?? parsePaymentAmount(paymentAmount)
    // ojo: antes esto era un alert(); ahora es una alerta flotante (sonner)
    if (!amount) {
      toast.error('Monto inválido', { description: 'Por favor digita un monto válido a abonar.' })
      return
    }

    dispatch(registerPayment({ customerId, amount, invoiceId }))

    setPaymentAmount('')
    setSuccessMessage(`¡Abono de ${formatCOP(amount)} registrado con éxito!`)
    setTimeout(() => setSuccessMessage(null), 4000)
  }

  return { paymentAmount, setPaymentAmount, successMessage, submitPayment }
}
