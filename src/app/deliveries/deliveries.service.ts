import { Injectable} from '@angular/core';
import {map} from "rxjs/operators";
import {Address} from "../address/addresses";
import {AngularFireDatabase} from "@angular/fire/compat/database";

@Injectable({
  providedIn: 'root'
})
export class DeliveriesService {

  constructor(private db: AngularFireDatabase) { }

  ngOnInit(): void {
  }

  public getAddresses() {
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

  public getDeliveryAddresses(date) {
    const selectedDate = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate();
    return this.db.list('order/' + selectedDate)
      .snapshotChanges()
      .pipe(map(items => {
        return items.map(a => {
          const data = a.payload.val();
          const key = a.payload.key;
          // @ts-ignore
          const address: Address = {id: key, city: data.receiver.city, street: data.receiver.street, zip: data.receiver.zip};
          return address;
        });
      }));
  }
}
