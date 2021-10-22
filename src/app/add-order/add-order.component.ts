import {Component, OnInit, ViewChild} from '@angular/core';
import {AngularFireDatabase} from "@angular/fire/compat/database";
import {NgForm} from "@angular/forms";
import {GlobalComponents} from "../global-components";
import {Subscription} from "rxjs";
import {Address} from "../address/addresses";
import {AddressComponent} from "../address/address.component";
import {AutocompleteComponent} from "../autocomplete/autocomplete.component";
import {MapsAPILoader} from "@agm/core";

@Component({
  selector: 'app-add-order',
  templateUrl: './add-order.component.html',
  styleUrls: ['./add-order.component.css']
})
export class AddOrderComponent implements OnInit {
  @ViewChild('orderForm', {static: false}) orderForm: NgForm;
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
  receiverCompany: string;
  receiverSurname: string;
  receiverName: string;
  receiverStreet: string;
  receiverZip: number;
  receiverCity: string;
  receiverMail: string;
  receiverPhone: string;
  subscription: Subscription;
  selectedAddress: Address[];
  geocoder: any;

  constructor(private db: AngularFireDatabase, private globalComp: GlobalComponents, private mapsApiLoader: MapsAPILoader) {
  }

  ngOnInit(): void {
    this.subscription = this.globalComp.clientAddressChange
      .subscribe(() => {
        this.selectedAddress = this.globalComp.getAddress();
        if ('Auftraggeber' === this.selectedAddress[0].type) {
          this.clientCompany = this.selectedAddress[0].company;
          this.clientSurname = this.selectedAddress[0].surname;
          this.clientName = this.selectedAddress[0].name;
          this.clientZip = this.selectedAddress[0].zip;
          this.clientCity = this.selectedAddress[0].city;
          this.clientStreet = this.selectedAddress[0].street;
          this.clientMail = this.selectedAddress[0].email;
          this.clientPhone = this.selectedAddress[0].phone;
        } else {
          this.receiverCompany = this.selectedAddress[0].company;
          this.receiverSurname = this.selectedAddress[0].surname;
          this.receiverName = this.selectedAddress[0].name;
          this.receiverZip = this.selectedAddress[0].zip;
          this.receiverCity = this.selectedAddress[0].city;
          this.receiverStreet = this.selectedAddress[0].street;
          this.receiverMail = this.selectedAddress[0].email;
          this.receiverPhone = this.selectedAddress[0].phone;
        }
      });
  }

  onSaveAddress(resource: string) {
    let node = this.receiver;
    if (resource === 'client') {
      node = this.client;
    }
    let nodeTitle = node.company;
    if (!nodeTitle) {
      nodeTitle = node.name + ' ' + node.surname;
    }

    var rootRef = this.db.list('address');
    rootRef.set(nodeTitle, {
      "company": node.company,
      "surname": node.surname,
      "name": node.name,
      "street": node.street,
      "zip": node.zip,
      "city": node.city,
      "mail": node.mail,
      "phone": node.phone
    })
  }

  onSubmit() {
    this.mapsApiLoader.load().then(() => {
      console.log('google script loaded');
      this.geocoder = new google.maps.Geocoder();
      this.getGeocode();
    });
  }

  getGeocode() {
    const geoAddress = this.receiver.street + ' ' + this.receiver.zip + ' ' + this.receiver.city;
    type CoordsType = Array<{ lat: number, lng: number }>
    this.geocoder.geocode({'address': geoAddress}, (results, status) => {
      if (status === 'OK') {
        const coords: CoordsType = [
          {lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng()}
        ];
        this.saveOrder(coords);
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
  }

  saveOrder(coords) {
    const client = this.client;
    const receiver = this.receiver;
    const nodeTitle = receiver.street + ', ' + receiver.zip + ' ' + receiver.city;
    const date = this.orderForm.value.pickupDate;
    const orderDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();

    // TODO prüfen ob der Empfänger schon eine Lieferung an diesem Tag hat. Dann nur ergänzen und nicht überschreiben
      var rootRef = this.db.list('order/open/' + orderDate);
      rootRef.set(nodeTitle + '/client', {
        "company": client.company,
        "surname": client.surname,
        "name": client.name,
        "street": client.street,
        "zip": client.zip,
        "city": client.city,
        "mail": client.mail,
        "phone": client.phone
      })

      rootRef.set(nodeTitle + '/receiver', {
        "company": receiver.company,
        "surname": receiver.surname,
        "name": receiver.name,
        "street": receiver.street,
        "zip": receiver.zip,
        "city": receiver.city,
        "mail": receiver.mail,
        "phone": receiver.phone,
        "lat": coords[0].lat,
        "lng": coords[0].lng
      })

      rootRef.set(nodeTitle + '/article', {
        "article1": this.orderForm.value.article
      })

      // TODO nur bei success löschen und info einblenden sonst info einblenden
      this.client.onReset();
      this.autoClient.onReset();
      this.receiver.onReset();
      this.autoReceiver.onReset();
      this.orderForm.reset();
  }
}
