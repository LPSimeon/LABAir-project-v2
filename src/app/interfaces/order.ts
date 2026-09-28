import { CartItem } from './cartItem';
import { ShippingData } from './shippingData';

export interface Order {
    id?: string;
    dati_spedizione: ShippingData;
    pagamento: string;
    prodotti?: CartItem[];
    totale?: number;
    data_ordine?: string;
    order_access_token?: string;
    cart_items?: CartItem[];
}

export interface CreateOrder {
    dati_spedizione: ShippingData;
    pagamento: string;
}
