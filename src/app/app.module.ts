import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {DeliveriesComponent} from './deliveries/deliveries.component';
import {environment} from "../environments/environment";
import {AngularFireModule} from "@angular/fire/compat";
import {AddOrderComponent} from './add-order/add-order.component';
import {FormsModule} from "@angular/forms";
import {NavbarComponent} from './navbar/navbar.component';
import {AngularFirestoreModule} from '@angular/fire/compat/firestore';
import {AngularFireStorageModule} from '@angular/fire/compat/storage';
import {AngularFireAuthModule} from '@angular/fire/compat/auth';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//Angular Material
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';

@NgModule({
  declarations: [
    AppComponent,
    DeliveriesComponent,
    AddOrderComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    FormsModule,

    BrowserAnimationsModule,
    MatBottomSheetModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
