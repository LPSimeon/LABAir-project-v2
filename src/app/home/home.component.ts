import { Component, ViewChildren, QueryList, ElementRef, AfterViewInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../interfaces/product';
import { CartService } from '../services/cart.service';
@Component({
    selector: 'app-home',
    standalone: false,
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})

export class HomeComponent implements AfterViewInit {
    // All references of <ul> with #scrollContainer
    @ViewChildren('scrollContainer') sliderContainers!: QueryList<ElementRef>;

    nClicksSlider: number[] = [7, 5, 3];

    disabledLeft: Map<number, boolean> = new Map();
    disabledRight: Map<number, boolean> = new Map();

    ngAfterViewInit() {
        // Timeout in order to render all three sliders
        setTimeout(() => {
            // Loop for each slider container
            this.sliderContainers.forEach((ref: ElementRef, index: number) => {
                const element = ref.nativeElement;

                element.scrollLeft = 0;
                // Check initial position
                this.checkScrollPosition(index, element);
            });
        }, 100);
    }

    constructor(private productService: ProductService, private cartService: CartService) { }

    // Variable to get all the shoes from the service

    shoeList: Product[] = [];

    ngOnInit() {
        this.productService.getProducts().subscribe(
            {
                next: (data) => {
                    // console.log('Prodotti ricevuti dal servizio:', data);
                    this.shoeList.push(...data);
                    console.log('shoeList popolata:', this.shoeList);
                },
                error: (error) => {
                    console.error('Errore durante il recupero dei prodotti:', error);
                }
            }
        );

        this.cartService.setCheckoutState(false);
    }

    checkScrollPosition(sliderIndex: number, element: HTMLElement) {
        const scrollContentWidth = element.scrollWidth;
        const visibleWidth = element.clientWidth;
        const currentScrollPosition = element.scrollLeft;
        const tolerance = 2; // Aumentiamo la tolleranza a 2px per sicurezza

        // The calculation of the maximum scrollable distance
        const maxScrollPosition = scrollContentWidth - visibleWidth;

        // Check if the content is too small to small or if it's a negative number
        const noScrollNeeded = maxScrollPosition <= tolerance;

        // For the left button (Start)
        // Check if the current scroll position is at the start of the slider and within the tolerance
        const isAtStart = noScrollNeeded || currentScrollPosition <= tolerance;

        // For the right button (End)
        // Check if the current scroll position is at the end of the slider and within the tolerance
        const isAtEnd = noScrollNeeded || currentScrollPosition >= maxScrollPosition - tolerance;

        // These two checks are used to enable/disable the buttons
        // We set the values in the Maps
        this.disabledLeft.set(sliderIndex, isAtStart);
        this.disabledRight.set(sliderIndex, isAtEnd);
    }

    scroll(sliderIndex: number, direction: 'left' | 'right') {
        const sliderRef = this.sliderContainers.get(sliderIndex); // the specific slider from sliderContainers

        // if the reference exists we can scroll
        if (sliderRef) {
            const element = sliderRef.nativeElement;

            // Based on the index we get the number of clicks defined in nClicksSlider
            const totalClicks = this.nClicksSlider[sliderIndex];

            // Maximum scrollable distance
            const scrollableDistance = element.scrollWidth - element.clientWidth;

            // Calculus to determine the scroll step, a fixed amount for each click
            const scrollStep = scrollableDistance / totalClicks;

            // Determine the amount to scroll based on direction
            const amount = direction === 'right' ? scrollStep : -scrollStep;

            // The command to scroll the element
            element.scrollBy({
                left: amount,
                behavior: 'smooth'
            });

            // Extra check after the scroll action with a timeout
            setTimeout(() => {
                this.checkScrollPosition(sliderIndex, element);
            }, 400);
        }
    }
}