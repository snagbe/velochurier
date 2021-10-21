import {Component, OnInit, ViewChild} from '@angular/core';
import {AngularFireDatabase} from "@angular/fire/compat/database";
import {NgForm} from "@angular/forms";
import {GlobalComponents} from "../global-components";
import {Subscription} from "rxjs";
import {Address} from "../deliveries/adresses";
import {AddressComponent} from "../address/address.component";

@Component({
  selector: 'app-add-order',
  templateUrl: './add-order.component.html',
  styleUrls: ['./add-order.component.css']
})
export class AddOrderComponent implements OnInit {
  @ViewChild('orderForm', {static: false}) orderForm: NgForm;
  @ViewChild('client') client: AddressComponent;
  @ViewChild('receiver') receiver: AddressComponent;

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
  clientAddress: Address[];

  constructor(private db: AngularFireDatabase, private globalComp: GlobalComponents) {
  }

  ngOnInit(): void {
    this.subscription = this.globalComp.clientAddressChange
      .subscribe(() => {
        this.clientAddress = this.globalComp.getAddress()
        this.clientCompany = this.clientAddress[0].company;
        this.clientSurname = this.clientAddress[0].surname;
        this.clientName = this.clientAddress[0].name;
        this.clientZip = this.clientAddress[0].zip;
        this.clientCity = this.clientAddress[0].city;
        this.clientStreet = this.clientAddress[0].street;
        this.clientMail = this.clientAddress[0].email;
        this.clientPhone = this.clientAddress[0].phone;
      });
  }

  saveAddress(resource: string) {
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

  saveOrder(form: NgForm) {
    const client = this.client;
    const receiver = this.receiver;
    const nodeTitle = client.street + ', ' + client.zip + ' ' + client.city;
    const orderDate = form.value.pickupDate.toISOString().split('T')[0];

    // TODO prüfen ob der Empfänger schon eine Lieferung an diesem Tag hat. Dann nur ergänzen und nicht überschreiben
    var rootRef = this.db.list('order/' + orderDate);
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
      "phone": receiver.phone
    })

    rootRef.set(nodeTitle + '/article', {
      "article1": form.value.article
    })

    // TODO nur bei success löschen und info einblenden sonst info einblenden
    this.orderForm.reset();
  }
}
