import {Component, OnInit, ViewChild} from '@angular/core';
import {AngularFireDatabase} from "@angular/fire/compat/database";
import {NgForm} from "@angular/forms";
import {GlobalComponents} from "../global-components";
import {Subscription} from "rxjs";
import {Address} from "../deliveries/adresses";

@Component({
  selector: 'app-add-order',
  templateUrl: './add-order.component.html',
  styleUrls: ['./add-order.component.css']
})
export class AddOrderComponent implements OnInit {
  @ViewChild('orderForm', {static: false}) orderForm: NgForm;

  clientCompany: string;
  clientSurname: string;
  clientName: string;
  clientStreet: string;
  clientZip: number;
  clientCity: string;
  clientMail: string;
  clientPhone: string;
  subscription: Subscription
  clientAddress: Address[];

  constructor(private db: AngularFireDatabase, private globalComp: GlobalComponents) {
  }

  ngOnInit(): void {
    this.subscription = this.globalComp.clientAddressChange
      .subscribe(() => {
        this.clientAddress = this.globalComp.getAddress()
        this.orderForm.controls['client'].setValue({
          company: this.clientAddress[0].company,
          surname: this.clientAddress[0].surname,
          name: this.clientAddress[0].name,
          zip: this.clientAddress[0].zip,
          city: this.clientAddress[0].city,
          street: this.clientAddress[0].street,
          mail: this.clientAddress[0].email,
          phone: this.clientAddress[0].phone
        });
      });
  }

  saveClient(form: NgForm) {
    const client = form.value.client;
    var nodeTitle = client.company;
    if (!nodeTitle) {
      nodeTitle = client.name + ' ' + client.surname;
    }

    var rootRef = this.db.list('address');
    rootRef.set(nodeTitle, {
      "company": client.company,
      "surname": client.surname,
      "name": client.name,
      "street": client.street,
      "zip": client.zip,
      "city": client.city,
      "mail": client.mail,
      "phone": client.phone
    })
  }

  saveOrder(form: NgForm) {
    const client = form.value.client;
    const receiver = form.value.reciver;
    const order = form.value.order;
    const nodeTitle = client.street + ', ' + client.zip + ' ' + client.city;
    const orderDate = order.pickupDate.toISOString().split('T')[0];

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
      "article1": order.article
    })

    // TODO nur bei success löschen und info einblenden sonst info einblenden
    this.orderForm.reset();
  }
}
