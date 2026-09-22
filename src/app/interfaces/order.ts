import { CartItem } from './cartItem';
import { ShippingData } from './shippingData';
import { PaymentData } from './paymentData';

export interface Order {
    id: string;
    dati_spedizione: ShippingData;
    pagamento: string; // per far funzionare il enum del backend
    prodotti?: CartItem[]; // estratti dal backend
    totale?: number; // estratti dal backend
    data_ordine: string;
}
