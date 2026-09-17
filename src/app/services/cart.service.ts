import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, forkJoin } from 'rxjs';
import { ProductData } from '../interfaces/productData';
import { HttpClient } from '@angular/common/http';
import { CartItem } from '../interfaces/cartItem';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root',
})
export class CartService {
    /* URL and enpoints
    http://localhost:3000/carrello, getAll / post
    http://localhost:3000/carrello/id, patch, delete
    (json-server)

    http://localhost:8080/carrello
    http://localhost:8080/carrello/id
    (Spring boot backend)
    */
    private apiCartURL = 'http://localhost:3000/carrello';
    private apiBackendURL = 'http://localhost:8080/api/v1/carrello';
    private readonly CART_KEY = 'guest_cart';

    constructor(
        private httpClient: HttpClient,
        private authService: AuthService,
    ) {
        this.loadCart();
    }

    private cartItems = new BehaviorSubject<CartItem[]>([]);
    private popupState = new BehaviorSubject<{ isOpen: boolean; data?: any }>({
        isOpen: false,
    }); // Observable to open the popup component, data is not mandatory
    private checkoutState = new BehaviorSubject<boolean>(false);

    cart$ = this.cartItems.asObservable();
    popupState$ = this.popupState.asObservable(); // To transfer the selected item from ProductDetailsComponent to CartPopupComponent
    subtotal$ = this.cart$.pipe(
        map((items) =>
            items.reduce((acc, item) => acc + item.prezzo * item.quantita, 0),
        ),
    ); // this one uses the cartItems channel to make this operation
    checkoutState$ = this.checkoutState.asObservable();

    //To open the popup
    openPopup(product: ProductData) {
        this.addItemToCart(product); // to store the selected product

        // In order to add the new value that it will be shown for the listeners
        this.popupState.next({
            isOpen: true,
            data: product,
        }); // For the new selected product and to open the popup
    }

    // Method used to close the popup (from the "X" of the popup or from the click in the blur)
    closePopup() {
        this.popupState.next({ isOpen: false }); // To close the popup
    }

    setCheckoutState(state: boolean) {
        this.checkoutState.next(state);
    }

    // REST API methods
    getAllItems(): Observable<CartItem[]> {
        return this.httpClient.get<CartItem[]>(`${this.apiBackendURL}`);
    }

    // Add new item rest api
    addNewItem(item: CartItem): Observable<CartItem> {
        return this.httpClient.post<CartItem>(`${this.apiBackendURL}`, item);
    }

    // Update Cart item quantity rest api
    updateItemQuantity(itemId: string, quantita: number): Observable<CartItem> {
        return this.httpClient.patch<CartItem>(
            `${this.apiBackendURL}/${itemId}`,
            {
                quantita,
            },
        );
    }

    // Delete cart item rest api
    deleteItem(itemId: string): Observable<Object> {
        return this.httpClient.delete(`${this.apiBackendURL}/${itemId}`);
    }

    // Method used to add a new item of add + 1 in the quantity of the selected item
    addItemToCart(product: ProductData) {
        const currentItems = this.cartItems.value;
        const id = `${product.scarpa_id}-${product.colore.toLocaleLowerCase()}-${product.taglia}`;
        const itemIndex = currentItems.findIndex((item) => item.id === id);

        if (itemIndex > -1) {
            const updatedItems = [...currentItems];

            updatedItems[itemIndex] = {
                ...updatedItems[itemIndex],
                quantita: updatedItems[itemIndex].quantita + 1,
            };

            if (this.authService.isLoggedIn()) {
                this.updateItemQuantity(
                    id,
                    updatedItems[itemIndex].quantita,
                ).subscribe({
                    next: () => this.cartItems.next(updatedItems),
                    error: (err) =>
                        console.log(
                            "Errore nell'aggiornamento dell'item:",
                            err,
                        ),
                });
            } else {
                this.cartItems.next(updatedItems);
                this.saveGuestCart(updatedItems);
            }

            return;
        } else {
            const newItem: CartItem = { id, ...product, quantita: 1 };
            if (this.authService.isLoggedIn()) {
                this.addNewItem(newItem).subscribe({
                    next: () => this.cartItems.next([...currentItems, newItem]),
                    error: (err) =>
                        console.log(
                            'Errore nel caricamento del nuovo item:',
                            err,
                        ),
                });
            } else {
                const updatedItems = [...currentItems, newItem];

                this.cartItems.next(updatedItems);
                this.saveGuestCart(updatedItems);
            }
        }
    }

