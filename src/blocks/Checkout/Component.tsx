import React from 'react'

import type { CheckoutBlock as Props } from '@/payload-types'

import { CartProvider } from '@/components/Cart/CartProvider'
import { CheckoutForm } from './CheckoutForm'

/**
 * The checkout page, after the "HemClear express checkout" reference: the form on the left,
 * the order, the guarantee, the promises and customer quotes on a tinted column at right.
 *
 * The order is whatever the reader put in the cart on a product page. The cart lives in the
 * browser, so this mounts its own provider and reads the same stored cart.
 */
export const CheckoutBlock: React.FC<Props> = (props) => (
  <CartProvider>
    <CheckoutForm {...props} />
  </CartProvider>
)
