import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {LoginComponent} from "./auth/login/login.component";
import {DeliveriesComponent} from "./deliveries/deliveries.component";
import {DeliveryComponent} from "./deliveries/delivery/delivery.component";
import {DeliveryResolver} from "./deliveries/delivery/delivery-resolver.service";
import {CustomersComponent} from "./customers/customers.component";
import {CustomerComponent} from "./customers/customer/customer.component";
import {AddOrderComponent} from "./add-order/add-order.component";
import {RoadComponent} from "./road/road.component";
import {PageNotFoundComponent} from "./page-not-found/page-not-found.component";
import {OrderResolver} from "./add-order/order-resolver.service";
import {SettingsComponent} from "./settings/settings.component";
import {PasswordComponent} from "./settings/password/password.component";
import {ForgetPasswordComponent} from "./auth/forget-password/forget-password.component";
import {NewUserComponent} from "./settings/new-user/new-user.component";
import {ModifyAuthorizationComponent} from "./settings/modify-authorization/modify-authorization.component";

const appRoutes: Routes = [
  {path: 'auth', component: LoginComponent},
  {path: 'auth/forgetPassword', component: ForgetPasswordComponent},
  {path: 'deliveries', component: DeliveriesComponent},
  {path: 'delivery', component: DeliveryComponent, resolve: {delivery: DeliveryResolver}},
  {path: 'customers', component: CustomersComponent},
  {path: 'customer', component: CustomerComponent, resolve: {customer: OrderResolver}},
  {path: 'order', component: AddOrderComponent},
  {path: 'order/edit', component: AddOrderComponent, resolve: {order: OrderResolver}},
  {path: 'order/customer', component: AddOrderComponent, resolve: {order: OrderResolver}},
  {path: 'road', component: RoadComponent},
  {path: 'settings', component: SettingsComponent},
  {path: 'settings/password', component: PasswordComponent},
  {path: 'settings/newUser', component: NewUserComponent},
  {path: 'settings/modifyAuthorization', component: ModifyAuthorizationComponent},
  {path: '', redirectTo: '/deliveries', pathMatch: 'full'},
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
