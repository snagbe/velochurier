import {Component, OnInit,} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {AngularFireDatabase} from "@angular/fire/compat/database";
import {GlobalComponents} from "../global-components";
import {Address} from "../deliveries/adresses";

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.css']
})
export class AutocompleteComponent implements OnInit {
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

  prefillAddress(clientKey) {
    if (clientKey) {
      this.db.database.ref('address/' + clientKey)
        .on('value',
          snap => {
            const data = snap.val();
            if (data) {
              const address = new Address(clientKey, data.company, data.name, data.surname, data.city, data.street, data.zip, data.mail, data.phone);
              this.globalComp.setAddress(address);
              this.globalComp.clientAddressChange.next();
            }
          });
    }
  }
}
