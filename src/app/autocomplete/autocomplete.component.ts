import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {AngularFireDatabase} from "@angular/fire/compat/database";
import {Address} from "../deliveries/deliveries";

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

  clientAddress: Address[];

  constructor(private db: AngularFireDatabase) {
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
    clientKey = 'Influr';
    this.clientAddress = [];
    this.db.database.ref('address/' + clientKey)
      .on('value',
        snap => {
          const data = snap.val();
          if (data) {
            this.clientAddress.push({id: clientKey, city: data.city, company: data.company, street: data.street, zip: data.zip});
          }
          console.log(this.clientAddress);
        });
  }
}
