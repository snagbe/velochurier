import {LOCALE_ID, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {DeliveriesComponent} from './deliveries/deliveries.component';
import {environment} from "../environments/environment";
import {AngularFireModule} from "@angular/fire/compat";
import {AddOrderComponent} from './add-order/add-order.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NavbarComponent} from './navbar/navbar.component';
import {AngularFirestoreModule} from '@angular/fire/compat/firestore';
import {AngularFireStorageModule} from '@angular/fire/compat/storage';
import {AngularFireAuthModule} from '@angular/fire/compat/auth';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {GlobalComponents} from "./global-components";

//Angular Material
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {DateAdapter, MatNativeDateModule, MatOptionModule} from "@angular/material/core";
import {MatInputModule} from "@angular/material/input";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {CustomersComponent} from './customers/customers.component';
import {MatIconModule} from '@angular/material/icon';
import {RoadComponent} from './road/road.component';
import { CustomDateAdapter } from './custom-date-adapters';
import { registerLocaleData } from "@angular/common";
import localeFr from "@angular/common/locales/de";
registerLocaleData(localeFr);

//Google Maps
import {AgmCoreModule} from '@agm/core';
import {AutocompleteComponent} from "./autocomplete/autocomplete.component";

@NgModule({
  declarations: [
    AppComponent,
    DeliveriesComponent,
    AddOrderComponent,
    NavbarComponent,
    CustomersComponent,
    RoadComponent,
    AutocompleteComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,

    // Firebase
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,

    // Material Imports
    MatInputModule,
    MatBottomSheetModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatOptionModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,

    //Google Maps integration
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBCA2oaGS7PBkEV4uelWFKaQV-KdE_3iyw',
      libraries: ['imagery', 'places', 'libraries', 'drawing'],
      //region: 'CH',
      language: 'de'
    })
  ],
  providers: [
    GlobalComponents,
    {provide: DateAdapter, useClass: CustomDateAdapter },
    {provide: LOCALE_ID, useValue: 'de'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
