import {Component, Input, OnInit, ViewChild,} from '@angular/core';
import {FormBuilder, FormControl, NgForm, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {AngularFireDatabase} from "@angular/fire/compat/database";
import {GlobalComponents} from "../global-components";
import {Address} from "../address/addresses";
import {OrderControl} from "./orderControl";
import {of} from 'rxjs';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html'
})
export class AutocompleteComponent implements OnInit {
  @ViewChild('autocompleteForm', {static: false}) autocompleteForm: NgForm;
  @Input() title: string;
  myControl = new FormControl();
  options: OrderControl[];
  filteredOptions: Observable<OrderControl[]>;
  sortedAddresses: OrderControl[];

  constructor(private db: AngularFireDatabase, private globalComp: GlobalComponents) {
  }

  ngOnInit() {
    this.setSort()
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  private _filter(value: OrderControl): OrderControl[] {
    const filterValue = value ? value.name? value.name: value : "";
    return this.options.filter(option => option.name.includes(<string>filterValue));
  }

  getOptionText(option) {
    if (option) {
      return option.name;
    }
  }

  setSort() {
    this.sortedAddresses = [];
    this.db.database.ref('address').orderByChild('displayName')
      .on('child_added',
        snap => {
          const key = snap.key;
          const data = snap.val();
          if (data) {
            if (data.company) {
              this.sortedAddresses.push({id: key, type: this.title, name: data.company});
            } else {
              const name = data.name + ' ' + data.surname;
              this.sortedAddresses.push({id: key, type: this.title, name: name});
            }
          }
        });
    this.options = this.sortedAddresses;
  }

  onAddressSelected(eventTarget) {
    if (eventTarget) {
      this.db.database.ref('address/' + eventTarget.id)
        .on('value',
          snap => {
            const key = snap.key;
            const data = snap.val();
            if (data) {
              // @ts-ignore
              const address: Address = {
                id: key,
                company: data.company,
                name: data.name,
                surname: data.surname,
                city: data.city,
                street: data.street,
                zip: data.zip,
                email: data.email,
                phone: data.phone,
                description: data.description,
                type: eventTarget.type
              };
              this.globalComp.setAddress(address);
              this.globalComp.addressChange.next();
            }
          });
    }
  }

  onReset() {
    this.myControl.reset('');
  }
}
