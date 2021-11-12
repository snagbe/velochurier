import {Component, OnInit, ViewChild} from '@angular/core';
import {AngularFireDatabase} from "@angular/fire/compat/database";
import {NgForm} from "@angular/forms";
import {GlobalComponents} from "../global-components";
import {Subscription} from "rxjs";
import {Address} from "../address/addresses";
import {AddressComponent} from "../address/address.component";
import {AutocompleteComponent} from "../autocomplete/autocomplete.component";
import {MapsAPILoader} from "@agm/core";
import {AuthService} from "../auth/auth.service";
import {ActivatedRoute, Data, Router} from "@angular/router";
import {Article} from "./article";
import {FirebaseService} from "../firebase/firebase.service";
import {DialogData, OverlayService} from "../overlay/overlay.service";

@Component({
  selector: 'app-add-order',
  templateUrl: './add-order.component.html',
  styleUrls: ['./add-order.component.css']
})
export class AddOrderComponent implements OnInit {
  @ViewChild('orderForm', {static: false}) orderForm: NgForm;
  @ViewChild('formDirective', {static: false}) formDirective: NgForm;
  @ViewChild('client') client: AddressComponent;
  @ViewChild('autoClient') autoClient: AutocompleteComponent;
  @ViewChild('receiver') receiver: AddressComponent;
  @ViewChild('autoReceiver') autoReceiver: AutocompleteComponent;

  clientId: string;
  receiverId: string;
  subscription: Subscription;
  selectedAddress: Address[];
  selectedArticle: Article[];
  currentDate: Date;
  currentPicker: Date;
  currentArticle: string;
  pageTitle: string;
  date: Date;
  orderId: string;
  coords: { lat: number, lng: number };

  constructor(private db: AngularFireDatabase,
              private globalComp: GlobalComponents,
              private mapsApiLoader: MapsAPILoader,
              private authService: AuthService,
              private router: Router,
              private route: ActivatedRoute,
              private firebaseService: FirebaseService,
              private overlay: OverlayService) {
  }

  ngOnInit(): void {
    this.authService.doAuthCheck();
    this.pageTitle = "Auftrag erfassen";

    if ('order/edit' === this.route.snapshot.routeConfig.path) {
      this.pageTitle = "Auftrag bearbeiten";

      this.route.data.subscribe(
        (data: Data) => {
          this.orderId = data['order'].orderId;
        }
      );

      this.prefillOrder();
    }

    this.subscription = this.globalComp.addressChange
      .subscribe(() => {
        this.selectedAddress = this.globalComp.getAddress();
        if ('Auftraggeber' === this.selectedAddress[0].type) {
          this.clientId = this.selectedAddress[0].id;
          this.client.formGroup.controls.company.setValue(this.selectedAddress[0].company);
          this.client.formGroup.controls.surname.setValue(this.selectedAddress[0].surname);
          this.client.formGroup.controls.name.setValue(this.selectedAddress[0].name);
          this.client.formGroup.controls.zip.setValue(this.selectedAddress[0].zip);
          this.client.formGroup.controls.city.setValue(this.selectedAddress[0].city);
          this.client.formGroup.controls.street.setValue(this.selectedAddress[0].street);
          this.client.formGroup.controls.email.setValue(this.selectedAddress[0].email);
          this.client.formGroup.controls.phone.setValue(this.selectedAddress[0].phone);
          this.client.formGroup.controls.description.setValue(this.selectedAddress[0].description);
        } else {
          this.receiverId = this.selectedAddress[0].id;
          this.receiver.formGroup.controls.company.setValue(this.selectedAddress[0].company);
          this.receiver.formGroup.controls.surname.setValue(this.selectedAddress[0].surname);
          this.receiver.formGroup.controls.name.setValue(this.selectedAddress[0].name);
          this.receiver.formGroup.controls.zip.setValue(this.selectedAddress[0].zip);
          this.receiver.formGroup.controls.city.setValue(this.selectedAddress[0].city);
          this.receiver.formGroup.controls.street.setValue(this.selectedAddress[0].street);
          this.receiver.formGroup.controls.email.setValue(this.selectedAddress[0].email);
          this.receiver.formGroup.controls.phone.setValue(this.selectedAddress[0].phone);
          this.receiver.formGroup.controls.description.setValue(this.selectedAddress[0].description);
        }
      })

    this.subscription = this.globalComp.orderArticleChange
      .subscribe(() => {
        this.selectedArticle = this.globalComp.getArticle();
        this.currentPicker = new Date(this.selectedArticle[0].date);
        this.currentArticle = this.selectedArticle[0].article;
      });
  }

  prefillOrder() {
    let orderId = this.orderId;
    this.db.database.ref('order/open').on('child_added',
      snap => {
        if (snap.hasChild(orderId)) {
          const data = snap.val();
          this.globalComp.setArticle(data[orderId]);
          this.globalComp.orderArticleChange.next();
          data[orderId].client.type = 'Auftraggeber';
          this.globalComp.setAddress(data[orderId].client);
          this.globalComp.addressChange.next();
          this.globalComp.setAddress(data[orderId].receiver);
          this.globalComp.addressChange.next();
        }
      });
  }

