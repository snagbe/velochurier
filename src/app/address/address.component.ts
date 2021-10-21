import {Component, Input, OnInit} from '@angular/core';
import {FormControl, Validators} from "@angular/forms";

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent implements OnInit {
  @Input() company: string;
  @Input() surname: string;
  @Input() name: string;
  @Input() street: string;
  @Input() zip: number;
  @Input() city: string;
  @Input() mail: string;
  @Input() phone: string;

  constructor() {
  }

  ngOnInit(): void {
    this.company = null;
    this.surname = null;
    this.name = null;
    this.street = null;
    this.zip = null;
    this.city = null;
    this.mail = null;
    this.phone = null;
  }

  email = new FormControl('', [Validators.required, Validators.email]);

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'Dieses Feld muss ausgefüllt werden';
    }

    return this.email.hasError('email') ? 'Keine gültige E-mAil Adresse' : '';
  }

}
