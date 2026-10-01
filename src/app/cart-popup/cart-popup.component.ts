import { Component, EventEmitter, Output } from '@angular/core';
import { CartService } from '../services/cart.service';
import { timer, Subscription } from 'rxjs';
import { CartItem } from '../interfaces/cartItem';

@Component({
    selector: 'app-cart-popup',
    standalone: false,
    templateUrl: './cart-popup.component.html',
    styleUrl: './cart-popup.component.scss'
})
export class CartPopupComponent {

    @Output() blurChange = new EventEmitter<boolean>();

    onMenuOpen() {
        this.blurChange.emit(true);
    }

    onMenuClose() {
        this.blurChange.emit(false);
    }

    isVisible = false;

    cartItem!: CartItem;
    itemCount: number = 0; // Number of item selected

    private timerSub: Subscription | null = null;

    constructor(private cartService: CartService) { }

    ngOnInit() {
        this.cartService.popupState$.subscribe(state => {
            this.isVisible = state.isOpen;
            this.cartItem = state.data;
            // this.cartProduct.push(this.cartItems)
            // console.log(this.cartItem);
        });

        // Subscription for the number of selected products
        this.cartService.cart$.subscribe(items => {
            this.itemCount = items.reduce((acc, item) => acc + item.quantita, 0);
        })

        this.startTimer();
    }

    // Method to close the popup
    closeComponent() {
        this.cartService.closePopup();
    }

    // Method used to start a timer to close this component
    startTimer() {
        this.stopTimer();

        this.timerSub = timer(7000).subscribe(() => {
            console.log("popup closed");
            this.closeComponent();
        });

    }

    // Method used to stop the timer
    stopTimer() {
        if (this.timerSub) {
            this.timerSub.unsubscribe();
            this.timerSub = null;
        }
        console.log("timer resettato");
    }

    // Method used to redirect or to the cart or to the checkout
    goTo(destination: 'cart' | 'checkout') {
        this.stopTimer();

        if (destination == 'checkout')
            this.cartService.setCheckoutState(true);

        this.closeComponent();
    }

    ngOnDestroy() {
        this.isVisible = false;
        this.stopTimer();
        this.closeComponent();
    }
}
