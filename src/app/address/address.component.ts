import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, NgForm, Validators} from "@angular/forms";

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
  @Input() email: string;
  @Input() phone: string;
  @Input() description: string;

  constructor(private formBuilder: FormBuilder) {
    }

    formGroup = this.formBuilder.group({
      company: [""],
      surname: [""],
      name: [""],
      zip: ["", [Validators.required]],
      city: ["", [Validators.required]],
      street: ["", [Validators.required]],
      email: ["", [Validators.email]],
      phone: [""],
      description: [""]
    });

  ngOnInit(): void {
    this.company = null;
    this.surname = null;
    this.name = null;
    this.street = null;
    this.zip = null;
    this.city = null;
    this.email = null;
    this.phone = null;
    this.description = null;
  }

  /**
   * warns the user in case of an empty mandatory field
   *
   * @param inputField
   */
  getErrorMessage(inputField) {
    return inputField.hasError('required') ?
      'Dieses Feld muss ausgefüllt werden' :
      inputField.hasError('email') ?
        'Keine gültige E-Mail Adresse' : '';
  }

  onReset() {
    this.formGroup.reset();
  }

}
