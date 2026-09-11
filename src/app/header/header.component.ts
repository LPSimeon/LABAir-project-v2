import {
    Component,
    ElementRef,
    EventEmitter,
    Output,
    ViewChild,
} from '@angular/core';
import { CartService } from '../services/cart.service';
import { Router } from '@angular/router';
import { convertSpaceToDash } from '../utils/string-utils';
import { AuthService } from '../services/auth.service';
@Component({
    selector: 'app-header',
    standalone: false,
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
})
export class HeaderComponent {
    constructor(
        private router: Router,
        private authService: AuthService,
        private cartService: CartService,
    ) {}

    nProductCart: number = 0;
    isUserLoggedIn!: boolean;
    isCheckoutActive!: boolean;
    username: string = '';

    ngOnInit() {
        // Removed cartLenght$ in order to calculate the number of items correctly
        this.cartService.cart$.subscribe((items) => {
            this.nProductCart = items.reduce(
                (acc, item) => acc + item.quantita,
                0,
            ); // method reduce in order to get a single value from the array by doing the sum of the quantities
        });

        this.cartService.checkoutState$.subscribe((state) => {
            this.isCheckoutActive = state;
            console.log('isCheckoutActive da header:', this.isCheckoutActive);
        });

        this.authService.loggedIn$.subscribe((state) => {
            this.isUserLoggedIn = state;
            // console.log(this.isUserLoggedIn);

            if (state) {
                this.username = this.authService.getUsername();
            }
        });
    }

    @Output() blurChange = new EventEmitter<boolean>();

    onMenuOpen() {
        this.blurChange.emit(true);
    }

    onMenuClose() {
        this.blurChange.emit(false);
    }

    // variables to apply blur effect on background when hovering over header links
    isBlurActive: boolean = false;
    applyBlurBackground() {
        // this.isBlurActive = true;
        this.onMenuOpen();
    }

    removeBlurBackground() {
        // this.isBlurActive = false;
        this.onMenuClose();
    }

    isSearchBarActive: boolean = false;
    @ViewChild('searchBarInput') searchInputBlock!: ElementRef;
    showSearchBar() {
        this.isSearchBarActive = true;
        // this.isBlurActive = true;
        if (this.isSearchBarActive) {
            // Il setTimeout a 0 serve per aspettare il prossimo ciclo di "disegno" del browser
            setTimeout(() => {
                this.searchInputBlock.nativeElement.focus();
            }, 0);
        }
        this.onMenuOpen();
    }

    hideSearchBar() {
        this.isSearchBarActive = false;
        // this.isBlurActive = false;
        this.onMenuClose();
    }

    searchInputValue: string = '';
    searchItem() {
        if (!this.searchInputValue) {
            return;
        }

        const valueToSearch = convertSpaceToDash(
            this.searchInputValue.trim().toLowerCase(),
        );

        this.router.navigate(['/shoes'], {
            queryParams: { name: valueToSearch },
        });

        this.searchInputValue = '';

        this.hideSearchBar();
    }

    isDeleteButtonVisible: boolean = false;
    showDeleteButton() {
        this.isDeleteButtonVisible = true;
    }

    deleteInputValue() {
        this.searchInputValue = '';
        this.isDeleteButtonVisible = false;
    }

    onBlurClick() {
        this.removeBlurBackground();
    }

    logoutUser() {
        this.authService.logout();
        window.location.reload(); // to simulate refresh
    }
}
