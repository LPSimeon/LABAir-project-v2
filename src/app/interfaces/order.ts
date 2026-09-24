import { CartItem } from './cartItem';
import { ShippingData } from './shippingData';

export interface Order {
    id?: string;
    dati_spedizione: ShippingData;
    pagamento: string;
    prodotti?: CartItem[];
    totale?: number;
    data_ordine?: string;
}
