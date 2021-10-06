import {Component, OnInit} from '@angular/core';
import {Address} from "./deliveries";
import {AngularFireDatabase} from "@angular/fire/compat/database";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-deliveries',
  templateUrl: './deliveries.component.html',
  styleUrls: ['./deliveries.component.css']
})
export class DeliveriesComponent implements OnInit {

  addresses: Address[];
  address: String;

  constructor(private db: AngularFireDatabase) {
  }

  ngOnInit(): void {
    this.getAdresses().subscribe(value => this.addresses = value);
    this.address = 'test';
  }

  public getAdresses() {
    return this.db.list('address')
      .snapshotChanges()
      .pipe(map(items => {
        return items.map(a => {
          const data = a.payload.val();
          const key = a.payload.key;
          // @ts-ignore
          const address: Address = {id: key, city: data.city, street: data.street, zip: data.zip};
          return address;
        });
      }));
  }


}
