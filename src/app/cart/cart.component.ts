import { Component } from '@angular/core';
import { CartService } from '../services/cart.service';
import { ProductData } from '../interfaces/productData';
import { CartItem } from '../interfaces/cartItem';
import { AuthService } from '../services/auth.service';

@Component({
    selector: 'app-cart',
    standalone: false,
    templateUrl: './cart.component.html',
    styleUrl: './cart.component.scss',
})
export class CartComponent {
    constructor(
        private authService: AuthService,
        private cartService: CartService,
    ) {}

    cartItems: CartItem[] = [];

    totalPrice: number = 0;
    itemCount: number = 0;
    noItemsFlag: boolean = false;
    isPopupOpen: boolean = false;

    ngOnInit() {
        if (this.authService.isLoggedIn()) {
            this.cartService.getAllItems().subscribe((data) => {
                console.log('Carrello utente', data);
            });
        }
        // In order to change the number of items and the price in the html we're going to calculate these values in the subscription
        this.cartService.cart$.subscribe((data) => {
            if (data === null) return;

            this.cartItems = data;
            // console.log("cartItems: ", this.cartItems);
            // To show the message alert
            if (this.cartItems.length === 0) {
                this.noItemsFlag = true;
                console.log('Carrello vuoto');
            } else this.noItemsFlag = false;
            // In order to calculate the total price
        });

        this.cartService.subtotal$.subscribe((subtotal) => {
            this.totalPrice = subtotal;
        });
    }

    // Method used to add the quantity of the selected item by 1
    addCartItem(selectedItem: CartItem) {
        this.cartService.addItemToCart(selectedItem);
    }

    // Method used to substract 1 or to delete the item from the cart
    removeCartItem(selectedItem: CartItem) {
        this.cartService.removeItemFromCart(selectedItem);
    }

    // Method used to open the popup of "?" button next to "Subtotale"
    showPopup() {
        this.isPopupOpen = !this.isPopupOpen;
    }

    goToCheckout() {
        this.cartService.setCheckoutState(true);
    }
}
