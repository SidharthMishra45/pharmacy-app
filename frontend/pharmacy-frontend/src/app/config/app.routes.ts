import { Routes } from '@angular/router';
import { HomeComponent } from '../pages/home/home.component';
import { CartComponent } from '../pages/cart/cart.component';
import { LoginComponent } from '../pages/auth/login/login.component';
import { SignupComponent } from '../pages/auth/signup/signup.component';
import { PaymentComponent } from '../pages/payment/payment.component';
import { OrdersComponent } from '../pages/orders/orders.component';
import { AdminComponent } from '../pages/admin/admin.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'cart', component: CartComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'payment', component: PaymentComponent },
  { path: 'orders', component: OrdersComponent },
  { path: 'admin', component: AdminComponent },
];
