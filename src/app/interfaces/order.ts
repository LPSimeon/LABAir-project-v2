import { CartItem } from './cartItem';
import { ShippingData } from './shippingData';
import { PaymentData } from './paymentData';

export interface Order {
    id: string;
    datiSpedizione: ShippingData;
    pagamento: PaymentData;
    prodotti: CartItem[];
    totale: number;
    dataOrdine: string;
}
