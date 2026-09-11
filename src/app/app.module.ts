import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ShoeListComponent } from './shoe-list/shoe-list.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { CartPopupComponent } from './cart-popup/cart-popup.component';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { OrderConfirmationComponent } from './order-confirmation/order-confirmation.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { authInterceptor } from './auth.interceptor';

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        FooterComponent,
        HomeComponent,
        ShoeListComponent,
        ProductDetailsComponent,
        CartPopupComponent,
        CartComponent,
        CheckoutComponent,
        OrderConfirmationComponent,
        LoginComponent,
        SignupComponent,
    ],
    imports: [BrowserModule, AppRoutingModule, FormsModule],
    providers: [provideHttpClient(withInterceptors([authInterceptor]))],
    bootstrap: [AppComponent],
})
export class AppModule {}
