import type { Metadata } from 'next';
import { CartView } from '@/components/cart-view';
import { CartGate } from '@/components/cart-gate';
export const metadata:Metadata={title:'Your bag'};
export default function CartPage(){return <div className="page-shell cart-shell"><div className="cart-page-heading"><h1>Your cart</h1></div><CartGate><CartView/></CartGate></div>}
