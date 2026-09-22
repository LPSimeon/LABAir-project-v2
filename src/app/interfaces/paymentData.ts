export interface PaymentData {
    method: '' | 'CARTA' | 'PAYPAL' | 'GPAY';
    cardNumber?: string;
    cardDate?: string;
    cardCVV?: string;
}
