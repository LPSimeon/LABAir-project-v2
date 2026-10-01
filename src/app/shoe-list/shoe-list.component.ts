import { Component, HostListener } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../interfaces/product';
import { ProductFilters } from '../interfaces/productFilters';
import { ActivatedRoute, Router } from '@angular/router';
import { convertDashToSpace, convertSpaceToDash } from '../utils/string-utils';
@Component({
    selector: 'app-shoe-list',
    standalone: false,
    templateUrl: './shoe-list.component.html',
    styleUrls: ['./shoe-list.component.scss']
})
export class ShoeListComponent {
    constructor(private route: ActivatedRoute, private router: Router, private productService: ProductService) { }

    // List of the products from the service
    productList: Product[] = [];

    currentCategory?: string;
    currentSortBy: 'newest' | 'priceAsc' | 'priceDesc' | null = null;

    defaultColorway: string = "nero";

    searchWord: string = "";
    isSearchWordEmpty: boolean = false;

    ngOnInit() {
        // In order to get the query parameters
        this.route.queryParams.subscribe(params => {

            this.currentCategory = params['category'];
            this.currentSortBy = params['sortBy'];

            this.searchWord = convertDashToSpace(params['name']);

            if (this.searchWord === '' || this.searchWord === undefined)
                this.isSearchWordEmpty = true;
            else
                this.isSearchWordEmpty = false;

            const filters: ProductFilters = {
                name: this.searchWord,
                category: this.currentCategory,
                sortBy: this.currentSortBy!
            };

            if (!filters.name && !filters.category && !filters.sortBy) {
                this.loadAllProducts();
                return;
            }

            // Instead I'll load the ones with the applied filters
            this.loadProductsWithFilters(filters);
        });

        // It initialises every state category to false --> category closed
        this.categories.forEach(cat => {
            this.accordionStates[cat.id] = false;
        });
    }

    // Method used to load all products 
    loadAllProducts() {
        this.productService.getProducts().subscribe({
            next: (data) => {
                console.log('Prodotti ricevuti dal servizio:', data);
                this.productList = data;
            },
            error: (error) => {
                console.error('Errore durante il recupero dei prodotti:', error);
            }
        });
    }

    // Method used to load the products with the filters applied to them
    loadProductsWithFilters(filters: ProductFilters) {
        this.productService.getProductsByFilter(filters).subscribe({
            next: (data) => {
                this.productList = data;
            },
            error: (error) => {
                console.error('Errore durante il recupero dei prodotti filtrati:', error);
            }
        });
    }

    // Flag to check whether the page header is sticky or not
    isHeaderSticky: boolean = false;

    // Flag to check if page header is scrolling up
    isScrollingUp: boolean = false;

    // Page header will be sticky after 100px
    readonly triggerPoint: number = 100;

    // To track previous scroll position
    private previousScrollY: number = 0;

    // @HostListener it monitors the scroll event of the window
    @HostListener('window:scroll')
    onScroll() {
        const currentScrollY = window.scrollY;

        // It updates the flag based on the position every scroll
        this.isHeaderSticky = currentScrollY > this.triggerPoint;

        // Determine if scrolling up or down
        this.isScrollingUp = currentScrollY < this.previousScrollY;

        // Update previous scroll position
        this.previousScrollY = currentScrollY;
    }

    // Every categories
    categories = [
        { id: 'genere', name: 'Genere', content: 'Contenuto ...' },
        { id: 'acquisto', name: 'Acquista per prezzo', content: 'Contenuto ...' },
        { id: 'sconto', name: 'Sconti e offerte', content: 'Contenuto ...' },
        { id: 'discount', name: 'Product Discounts', content: 'Contenuto ...' },
        { id: 'taglia', name: 'Taglia/Misura', content: 'Contenuto ...' },
        { id: 'colore', name: 'Colore', content: 'Contenuto ...' },
        { id: 'altezza', name: 'Altezza scarpa', content: 'Contenuto ...' },
        { id: 'collezione', name: 'Collezioni', content: 'Contenuto ...' },
        { id: 'sport', name: 'Sport', content: 'Contenuto ...' },
        { id: 'brand', name: 'Brand', content: 'Contenuto ...' },
        // ... N altre categorie
    ];

    // Map used to have all the state of each category
    accordionStates: { [key: string]: boolean } = {};

    isArrowUp: boolean = false;

    // Method to open the category
    toggleAccordion(id: string) {
        this.accordionStates[id] = !this.accordionStates[id];
    }


    // Flag used to show the sort options (Ordina per)
    isSortListVisible: boolean = false;

    // Method to open and close the sort list
    toggleSortList() {
        this.isSortListVisible = !this.isSortListVisible;
    }

    isSortOptionApplied: boolean = false;

    chooseSortOption(sortOption: string) {
        if (sortOption === "In evidenza" && this.isSearchWordEmpty) {
            this.router.navigate(['/shoes'], {
                queryParams: { sortBy: null, category: this.currentCategory }
            })
        } else if (sortOption === "In evidenza" && !this.isSearchWordEmpty) {
            this.router.navigate(['/shoes'], {
                queryParams: { name: this.searchWord, sortBy: null, category: this.currentCategory }
            });
        }

        if (sortOption === "newest") {
            this.router.navigate(['/shoes'], {
                queryParams: {
                    sortBy: 'newest'
                },
                queryParamsHandling: 'merge'

            });
        }
        if (sortOption === "priceDesc") {
            this.router.navigate(['/shoes'], {
                queryParams: {
                    sortBy: 'priceDesc'
                },
                queryParamsHandling: 'merge'

            });
        }
        if (sortOption === "priceAsc") {
            this.router.navigate(['/shoes'], {
                queryParams: {
                    sortBy: 'priceAsc'
                },
                queryParamsHandling: 'merge'

            });
        }

        this.isSortListVisible = false;
        this.isSortOptionApplied = true;
    }

    // Flag used to show the left sidebar
    isSidebarVisible: boolean = true;

    // Method to show the sidebar
    hideSidebar() {
        this.isSidebarVisible = !this.isSidebarVisible;
    }

    // Method get the slug with the dashes instead of the spaces
    getProductSlug(name: string): string {
        return convertSpaceToDash(name).toLowerCase();
    }
}
