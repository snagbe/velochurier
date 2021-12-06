import {LOCALE_ID, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {DeliveriesComponent} from './deliveries/deliveries.component';
import {environment} from "../environments/environment";
import {AngularFireModule} from "@angular/fire/compat";
import {AngularFireAnalyticsModule} from "@angular/fire/compat/analytics";
import {AddOrderComponent} from './add-order/add-order.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NavbarComponent} from './navbar/navbar.component';
import {AngularFirestoreModule} from '@angular/fire/compat/firestore';
import {AngularFireStorageModule} from '@angular/fire/compat/storage';
import {AngularFireAuthModule} from '@angular/fire/compat/auth';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {GlobalComponents} from "./global-components";
import {DeliveryComponent} from "./deliveries/delivery/delivery.component";
import {DialogComponent} from './overlay/dialog/dialog.component';
import {AddressComponent} from './address/address.component';
import {RoadComponent} from './road/road.component';

//Angular Material
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {DateAdapter, MatNativeDateModule, MatOptionModule} from "@angular/material/core";
import {MatInputModule} from "@angular/material/input";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {CustomersComponent} from './customers/customers.component';
import {MatIconModule} from '@angular/material/icon';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {CustomDateAdapter} from './custom-date-adapters';
import {registerLocaleData} from "@angular/common";
import localeFr from "@angular/common/locales/de";

registerLocaleData(localeFr);

//Google Maps
import {AgmCoreModule} from '@agm/core';
import {AutocompleteComponent} from "./autocomplete/autocomplete.component";
import {LoginComponent} from './auth/login/login.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {DeliveryResolver} from "./deliveries/delivery/delivery-resolver.service";
import {AppRoutingModule} from "./app-routing.module";
import {OrderResolver} from "./add-order/order-resolver.service";
import {SettingsComponent} from "./settings/settings.component";
import {PasswordComponent} from "./settings/password/password.component";
import {CustomerComponent} from './customers/customer/customer.component';
import {ForgetPasswordComponent} from './auth/forget-password/forget-password.component';
import {NewUserComponent} from './settings/new-user/new-user.component';
import {MatSelectModule} from "@angular/material/select";
import {ModifyAuthorizationComponent} from './settings/modify-authorization/modify-authorization.component';
import {ProfileComponent} from './settings/profile/profile.component';

@NgModule({
  declarations: [
    AppComponent,
    DeliveriesComponent,
    AddOrderComponent,
    NavbarComponent,
    CustomersComponent,
    RoadComponent,
    AutocompleteComponent,
    DeliveryComponent,
    AddressComponent,
    LoginComponent,
    DialogComponent,
    PageNotFoundComponent,
    SettingsComponent,
    PasswordComponent,
    CustomerComponent,
    PasswordComponent,
    ForgetPasswordComponent,
    NewUserComponent,
    ModifyAuthorizationComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    AppRoutingModule,

    // Firebase
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    AngularFireAnalyticsModule,

    // Material Imports
    MatInputModule,
    MatBottomSheetModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatOptionModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatButtonModule,

    //Google Maps integration
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBCA2oaGS7PBkEV4uelWFKaQV-KdE_3iyw',
      libraries: ['imagery', 'places', 'libraries', 'drawing'],
      //region: 'CH',
      language: 'de'
    }),
    MatSelectModule
  ],

  providers: [
    GlobalComponents,
    DeliveryResolver,
    OrderResolver,
    AutocompleteComponent,
    {provide: MAT_DIALOG_DATA, useValue: {}},
    {provide: MatDialogRef, useValue: {}},
    {provide: DateAdapter, useClass: CustomDateAdapter},
    {provide: LOCALE_ID, useValue: 'de'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
