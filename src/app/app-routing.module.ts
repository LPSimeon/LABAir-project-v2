import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ShoeListComponent } from './shoe-list/shoe-list.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { OrderConfirmationComponent } from './order-confirmation/order-confirmation.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';

const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'home', title: 'Home - LABAir', component: HomeComponent },
    {
        path: 'shoes',
        title: 'Lista scarpe - LABAir',
        component: ShoeListComponent,
    },
    {
        path: 'shoes/:name',
        title: 'Lista scarpe - LABAir',
        component: ShoeListComponent,
    },
    {
        path: 'product/s/:slug/:color',
        component: ProductDetailsComponent,
    },
    { path: 'cart', title: 'Carrello - LABAir', component: CartComponent },
    {
        path: 'checkout',
        title: 'Checkout - LABAir',
        component: CheckoutComponent,
    },
    {
        path: 'checkout/order-confirmed',
        title: 'Ordine confermato - LABAir',
        component: OrderConfirmationComponent,
        data: { hideHeaderFooter: true },
    },
    {
        path: 'login',
        title: 'Accedi - LABAir',
        component: LoginComponent,
        data: { hideHeaderFooter: true },
    },
    {
        path: 'signup',
        title: 'Registrati - LABAir',
        component: SignupComponent,
        data: { hideHeaderFooter: true },
    },
    { path: '**', component: HomeComponent },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {
            scrollPositionRestoration: 'enabled', // In order to automatically reset the scroll everytime you change route
        }),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
