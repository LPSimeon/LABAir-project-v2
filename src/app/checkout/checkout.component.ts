import { Component } from '@angular/core';
import { CartService } from '../services/cart.service';
import { NgForm } from '@angular/forms';
import { ShippingData } from '../interfaces/shippingData';
import { PaymentData } from '../interfaces/paymentData';
import { cc_number_format } from '../utils/string-utils';
import { cc_expires_format } from '../utils/string-utils';
import { CartItem } from '../interfaces/cartItem';
import { OrderService } from '../services/order.service';
import { Order } from '../interfaces/order';
import { AuthService } from '../services/auth.service';

@Component({
    selector: 'app-checkout',
    standalone: false,
    templateUrl: './checkout.component.html',
    styleUrl: './checkout.component.scss',
})
export class CheckoutComponent {
    // far funzionare il checkout anche se sei ospite, se loggato i valori di email, nome e cognome devono essere riempiti in automatico (forse da estrarre nel token)
    constructor(
        private authService: AuthService,
        private cartService: CartService,
        private orderService: OrderService,
    ) {}

    cartItems: CartItem[] = [];
    cartSubTotal: number = 0;

    shippingData: ShippingData = {
        email: '',
        nome: '',
        cognome: '',
        indirizzo: '',
        cap: '',
        citta: '',
        paese: 'Italia',
        tel: '',
    };
    paymentData: PaymentData = {
        method: '',
        cardNumber: '',
        cardDate: '',
    };

    popupFlag1: boolean = false;
    popupFlag2: boolean = false;
    popupFlag3: boolean = false;
    popupFlag4: boolean = false;

    // Flags to open the forms
    paymentFlag: boolean = false;
    verifyFlag: boolean = false;

    cardImgFlag: boolean = false;
    cardImgType: string = '';

    ngOnInit() {
        this.cartService.cart$.subscribe((items) => {
            this.cartItems = items;
        });
        console.log('Checkout');
        console.log('cartItems: ', this.cartItems);

        this.cartService.subtotal$.subscribe((subtotal) => {
            this.cartSubTotal = subtotal;
        });

        this.cartService.setCheckoutState(true);

        this.cardImgFlag = false;
        this.cardImgType = '';
    }

    // capire cosa e come portare alla sezione del pagamento
    saveShippingAddress(form: NgForm) {
        if (form.valid) this.paymentFlag = true;

        console.log('shippingData saved:', this.shippingData);
    }

    savePaymentMethod(form: NgForm) {
        if (form.valid) {
            this.paymentData = { ...this.paymentData, ...form.value };
            this.verifyFlag = true;
        }
    }

    placeOrder() {
        // removed id and data_ordine
        const oggettoFinale: Order = {
            dati_spedizione: this.shippingData,
            pagamento: this.paymentData.method,
        };

        this.orderService.placeNewOrder(oggettoFinale);
    }

    // Method used to open the popups with the '?'
    showPopup(popup: string) {
        switch (popup) {
            case 'subtotale':
                this.popupFlag1 = !this.popupFlag1;
                break;

            case 'paese-fatturazione':
                this.popupFlag2 = !this.popupFlag2;
                break;
            case 'gift-card':
                this.popupFlag3 = !this.popupFlag3;
                break;
            case 'trova-cvv':
                this.popupFlag4 = !this.popupFlag4;
                break;

            default:
                console.log('Popup non trovato');
        }
    }

    getItemTotalPrice(item: CartItem): number {
        if (item.prezzo && item.quantita) return item.prezzo * item.quantita;
        else return 0;
    }

    // Method used to remove non-numerical characters and format the card number with keyup event
    handleCardNumberKeyup(e: Event) {
        const input = e.target as HTMLInputElement;

        const formatted = cc_number_format(input.value);

        input.value = formatted;
        this.paymentData.cardNumber = formatted;

        if (formatted[0] === '4') {
            this.cardImgType = 'visa';
            this.cardImgFlag = true;
        } else if (formatted[0] === '5' || formatted[0] === '2') {
            this.cardImgType = 'mastercard';
            this.cardImgFlag = true;
        } else {
            this.cardImgFlag = false;
        }
    }

    // Method used to check the expiration date
    checkDate(e: Event): void {
        const input = e.target as HTMLInputElement;
        input.value = cc_expires_format(input.value);
        this.paymentData.cardDate = input.value;
    }

    // Method used to show the first four number of the credit card number
    trimCardNumber(): string {
        if (this.paymentData.cardNumber)
            return this.paymentData.cardNumber.substring(0, 4);
        else return '';
    }

    // Methods used to return to the inputs of the forms
    modifyShippingForm() {
        this.paymentFlag = false;
        this.verifyFlag = false;
    }
    modifyPaymentForm() {
        this.verifyFlag = false;
    }

    ngOnDestroy() {
        this.cartService.setCheckoutState(false);
    }
}
