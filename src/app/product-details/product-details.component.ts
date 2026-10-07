import { Component, HostListener } from '@angular/core';
import { ProductService } from '../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../interfaces/product';
import { ProductData } from '../interfaces/productData';
import { CartService } from '../services/cart.service';
import {
    capitalizeFirstLetter,
    convertDashToSpace,
    convertSpaceToDash,
} from '../utils/string-utils';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-product-details',
    standalone: false,
    templateUrl: './product-details.component.html',
    styleUrl: './product-details.component.scss',
})
export class ProductDetailsComponent {
    constructor(
        private title: Title,
        private route: ActivatedRoute,
        private productService: ProductService,
        private cartService: CartService,
    ) {}

    selectedProduct?: Product;
    selectedColorway: string = ''; // From the colorParam in the Url
    selectedCwImgs: string[] = [];
    selectedIndex: number = 0;
    selectedShoeSize: string | null = null;
    defaultColorway: string = 'nero';
    shoeSlug: string = '';

    currentDisplayImage: string = '';

    isAlertVisible: boolean = false;

    ngOnInit() {
        this.route.paramMap.subscribe((params) => {
            const nameParam = params.get('slug');
            const colorParam = params.get('color');

            console.log('slug: ' + nameParam + ' color: ' + colorParam);

            if (nameParam) {
                this.shoeSlug = convertDashToSpace(nameParam)
                    .split(' ')
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');

                this.productService.getProductBySlug(nameParam).subscribe({
                    next: (product) => {
                        this.selectedProduct = product;
                        // console.log(this.selectedProduct);
                        this.selectedColorway =
                            colorParam || this.defaultColorway;

                        this.selectedCwImgs = this.selectedProduct
                            ?.immagini_scarpa[
                            this.selectedProduct.colori_disponibili.indexOf(
                                this.selectedColorway,
                            )
                        ].urls as string[]; // We use indexOf of colori_disponibili to assign the images of the selected colorway

                        this.currentDisplayImage = this.selectedCwImgs[0];

                        this.title.setTitle(
                            `Scarpa da ${this.selectedProduct?.categoria} ${this.shoeSlug} - LABAir`,
                        );
                    },
                });
            }
        });
    }

    isImageGallerySticky: boolean = false;
    readonly triggerPoint: number = 100;

    // To make the image gallery sticky when we scroll down
    @HostListener('window:scroll')
    onScroll() {
        this.isImageGallerySticky = window.scrollY > this.triggerPoint;
    }

    selectThumbnailImage(nuovoSrc: string, x: number) {
        if (this.currentDisplayImage === nuovoSrc) return;
        this.currentDisplayImage = nuovoSrc;
        this.selectedIndex = x;
    }

    // Methods used for the thumbnail slider
    goToNextImg() {
        this.selectedIndex++;
        if (this.selectedIndex > this.selectedCwImgs.length - 1) {
            this.selectedIndex = 0;
        }

        this.currentDisplayImage = this.selectedCwImgs[this.selectedIndex];
    }

    goToPreviousImg() {
        this.selectedIndex--;
        if (this.selectedIndex < 0) {
            this.selectedIndex = this.selectedCwImgs.length - 1;
        }

        this.currentDisplayImage = this.selectedCwImgs[this.selectedIndex];
    }

    addProductToCart() {
        console.log(
            'Colore selezionato: ' +
                capitalizeFirstLetter(this.selectedColorway),
        );

        if (!this.selectedProduct || !this.selectedShoeSize) {
            this.isAlertVisible = true;
            console.log('Errore: Nessuna taglia selezionata');
            return;
        }

        this.isAlertVisible = false;
        // console.log("Prodotto aggiunto! Taglia:", this.selectedShoeSize);

        // Mettere sistema che mette le immagini della scarpa in base al colore per bene
        // It goes to popup-cart component
        const infoProdotto: ProductData = {
            scarpa_id: this.selectedProduct.id,
            nome: this.selectedProduct.nome,
            colore: capitalizeFirstLetter(this.selectedColorway),
            prezzo: this.selectedProduct.prezzo,
            taglia: this.selectedShoeSize,
            img_scarpa_cover: this.selectedCwImgs[0],
        };

        console.log('infoProdotto: ', infoProdotto);

        this.cartService.openPopup(infoProdotto);
    }

    getProductSlug(name: string): string {
        return convertSpaceToDash(name).toLowerCase();
    }

    ngOnDestroy() {
        this.isAlertVisible = false;
    }
}