  async onSaveAddress(resource: string) {
    let node;
    let id;

    if (resource === 'receiver') {
      node = this.receiver.formGroup.value;
      id = this.receiverId;
    } else if (resource === 'client') {
      node = this.client.formGroup.value;
      id = this.clientId;
    }

    this.firebaseService.removeAddress(id)
    id = await this.firebaseService.saveAddress(node);
    if (resource === 'receiver') {
      this.receiverId = id;
    } else if (resource === 'client') {
      this.clientId = id;
    }
  }

  onSubmit() {
    this.mapsApiLoader.load().then(() => {
      this.getGeocode().then(place => {
        this.coords = {lat: place.geometry.location.lat(), lng: place.geometry.location.lng()}
        if ('order/edit' === this.route.snapshot.routeConfig.path) {
          this.removeOrder();
        }
        this.saveOrder();
      })
        .catch(err => {
          console.log(err);
        });
    });


  }

  getGeocode(): Promise<any> {
    const geocoder = new google.maps.Geocoder();
    const receiver = this.receiver.formGroup.controls;
    const address = receiver.street.value + ' ' + receiver.zip.value + ' ' + receiver.city.value;
    return new Promise((resolve, reject) => {
      geocoder.geocode(
        {
          address: address
        },
        (results, status) => {
          if (status === google.maps.GeocoderStatus.OK) {
            resolve(results[0]);
          } else {
            reject(new Error(status));
            alert('Geocode was not successful for the following reason: ' + status);
          }
        }
      );
    });
  }

  removeOrder() {
    let orderDate;
    const orderId = this.orderId;
    this.db.database.ref('order/open').on('child_added',
      snap => {
        const key = snap.key;
        if (snap.hasChild(orderId)) {
          const data = snap.val();
          orderDate = data[orderId].date;
        }
      });

    this.db.object('order/open/' + orderDate + '/' + orderId).remove();
  }

  saveOrder() {
    const client = this.client.formGroup.value;
    const receiver = this.receiver.formGroup.value;
    const orderDate = this.currentPicker.getFullYear() + '-' + (this.currentPicker.getMonth() + 1) + '-' + this.currentPicker.getDate();

    const selectedDate = this.orderForm.value.pickupDate.getFullYear() + '-' + (this.orderForm.value.pickupDate.getMonth() + 1) + '-' + this.orderForm.value.pickupDate.getDate();
    let article = "";
    if (this.orderForm.value.article) {
      article = this.orderForm.value.article;
    }
    let clientDisplayName;
    if (client.company) {
      clientDisplayName = client.company;
    } else {
      clientDisplayName = client.name + ' ' + client.surname;
    }

    let receiverDisplayName;
    if (receiver.company) {
      receiverDisplayName = receiver.company;
    } else {
      receiverDisplayName = receiver.name + ' ' + receiver.surname;
    }

    const orderData = {
      "date": selectedDate,
      "article": article,
      "client": {
        "company": client.company,
        "displayName": clientDisplayName,
        "surname": client.surname,
        "name": client.name,
        "street": client.street,
        "zip": client.zip,
        "city": client.city,
        "email": client.email,
        "phone": client.phone,
        "description": client.description
      },
      "receiver": {
        "company": receiver.company,
        "displayName": receiverDisplayName,
        "surname": receiver.surname,
        "name": receiver.name,
        "street": receiver.street,
        "zip": receiver.zip,
        "city": receiver.city,
        "email": receiver.email,
        "phone": receiver.phone,
        "description": receiver.description,
        "lat": this.coords.lat,
        "lng": this.coords.lng
      }
    }
    let data: DialogData;
    let orderType = "erfasst"
    if ('order/edit' === this.route.snapshot.routeConfig.path) {
      orderType = "bearbeitet";
    }
    this.db.list('order/open/' + orderDate).push(orderData)
      .then(() => {
        data = {
          title: 'Auftrag ' + orderType,
          message: 'Der Auftrag wurde erfolgreich ' + orderType + '.',
          type: 'success',
          timeout: 3000,
          primaryButton: {name: 'Ok'}
        }
        if ('order/edit' === this.route.snapshot.routeConfig.path) {
          this.router.navigate(['/order']);
        } else {
          this.client.onReset();
          this.autoClient.onReset();
          this.receiver.onReset();
          this.autoReceiver.onReset();
          this.orderForm.reset();
          this.formDirective.resetForm();
        }
        this.overlay.openDialog(data);
      }).catch((error) => {
      data = {
        title: 'Fehler',
        message: 'Der Auftrag konnte nicht ' + orderType + ' werden.',
        type: 'error',
        primaryButton: {name: 'Ok'}
      }
      this.overlay.openDialog(data);
    });
  }

  getErrorMessage(inputField) {
    return inputField.hasError('required') ?
      'Dieses Feld muss ausgefüllt werden' : '';
  }
}
