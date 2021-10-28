import {Component, OnInit, ViewChild} from '@angular/core';
import {AngularFireDatabase} from "@angular/fire/compat/database";
import {FormBuilder, NgForm, Validators} from "@angular/forms";
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
import {pairwise, startWith} from "rxjs/operators";

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

  clientCompany: string;
  clientSurname: string;
  clientName: string;
  clientStreet: string;
  clientZip: number;
  clientCity: string;
  clientMail: string;
  clientPhone: string;
  clientDescription: string;
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
  geocoder: any;
  geoAddress: any;
  currentId: any;
  currentDate: Date;
  getType: any;
  orderType: string;
  currentPicker: Date;
  currentArticle: string;
  pageTitle: string;
  date: Date;

  // Cache fields
  cacheClientCompany: String;
  cacheClientSurname: String;
  cacheClientName: String;

  cacheReceiverCompany: String;
  cacheReceiverSurname: String;
  cacheReceiverName: String;

  cacheCurrentPicker: Date;

  constructor(private db: AngularFireDatabase,
              private globalComp: GlobalComponents,
              private mapsApiLoader: MapsAPILoader,
              private authService: AuthService,
              private router: Router,
              private route: ActivatedRoute,
              private firebaseService: FirebaseService,
              private formBuilder: FormBuilder) {
  }

  /*formGroup = this.formBuilder.group({
    pickupDate: ["", [Validators.required]]
  });*/

  ngOnInit(): void {
    this.authService.doAuthCheck();
    this.pageTitle = "Auftrag erfassen";

    if (this.route.snapshot.routeConfig.path === 'order/edit') {
      this.pageTitle = "Auftrag bearbeiten";


      this.route.data.subscribe(
        (data: Data) => {
          this.currentId = data['order'].id;
          this.currentDate = new Date(data['order'].date);
        }
      );
      this.currentOrderArticle(this.currentDate, 'open', 'article', this.currentId);
      this.currentOrder(this.currentDate, 'open', 'client', this.currentId);
      this.currentOrder(this.currentDate, 'open', 'receiver', this.currentId);
    }

    this.subscription = this.globalComp.addressChange
      .subscribe(() => {
        this.selectedAddress = this.globalComp.getAddress();
        if ('Auftraggeber' === this.selectedAddress[0].type) {
          this.clientCompany = this.selectedAddress[0].company;
          this.cacheClientCompany = this.selectedAddress[0].company;
          this.clientSurname = this.selectedAddress[0].surname;
          this.cacheClientSurname = this.selectedAddress[0].surname;
          this.clientName = this.selectedAddress[0].name;
          this.cacheClientName = this.selectedAddress[0].name;
          this.clientZip = this.selectedAddress[0].zip;
          this.clientCity = this.selectedAddress[0].city;
          this.clientStreet = this.selectedAddress[0].street;
          this.clientMail = this.selectedAddress[0].email;
          this.clientPhone = this.selectedAddress[0].phone;
          this.clientDescription = this.selectedAddress[0].description;
        } else {
          this.receiverCompany = this.selectedAddress[0].company;
          this.cacheReceiverCompany = this.selectedAddress[0].company;
          this.receiverSurname = this.selectedAddress[0].surname;
          this.cacheReceiverSurname = this.selectedAddress[0].surname;
          this.receiverName = this.selectedAddress[0].name;
          this.cacheReceiverName = this.selectedAddress[0].name;
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
        this.cacheCurrentPicker = new Date(this.selectedArticle[0].date);
        this.currentArticle = this.selectedArticle[0].article;
      });
  }


  currentOrderArticle(date, status, type, id) {
    const selectedDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    this.db.database.ref('order/' + status + '/' + selectedDate)
      .on('child_added',
        snap => {
          const key = snap.key;
          const data = snap.val();
          if (data) {
            if (type) {
              if (type === 'article') {
                this.getType = data.article;
                if (key === id) {
                  const article: Article = {date: this.getType.date, article: this.getType.article};
                  this.globalComp.setArticle(article);
                  this.globalComp.orderArticleChange.next();
                }
              }
            }
          }
        });
  }

  currentOrder(date, status, type, id) {
    const selectedDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    this.db.database.ref('order/' + status + '/' + selectedDate)
      .on('child_added',
        snap => {
          const key = snap.key;
          const data = snap.val();
          if (data) {
            if (type) {
              if (type === 'article') {
                this.getType = data.article;
              } else if (type === 'receiver') {
                this.getType = data.receiver;
                this.orderType = 'Empfänger';
              } else if (type === 'client') {
                this.getType = data.client;
                this.orderType = 'Auftraggeber';
              }
              if (key === id) {
                // @ts-ignore
                const address: Address = {
                  type: this.orderType,
                  city: this.getType.city,
                  company: this.getType.company,
                  name: this.getType.name,
                  surname: this.getType.surname,
                  street: this.getType.street,
                  zip: this.getType.zip,
                  email: this.getType.email,
                  phone: this.getType.phone,
                  description: this.getType.description
                };
                this.globalComp.setAddress(address);
                this.globalComp.addressChange.next();
              }
            }
          }
        });
  }

  onSaveAddress(resource: string) {
    let node;
    let nodeTitle;
    if (resource === 'receiver') {
      node = this.receiver;
      nodeTitle = this.cacheReceiverCompany;
      if (!nodeTitle) {
        nodeTitle = this.cacheReceiverName + ' ' + this.cacheReceiverSurname;
      }
    } else if (resource === 'client') {
      node = this.client;
      nodeTitle = this.cacheClientCompany;
      if (!nodeTitle) {
        nodeTitle = this.cacheClientName + ' ' + this.cacheClientSurname;
      }
    }
    this.firebaseService.removeAddress(nodeTitle);
    this.firebaseService.saveAddress(node);
  }

  onSubmit() {
    this.mapsApiLoader.load().then(() => {
      console.log('google script loaded');
      this.geocoder = new google.maps.Geocoder();
      this.getGeocode('receiver');
    });
  }

  getGeocode(type) {
    if (type === 'receiver') {
      this.geoAddress = this.receiver.street + ' ' + this.receiver.zip + ' ' + this.receiver.city;
    } else if (type === 'client') {
      this.geoAddress = this.client.street + ' ' + this.client.zip + ' ' + this.client.city;
    } else {
      this.geoAddress = this.receiver.street + ' ' + this.receiver.zip + ' ' + this.receiver.city;
    }
    type CoordsType = Array<{ lat: number, lng: number }>
    this.geocoder.geocode({'address': this.geoAddress}, (results, status) => {
      if (status === 'OK') {
        const coords: CoordsType = [
          {lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng()}
        ];
        const client = this.client;
        const receiver = this.receiver;

        this.removeOrder(client, receiver);
        this.saveOrder(coords, client, receiver);
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
  }

  removeOrder(client, receiver) {
    let nodeTitle;
    nodeTitle = this.cacheReceiverCompany;
    if (!nodeTitle) {
      nodeTitle = this.cacheReceiverName + ' ' + this.cacheReceiverSurname;
    }
    const orderDate = this.cacheCurrentPicker.getFullYear() + '-' + (this.cacheCurrentPicker.getMonth() + 1) + '-' + this.cacheCurrentPicker.getDate();

    this.db.object('order/open/' + orderDate + '/' + nodeTitle).remove();
  }

  saveOrder(coords, client, receiver) {
    let nodeTitle = receiver.company;
    if (!nodeTitle) {
      nodeTitle = receiver.name + ' ' + receiver.surname;
    }

    const orderDate = this.currentPicker.getFullYear() + '-' + (this.currentPicker.getMonth() + 1) + '-' + this.currentPicker.getDate();
    // TODO prüfen ob der Empfänger schon eine Lieferung an diesem Tag hat. Dann nur ergänzen und nicht überschreiben
    var rootRef = this.db.list('order/open/' + orderDate);
    rootRef.set(nodeTitle + '/client', {
      "company": client.company,
      "surname": client.surname,
      "name": client.name,
      "street": client.street,
      "zip": client.zip,
      "city": client.city,
      "email": client.mail,
      "phone": client.phone,
      "description": client.description
    })

    rootRef.set(nodeTitle + '/receiver', {
      "company": receiver.company,
      "surname": receiver.surname,
      "name": receiver.name,
      "street": receiver.street,
      "zip": receiver.zip,
      "city": receiver.city,
      "email": receiver.mail,
      "phone": receiver.phone,
      "description": receiver.description,
      "lat": coords[0].lat,
      "lng": coords[0].lng
    })


    const selectedDate = this.orderForm.value.pickupDate.getFullYear() + '-' + (this.orderForm.value.pickupDate.getMonth() + 1) + '-' + this.orderForm.value.pickupDate.getDate();
    let article = "";
    if (this.orderForm.value.article) {
      article = this.orderForm.value.article;
    }
    rootRef.set(nodeTitle + '/article', {
      "date": selectedDate,
      "article": article
    })

    // TODO nur bei success löschen und info einblenden sonst info einblenden
    this.client.onReset();
    this.autoClient.onReset();
    this.receiver.onReset();
    this.autoReceiver.onReset();
    this.orderForm.reset();
    this.formDirective.resetForm();
  }

  getErrorMessage(inputField) {
    return inputField.hasError('required') ?
      'Dieses Feld muss ausgefüllt werden' : '';
  }

  testFunc() {
    this.client.onReset();
    this.autoClient.onReset();
    this.receiver.onReset();
    this.autoReceiver.onReset();
    this.orderForm.reset();
    this.formDirective.resetForm();
  }
}
