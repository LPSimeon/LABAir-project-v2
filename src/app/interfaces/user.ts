import { CartItem } from './cartItem';
import { ShippingData } from './shippingData';
import { Order } from './order';
import { Product } from './product';

export interface User {
    id: number;
    email: string;
    nome: string;
    cognome: string;
    shippingData?: ShippingData;
    carrello: CartItem[];
    ordini?: Order[];
    preferiti?: Product[];
}