    // Method used to remove the quantity of the selected item by 1
    removeItemFromCart(cartItem: CartItem) {
        const currentItems = this.cartItems.value;
        const itemIndex = currentItems.findIndex(
            (item) => item.id === cartItem.id,
        );

        if (itemIndex === -1) return;

        const item = currentItems[itemIndex]; // Selected item

        if (item.quantita > 1) {
            const updatedItems = [...currentItems];
            updatedItems[itemIndex] = {
                ...item,
                quantita: item.quantita - 1,
            };

            if (this.authService.isLoggedIn()) {
                this.updateItemQuantity(
                    item.id,
                    updatedItems[itemIndex].quantita,
                ).subscribe({
                    next: () => this.cartItems.next(updatedItems),
                    error: (err) =>
                        console.log(
                            "Errore nell'aggiornamento dell'item:",
                            err,
                        ),
                });
            } else {
                this.cartItems.next(updatedItems);
                this.saveGuestCart(updatedItems);
            }
        } else {
            // if quantity = 1
            this.deleteItemFromCart(cartItem);
        }
    }

    // Method used to delete the selected item (quantity = 1)
    deleteItemFromCart(cartItem: CartItem) {
        const updatedItems = this.cartItems.value.filter(
            (item) => item.id !== cartItem.id,
        );

        if (this.authService.isLoggedIn()) {
            this.deleteItem(cartItem.id).subscribe({
                next: () => this.cartItems.next(updatedItems),
                error: (err) =>
                    console.log("Errore nell'eliminazione dell'item:", err),
            });
        } else {
            this.cartItems.next(updatedItems);
            this.saveGuestCart(updatedItems);
        }
    }

    // Method to emty the cart
    emptyCart() {
        const items = this.cartItems.value;
        if (!this.authService.isLoggedIn()) {
            this.cartItems.next([]);
            localStorage.removeItem(this.CART_KEY);
            return;
        }
        this.cartItems.next([]);

        // ForEach loop to delete every cart item
        items.forEach((item) => {
            this.deleteItem(item.id).subscribe();
        });
    }

    mergeGuestCart() {
        this.getAllItems().subscribe({
            next: (items) => this.cartItems.next(items),
        });

        const userItems = this.cartItems.value;
        const guestItems: CartItem[] = JSON.parse(
            localStorage.getItem(this.CART_KEY) ?? '[]',
        );
        // const guestItems: CartItem[] =  JSON.parse(guestCart);

        console.log('guestItems: ', guestItems);
        console.log('userItems: ', userItems);

        this.getAllItems().subscribe({
            next: (userItems: CartItem[]) => {
                const requests: Observable<CartItem>[] = [];

                for (const guestItem of guestItems) {
                    const existingItem = userItems.find(
                        (userItem) => userItem.id === guestItem.id,
                    );

                    if (existingItem) {
                        const newQuantity =
                            existingItem.quantita + guestItem.quantita;

                        requests.push(
                            this.updateItemQuantity(
                                existingItem.id,
                                newQuantity,
                            ),
                        );
                    } else {
                        requests.push(this.addNewItem(guestItem));
                    }
                }

                if (requests.length === 0) {
                    localStorage.removeItem('guest_cart');
                    this.loadCart();
                    return;
                }

                forkJoin(requests).subscribe({
                    next: () => {
                        localStorage.removeItem('guest_cart');
                        this.loadCart();
                    },
                    error: (error) => {
                        console.error(
                            'Errore durante il merge del carrello:',
                            error,
                        );
                    },
                });
            },
            error: (error) => {
                console.error(
                    'Errore nel recupero del carrello utente:',
                    error,
                );
            },
        });

        // for (let i = 0; i < currentItems.length; i++) {
        //     if (currentItems[i].id === userItems[i].id)
        //         userItems[i].quantita += currentItems[i].quantita;
        // }

        localStorage.removeItem('guest_cart');
        this.cartItems.next([]);
    }

    // Method used to load cart data from the json file
    private loadCart() {
        if (this.authService.isLoggedIn()) {
            this.getAllItems().subscribe({
                next: (items) => this.cartItems.next(items),
                error: (err) => {
                    console.error('Errore nel caricamento del cart:', err);
                    this.cartItems.next([]);
                },
            });

            return;
        }

        const guestCart = localStorage.getItem(this.CART_KEY);

        if (!guestCart) {
            this.cartItems.next([]);
            return;
        }

        try {
            const items: CartItem[] = JSON.parse(guestCart);
            this.cartItems.next(items);
        } catch {
            localStorage.removeItem(this.CART_KEY);
            this.cartItems.next([]);
        }
    }

    private saveGuestCart(items: CartItem[]): void {
        localStorage.setItem(this.CART_KEY, JSON.stringify(items));
    }
}
