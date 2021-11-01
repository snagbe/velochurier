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
import {DialogData, OverlayComponent} from "../overlay/overlay.component";

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
  clientCompany: string;
  clientSurname: string;
  clientName: string;
  clientStreet: string;
  clientZip: number;
  clientCity: string;
  clientMail: string;
  clientPhone: string;
  clientDescription: string;
  receiverId: string;
  receiverCompany: string;
  receiverSurname: string;
  receiverName: string;
  receiverStreet: string;
  receiverZip: number;
  receiverCity: string;
  receiverMail: string;
  receiverPhone: string;
  receiverDescription: string;
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
              private overlay: OverlayComponent) {
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
          this.clientCompany = this.selectedAddress[0].company;
          this.clientSurname = this.selectedAddress[0].surname;
          this.clientName = this.selectedAddress[0].name;
          this.clientZip = this.selectedAddress[0].zip;
          this.clientCity = this.selectedAddress[0].city;
          this.clientStreet = this.selectedAddress[0].street;
          this.clientMail = this.selectedAddress[0].email;
          this.clientPhone = this.selectedAddress[0].phone;
          this.clientDescription = this.selectedAddress[0].description;
        } else {
          this.receiverId = this.selectedAddress[0].id;
          this.receiverCompany = this.selectedAddress[0].company;
          this.receiverSurname = this.selectedAddress[0].surname;
          this.receiverName = this.selectedAddress[0].name;
          this.receiverZip = this.selectedAddress[0].zip;
          this.receiverCity = this.selectedAddress[0].city;
          this.receiverStreet = this.selectedAddress[0].street;
          this.receiverMail = this.selectedAddress[0].email;
          this.receiverPhone = this.selectedAddress[0].phone;
          this.receiverDescription = this.selectedAddress[0].description;
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

  onSaveAddress(resource: string) {
    let node;
    let id;
    if (resource === 'receiver') {
      node = this.receiver;
      if(this.receiver.zip) {
        node = this.receiver;
      }else {
        node = this.receiver.formGroup.value;
      }
      id = this.receiverId;
    } else if (resource === 'client') {
      //Todo: Bei prefill sind die Daten unter "this.client" bei der Neuerfassung sind sie unter "this.client.formGroup.value" zu finden
      if(this.client.zip) {
        node = this.client;
      }else {
        node = this.client.formGroup.value;
      }
      id = this.clientId
    }

    this.firebaseService.removeAddress(id)
    this.firebaseService.saveAddress(node);
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
    const address = this.receiver.street + ' ' + this.receiver.zip + ' ' + this.receiver.city;
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
    const client = this.client;
    const receiver = this.receiver;
    const orderDate = this.currentPicker.getFullYear() + '-' + (this.currentPicker.getMonth() + 1) + '-' + this.currentPicker.getDate();

    const selectedDate = this.orderForm.value.pickupDate.getFullYear() + '-' + (this.orderForm.value.pickupDate.getMonth() + 1) + '-' + this.orderForm.value.pickupDate.getDate();
    let article = "";
    if (this.orderForm.value.article) {
      article = this.orderForm.value.article;
    }
    const orderData = {
      "date": selectedDate,
      "article": article,
      "client": {
        "company": client.company,
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
          type: 'success'
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
        type: 'error'
      }
      this.overlay.openDialog(data);
    });
  }

  getErrorMessage(inputField) {
    return inputField.hasError('required') ?
      'Dieses Feld muss ausgefüllt werden' : '';
  }
}
