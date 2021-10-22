import {Component, Input, OnInit, ViewChild,} from '@angular/core';
import {FormControl, NgForm} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {AngularFireDatabase} from "@angular/fire/compat/database";
import {GlobalComponents} from "../global-components";
import {Address} from "../address/addresses";

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html'
})
export class AutocompleteComponent implements OnInit {
  @ViewChild('autocompleteForm', {static: false}) autocompleteForm: NgForm;
  @Input() title: string;
  myControl = new FormControl();
  options: string[] = [];
  sortedAddresses: any[] = [];
  filteredOptions: Observable<string[]>;

  constructor(private db: AngularFireDatabase, private globalComp: GlobalComponents) {
  }

  ngOnInit() {
    this.setSort()
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  setSort() {
    this.sortedAddresses = [];
    this.db.database.ref('address').orderByKey()
      .on('child_added',
        snap => {
          const data = snap.key;
          if (data) {
            this.sortedAddresses.push(data);
          }
        });

    this.options = this.sortedAddresses;
  }

  onAddressSelected(eventTarget) {
    if (eventTarget.value) {
      this.db.database.ref('address/' + eventTarget.value)
        .on('value',
          snap => {
            const data = snap.val();
            if (data) {
              const address = new Address(eventTarget.value, data.company, data.name, data.surname, data.city, data.street, data.zip, data.mail, data.phone, eventTarget.ariaLabel);
              this.globalComp.setAddress(address);
              this.globalComp.clientAddressChange.next();
            }
          });
    }
  }

  onReset() {
    this.myControl.reset('');
  }
}
