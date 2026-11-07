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
            );
        });

        this.cartService.checkoutState$.subscribe((state) => {
            this.isCheckoutActive = state;
            console.log('isCheckoutActive da header:', this.isCheckoutActive);
        });

        this.authService.loggedIn$.subscribe((state) => {
            this.isUserLoggedIn = state;
            // console.log(this.isUserLoggedIn);
            const payload = this.authService.extractPayload();
            if (state && payload) {
                this.username = payload.nome;
            }
        });
    }

    @Output() blurChange = new EventEmitter<boolean>();
    @Output() hnavMenuChange = new EventEmitter<boolean>();

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

    isMenuActive: boolean = false;
    showMenu() {
        this.isMenuActive = true;
        console.log(this.isMenuActive);
        this.onMenuOpen();
        this.hnavMenuChange.emit(true);
    }

    hideMenu() {
        this.isMenuActive = false;
        this.menuVoicesFlag = !this.menuVoicesFlag;
        this.onMenuClose();
        this.hnavMenuChange.emit(false);
    }

    userSection: Sezione = {
        id: 'utente',
        label: 'Il mio account',
        voci: [
            { label: 'Profilo', link: '/shoes' },
            { label: 'Ordini', link: '/shoes' },
            { label: 'Preferiti', link: '/shoes' },
            { label: 'Esperienze', link: '/shoes' },
            { label: 'Impostazioni account', link: '/shoes' },
        ],
    };

    sezioni: Sezione[] = [
        {
            id: 'novita',
            label: 'Novità',
            voci: [
                { label: 'Nuovi arrivi', link: '/shoes' },
                { label: 'Best seller', link: '/shoes' },
            ],
        },
        {
            id: 'uomo',
            label: 'Uomo',
            voci: [
                { label: 'Nuovi arrivi', link: '/shoes' },
                { label: 'Scarpe', link: '/shoes' },
            ],
        },
        {
            id: 'donna',
            label: 'Donna',
            voci: [
                { label: 'Nuovi arrivi', link: '/shoes' },
                { label: 'Scarpe', link: '/shoes' },
            ],
        },
        {
            id: 'kids',
            label: 'Kids',
            voci: [
                { label: 'Nuovi arrivi', link: '/shoes' },
                { label: 'Scarpe', link: '/shoes' },
            ],
        },
        {
            id: 'outlet',
            label: 'Outlet',
            voci: [{ label: 'Scarpe', link: '/shoes' }],
        },
    ];

    menuVoicesFlag: boolean = false;
    currentMenuVoice: Sezione | null = null;
    showMenuVoices(s: Sezione) {
        this.currentMenuVoice = s;
        this.menuVoicesFlag = !this.menuVoicesFlag;
    }

    goBackToMenu() {
        this.menuVoicesFlag = !this.menuVoicesFlag;
        this.isMenuActive = true;
    }

    onBlurClick() {
        this.removeBlurBackground();
    }

    logoutUser() {
        this.authService.logout();
        window.location.reload(); // to simulate refresh
    }
}
interface Sezione {
    id: string;
    label: string;
    voci: { label: string; link: string }[];
}
