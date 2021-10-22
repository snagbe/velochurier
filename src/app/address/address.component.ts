import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormControl, NgForm, Validators} from "@angular/forms";

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent implements OnInit {
  @ViewChild('addressForm', {static: false}) addressForm: NgForm;
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

  onReset() {
    this.addressForm.reset();
  }

}
