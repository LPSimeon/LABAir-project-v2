import { afterNextRender, Component } from '@angular/core';
import { CartService } from '../services/cart.service';

@Component({
    selector: 'app-order-confirmation',
    standalone: false,
    templateUrl: './order-confirmation.component.html',
    styleUrl: './order-confirmation.component.scss',
})
export class OrderConfirmationComponent {
    constructor(private cartService: CartService) {}

    ngOnInit() {
        afterNextRender(() => {
            this.cartService.setCheckoutState(true);
        });
    }
}
