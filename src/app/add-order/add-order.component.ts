import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AngularFireDatabase} from "@angular/fire/compat/database";

@Component({
  selector: 'app-add-order',
  templateUrl: './add-order.component.html',
  styleUrls: ['./add-order.component.css']
})
export class AddOrderComponent implements OnInit {
  @ViewChild('companyInput', {static: false}) companyInputRef: ElementRef;
  @ViewChild('surnameInput', {static: false}) surnameInputRef: ElementRef;
  @ViewChild('nameInput', {static: false}) nameInputRef: ElementRef;
  @ViewChild('streetInput', {static: false}) streetInputRef: ElementRef;
  @ViewChild('numberInput', {static: false}) numberInputRef: ElementRef;
  @ViewChild('zipInput', {static: false}) zipInputRef: ElementRef;
  @ViewChild('cityInput', {static: false}) cityInputRef: ElementRef;

  constructor(private db: AngularFireDatabase) {
  }

  ngOnInit(): void {
  }

  saveCustomer() {
    const company = this.companyInputRef.nativeElement.value;
    const surname = this.surnameInputRef.nativeElement.value;
    const name = this.nameInputRef.nativeElement.value;
    const street = this.streetInputRef.nativeElement.value;
    const nr = this.numberInputRef.nativeElement.value;
    const zip = this.zipInputRef.nativeElement.value;
    const city = this.cityInputRef.nativeElement.value;

    var filter = company;
    if (!filter) {
      filter = name + ' ' + surname;
    }

    var rootRef = this.db.list('address');
    rootRef.set(filter, {
      "company": company,
      "surname": surname,
      "name": name,
      "street": street + ' ' + nr,
      "zip": zip,
      "city": city
    })
  }

  delete() {
    this.companyInputRef.nativeElement.value = '';
    this.surnameInputRef.nativeElement.value = '';
    this.nameInputRef.nativeElement.value = '';
    this.streetInputRef.nativeElement.value = '';
    this.numberInputRef.nativeElement.value = '';
    this.zipInputRef.nativeElement.value = '';
    this.cityInputRef.nativeElement.value = '';

  }
}
