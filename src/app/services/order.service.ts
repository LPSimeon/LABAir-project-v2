import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from '../interfaces/order';
import { CartService } from './cart.service';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class OrderService {
    private apiOrderURL = 'http://localhost:3000/ordini';
    private apiBackendURL = 'http://localhost:8080/api/v1/ordine';

    constructor(
        private httpClient: HttpClient,
        private cartService: CartService,
        private router: Router,
    ) {}

    // REST API methods
    // Get all orders rest api
    getAllOrders(): Observable<Order[]> {
        return this.httpClient.get<Order[]>(this.apiOrderURL);
    }

    // Get order by id rest api
    getOrderById(orderId: string): Observable<Order> {
        return this.httpClient.get<Order>(`${this.apiBackendURL}/${orderId}`);
    }

    // Create order resti api
    createOrder(order: Order): Observable<Object> {
        return this.httpClient.post(`${this.apiBackendURL}/create`, order);
    }

    // Delete order rest api
    deleteOrder(orderId: string): Observable<Object> {
        return this.httpClient.delete(`${this.apiBackendURL}/${orderId}`);
    }

    // Method to place the order
    placeNewOrder(finalizedObj: Order) {
        // finalizedObj.id = this.generateOrderId(finalizedObj);

        console.log('Vedi qua: ', finalizedObj);

        this.createOrder(finalizedObj).subscribe({
            next: () => {
                this.cartService.emptyCart();
                this.router.navigate(['/checkout/order-confirmed']);
            },
            error: (err) => console.log('Errore:', err),
        });
    }
}
