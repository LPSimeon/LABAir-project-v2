import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MobileMenuService } from '../services/mobile-menu.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
    selector: 'app-hnav-mobile-menu',
    standalone: false,
    templateUrl: './hnav-mobile-menu.component.html',
    styleUrl: './hnav-mobile-menu.component.scss',
})
export class HnavMobileMenuComponent {
    private destroy$ = new Subject<void>();

    isUserLoggedIn: boolean = false;
    username: string = '';

    logoutUser() {
        this.hideMenu();
        this.authService.logout();
        window.location.reload();
    }

    isMenuActive: boolean = false;
    menuVoicesFlag: boolean = false;
    currentMenuVoice: Sezione | null = null;

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

    constructor(
        public mobileMenu: MobileMenuService,
        private breakpointObserver: BreakpointObserver,
        private authService: AuthService,
    ) {}

    ngOnInit() {
        // se si passa a desktop, chiude il menu
        this.breakpointObserver
            .observe('(min-width: 960px)')
            .pipe(takeUntil(this.destroy$))
            .subscribe((state) => {
                if (state.matches) this.hideMenu();
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

    showMenuVoices(s: Sezione) {
        this.currentMenuVoice = s;
        this.menuVoicesFlag = true;
    }

    goBackToMenu() {
        // non azzero currentMenuVoice: serve finché lo slide è in corso
        this.menuVoicesFlag = false;
    }

    hideMenu() {
        this.mobileMenu.close();
        this.menuVoicesFlag = false;
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}

interface Sezione {
    id: string;
    label: string;
    voci: { label: string; link: string }[];
}
