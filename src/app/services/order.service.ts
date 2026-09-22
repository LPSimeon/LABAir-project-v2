import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from '../interfaces/order';
import { CartService } from './cart.service';

@Injectable({
    providedIn: 'root',
})
export class OrderService {
    private apiOrderURL = 'http://localhost:3000/ordini';
    private apiBackendURL = 'http://localhost:8080/api/v1/ordine';

    constructor(
        private httpClient: HttpClient,
        private cartService: CartService,
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

    // Modify order rest api
    updateOrder(orderId: string, modifiedOrder: Order): Observable<Object> {
        return this.httpClient.patch(
            `${this.apiBackendURL}/${orderId}`,
            modifiedOrder,
        );
    }

    // Delete order rest api
    deleteOrder(orderId: string): Observable<Object> {
        return this.httpClient.delete(`${this.apiBackendURL}/${orderId}`);
    }

    // Method to place the order
    placeNewOrder(finalizedObj: Order) {
        finalizedObj.id = this.generateOrderId(finalizedObj);

        console.log('Vedi qua: ', finalizedObj);

        this.createOrder(finalizedObj).subscribe({
            next: () => this.cartService.emptyCart(),
            error: (err) => console.log('Errore:', err),
        });
    }

    // Method used to generate the order id
    generateOrderId(order: Order): string {
        let numberId = '';

        for (let i = 0; i < 4; i++) {
            numberId += Math.floor(Math.random() * 9);
        }

        return `ordine-${order.dati_spedizione.nome.charAt(0).toLocaleLowerCase()}${order.dati_spedizione.cognome.charAt(0).toLocaleLowerCase()}-${numberId}`; // -${order.data_ordine} rimosso per adesso
    }
}
