import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ProductFilters } from '../interfaces/productFilters';
import { Product } from '../interfaces/product';
import { convertDashToSpace } from '../utils/string-utils';

@Injectable({
    providedIn: 'root',
})
export class ProductService {
    // URL and enpoint
    private apiProductsURL = 'http://localhost:3000/prodotti';

    private apiBackendURL = 'http://localhost:8080/api/v1/scarpeList';

    constructor(private httpClient: HttpClient) {}

    // HTTP method used to get all products from the json file without any query params
    getProducts(): Observable<Product[]> {
        return this.httpClient.get<Product[]>(this.apiBackendURL);
    }

    // Method used in product-details component
    getProductBySlug(slug: string): Observable<Product | undefined> {
        return this.httpClient.get<Product>(`${this.apiBackendURL}/${slug}`);
    }

    // HTTP method used to get the products from the json file based on the query params (category, newProduct, Featured , sortBy --> asc or desc)
    getProductsByFilter(filters: ProductFilters): Observable<any[]> {
        return this.httpClient.get<any[]>(this.apiBackendURL).pipe(
            map((products) => {
                let result = [...products];

                // CATEGORY
                if (filters.category) {
                    const formatted = convertDashToSpace(filters.category);
                    result = result.filter(
                        (p) =>
                            p.categoria.toLowerCase() ===
                            formatted.toLowerCase(),
                    );
                }

                // BRAND (nel nome)
                if (filters.name) {
                    const formatted = filters.name;

                    result = result.filter((p) =>
                        p.nome.toLowerCase().includes(formatted),
                    );
                }
                // sorting options
                if (filters.sortBy) {
                    // By newest product
                    if (filters.sortBy === 'newest') {
                        result.sort((a, b) => {
                            const aNew = a.nuovo_arrivi ? 1 : 0;
                            const bNew = b.nuovo_arrivi ? 1 : 0;
                            return bNew - aNew; // I nuovi vengono prima
                        });
                    }

                    // Ascending price
                    if (filters.sortBy === 'priceAsc') {
                        result.sort((a, b) => a.prezzo - b.prezzo);
                    }

                    // Descending price
                    if (filters.sortBy === 'priceDesc') {
                        result.sort((a, b) => b.prezzo - a.prezzo);
                    }
                }

                return result;
            }),
        );
    }
}
