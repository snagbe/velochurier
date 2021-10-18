import {Component, OnInit, ViewChild} from '@angular/core';
import {AngularFireDatabase} from "@angular/fire/compat/database";
import {NgForm} from "@angular/forms";
import {GlobalComponents} from "../global-components";

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

  constructor(private db: AngularFireDatabase) {
  }

  ngOnInit(): void {
  }

  testPrefill() {
    this.clientCompany = GlobalComponents.clientAddress[0].company;
    this.clientSurname = GlobalComponents.clientAddress[0].surname;
    this.clientName = GlobalComponents.clientAddress[0].name;
    this.clientStreet = GlobalComponents.clientAddress[0].street;
    this.clientZip = GlobalComponents.clientAddress[0].zip;
    this.clientCity = GlobalComponents.clientAddress[0].city;
    this.clientMail = GlobalComponents.clientAddress[0].email;
    this.clientPhone = GlobalComponents.clientAddress[0].phone;
  }

  // TODO prefilled Daten werden nicht erkannt und somit nicht gespeichert
  saveClient(form: NgForm) {
    const company = form.value.client.company;
    const surname = form.value.client.surname;
    const name = form.value.client.name;
    const street = form.value.client.street;
    const zip = form.value.client.zip;
    const city = form.value.client.city;
    const mail = form.value.client.mail;
    const phone = form.value.client.phone;

    var nodeTitle = company;
    if (!nodeTitle) {
      nodeTitle = name + ' ' + surname;
    }

    var rootRef = this.db.list('address');
    rootRef.set(nodeTitle, {
      "company": company,
      "surname": surname,
      "name": name,
      "street": street,
      "zip": zip,
      "city": city,
      "mail": mail,
      "phone": phone
    })
  }

  saveOrder(form: NgForm) {
    const clientCompany = form.value.client.company;
    const clientSurname = form.value.client.surname;
    const clientName = form.value.client.name;
    const clientStreet = form.value.client.street;
    const clientZip = form.value.client.zip;
    const clientCity = form.value.client.city;
    const clientMail = form.value.client.mail;
    const clientPhone = form.value.client.phone;
    const receiverCompany = form.value.reciver.company;
    const receiverSurname = form.value.reciver.surname;
    const receiverName = form.value.reciver.name;
    const receiverStreet = form.value.reciver.street;
    const receiverZip = form.value.reciver.zip;
    const receiverCity = form.value.reciver.city;
    const receiverMail = form.value.reciver.mail;
    const receiverPhone = form.value.reciver.phone;
    const pickupDate = form.value.order.pickupDate;
    const article = form.value.order.article;

    var nodeTitle = clientStreet + ', ' + clientZip + ' ' + clientCity;

    // TODO prüfen ob der Empfänger schon eine Lieferung an diesem Tag hat. Dann nur ergänzen und nicht überschreiben
    var rootRef = this.db.list('order/' + pickupDate);
    rootRef.set(nodeTitle + '/client', {
      "company": clientCompany,
      "surname": clientSurname,
      "name": clientName,
      "street": clientStreet,
      "zip": clientZip,
      "city": clientCity,
      "mail": clientMail,
      "phone": clientPhone
    })

    rootRef.set(nodeTitle + '/receiver', {
      "company": receiverCompany,
      "surname": receiverSurname,
      "name": receiverName,
      "street": receiverStreet,
      "zip": receiverZip,
      "city": receiverCity,
      "mail": receiverMail,
      "phone": receiverPhone
    })

    rootRef.set(nodeTitle + '/article', {
      "article1": article
    })

    // TODO nur bei success löschen und info einblenden sonst info einblenden
    this.orderForm.reset();
  }
}
