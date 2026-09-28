import { Component, DestroyRef, HostListener, Renderer2 } from '@angular/core';
import { CartService } from './services/cart.service';
import { UserService } from './services/user.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    standalone: false,
    styleUrl: './app.component.scss',
})
export class AppComponent {
    constructor(
        private userService: UserService,
        private cartService: CartService,
        private renderer: Renderer2,
        private destroyRef: DestroyRef,
    ) {}

    title = 'lab-air-prova-2';

    blurFlag1: boolean = false;
    blurFlag2: boolean = false;

    checkoutFlag: boolean = false;
    authFlag: boolean = false;
    /* When the user scrolls down, hide the navbar. When the user scrolls up, show the navbar */
    private mainScrollPos = window.pageYOffset;
    isHeaderVisible = true;
    isAtTop = true; // Flag used to remove the mini-header when we're scrolling up

    @HostListener('window:scroll')
    onScroll() {
        if (this.blurFlag1 || this.blurFlag2) return; // if any blur is applied, don't do anything

        const currentScrollPos = window.pageYOffset; // The current scroll position

        // Check if we're at the top of the page
        if (currentScrollPos <= 5) {
            // console.log(currentScrollPos);
            this.isHeaderVisible = true;
            this.isAtTop = true;
        } else if (this.mainScrollPos > currentScrollPos) {
            this.isHeaderVisible = true;
            this.isAtTop = false;

            // Check if we're scrolling up
        } else {
            this.isHeaderVisible = false;
            this.isAtTop = false;
        } // Check if we're scrolling down

        this.mainScrollPos = currentScrollPos; // In the end we update the value of mainScrollPos with currentScrollPos
    }

    ngOnInit() {
        this.cartService.checkoutState$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((state) => {
                this.checkoutFlag = state;
            });

        this.userService.hfState$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((state) => {
                this.authFlag = state;
            });

        // In order to activate the blur
        this.cartService.popupState$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((state) => {
                this.blurFlag2 = state.isOpen;

                if (this.blurFlag2) {
                    // window.scrollTo(0, 0);
                    window.scrollTo({
                        top: 0,
                        left: 0,
                        behavior: 'auto',
                    });
                    // In order to stop the scroll
                    this.renderer.addClass(document.body, 'no-scroll');
                } else {
                    // to remove the class of the body
                    this.renderer.removeClass(document.body, 'no-scroll');
                }
            });
    }

    // Method to receive the response of the header (hover)
    onBlurChange(isInteracting: boolean) {
        this.blurFlag1 = isInteracting;

        // If the user starts interacting, we force the appearance of the header
        if (isInteracting) {
            this.isHeaderVisible = true;
        }
    }

    // Method used when we want to close the popup by clicking the blur
    onBlurClick() {
        this.cartService.closePopup();
    }
}
