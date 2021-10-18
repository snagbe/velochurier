import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AngularFireDatabase} from "@angular/fire/compat/database";
import {NgForm} from "@angular/forms";
import {GlobalComponents} from "../global-components";

@Component({
  selector: 'app-add-order',
  templateUrl: './add-order.component.html',
  styleUrls: ['./add-order.component.css']
})
export class AddOrderComponent implements OnInit {
  @ViewChild('clientCompanyInput', {static: false}) clientCompanyInputRef: ElementRef;
  @ViewChild('clientSurnameInput', {static: false}) clientSurnameInputRef: ElementRef;
  @ViewChild('clientNameInput', {static: false}) clientNameInputRef: ElementRef;
  @ViewChild('clientStreetInput', {static: false}) clientStreetInputRef: ElementRef;
  @ViewChild('clientZipInput', {static: false}) clientZipInputRef: ElementRef;
  @ViewChild('clientCityInput', {static: false}) clientCityInputRef: ElementRef;
  @ViewChild('receiverCompanyInput', {static: false}) receiverCompanyInputRef: ElementRef;
  @ViewChild('receiverSurnameInput', {static: false}) receiverSurnameInputRef: ElementRef;
  @ViewChild('receiverNameInput', {static: false}) receiverNameInputRef: ElementRef;
  @ViewChild('receiverStreetInput', {static: false}) receiverStreetInputRef: ElementRef;
  @ViewChild('receiverZipInput', {static: false}) receiverZipInputRef: ElementRef;
  @ViewChild('receiverCityInput', {static: false}) receiverCityInputRef: ElementRef;
  @ViewChild('pickupDateInput', {static: false}) pickupDateInputRef: ElementRef;
  @ViewChild('articleInput', {static: false}) articleInputRef: ElementRef;

  @ViewChild('orderForm', {static: false}) orderForm: NgForm;

  clientCompany: string;
  clientSurname: string;
  clientName: string;
  clientStreet: string;
  clientZip: number;
  clientCity: string;

  constructor(private db: AngularFireDatabase) {
  }

  ngOnInit(): void {
  }

  testPrefill(form: NgForm) {
    console.log("Firma: " + form.value.client.clientCompany);
    this.clientCompany = GlobalComponents.clientAddress[0].company;
    this.clientSurname = GlobalComponents.clientAddress[0].surname;
    this.clientName = GlobalComponents.clientAddress[0].name;
    this.clientStreet = GlobalComponents.clientAddress[0].street;
    this.clientZip = GlobalComponents.clientAddress[0].zip;
    this.clientCity = GlobalComponents.clientAddress[0].city;
  }

  saveClient() {
    const company = this.clientCompanyInputRef.nativeElement.value;
    const surname = this.clientSurnameInputRef.nativeElement.value;
    const name = this.clientNameInputRef.nativeElement.value;
    const street = this.clientStreetInputRef.nativeElement.value;
    const zip = this.clientZipInputRef.nativeElement.value;
    const city = this.clientCityInputRef.nativeElement.value;

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
      "city": city
    })
  }

  saveOrder() {
    const clientCompany = this.clientCompanyInputRef.nativeElement.value;
    const clientSurname = this.clientSurnameInputRef.nativeElement.value;
    const clientName = this.clientNameInputRef.nativeElement.value;
    const clientStreet = this.clientStreetInputRef.nativeElement.value;
    const clientZip = this.clientZipInputRef.nativeElement.value;
    const clientCity = this.clientCityInputRef.nativeElement.value;
    const receiverCompany = this.receiverCompanyInputRef.nativeElement.value;
    const receiverSurname = this.receiverSurnameInputRef.nativeElement.value;
    const receiverName = this.receiverNameInputRef.nativeElement.value;
    const receiverStreet = this.receiverStreetInputRef.nativeElement.value;
    const receiverZip = this.receiverZipInputRef.nativeElement.value;
    const receiverCity = this.receiverCityInputRef.nativeElement.value;
    const pickupDate = this.pickupDateInputRef.nativeElement.value;
    const article = this.articleInputRef.nativeElement.value;

    var nodeTitle = clientStreet + ', ' + clientZip + ' ' + clientCity;

    // TODO prüfen ob der Empfänger schon eine Lieferung an diesem Tag hat. Dann nur ergänzen und nicht überschreiben
    var rootRef = this.db.list('order/' + pickupDate);
    rootRef.set(nodeTitle + '/client', {
      "company": clientCompany,
      "surname": clientSurname,
      "name": clientName,
      "street": clientStreet,
      "zip": clientZip,
      "city": clientCity
    })

    rootRef.set(nodeTitle + '/receiver', {
      "company": receiverCompany,
      "surname": receiverSurname,
      "name": receiverName,
      "street": receiverStreet,
      "zip": receiverZip,
      "city": receiverCity
    })

    rootRef.set(nodeTitle + '/article', {
      "article1": article
    })

    //TODO nur bei success löschen und info einbelnden sonst info einblenden
    this.clientCompanyInputRef.nativeElement.value = '';
    this.clientSurnameInputRef.nativeElement.value = '';
    this.clientNameInputRef.nativeElement.value = '';
    this.clientStreetInputRef.nativeElement.value = '';
    this.clientNumberInputRef.nativeElement.value = '';
    this.clientZipInputRef.nativeElement.value = '';
    this.clientCityInputRef.nativeElement.value = '';
    this.receiverCompanyInputRef.nativeElement.value = '';
    this.receiverSurnameInputRef.nativeElement.value = '';
    this.receiverNameInputRef.nativeElement.value = '';
    this.receiverStreetInputRef.nativeElement.value = '';
    this.receiverNumberInputRef.nativeElement.value = '';
    this.receiverZipInputRef.nativeElement.value = '';
    this.receiverCityInputRef.nativeElement.value = '';
    this.pickupDateInputRef.nativeElement.value = '';
    this.articleInputRef.nativeElement.value ='';
  }
}
