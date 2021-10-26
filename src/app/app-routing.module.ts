import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {LoginComponent} from "./login/login.component";
import {DeliveriesComponent} from "./deliveries/deliveries.component";
import {DeliveryComponent} from "./deliveries/delivery/delivery.component";
import {DeliveryResolver} from "./deliveries/delivery/delivery-resolver.service";
import {CustomersComponent} from "./customers/customers.component";
import {AddOrderComponent} from "./add-order/add-order.component";
import {RoadComponent} from "./road/road.component";
import {PageNotFoundComponent} from "./page-not-found/page-not-found.component";
import {SettingsComponent} from "./settings/settings.component";

const appRoutes: Routes = [
  {path: 'auth', component: LoginComponent},
  {path: 'deliveries', component: DeliveriesComponent},
  {path: 'delivery', component: DeliveryComponent, resolve: {delivery: DeliveryResolver}},
  {path: 'customers', component: CustomersComponent},
  {path: 'order', component: AddOrderComponent},
  {path: 'road', component: RoadComponent},
  {path: 'settings', component: SettingsComponent},
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
