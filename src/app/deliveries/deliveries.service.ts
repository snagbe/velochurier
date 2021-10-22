import { Injectable} from '@angular/core';
import {map} from "rxjs/operators";
import {Address} from "../address/addresses";
import {AngularFireDatabase} from "@angular/fire/compat/database";

@Injectable({
  providedIn: 'root'
})
export class DeliveriesService {
  getType: any;

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

  public getOrderAddresses(date, status, type) {

    const selectedDate = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate();
    return this.db.list('order/' + status + '/' + selectedDate)
      .snapshotChanges()
      .pipe(map(items => {
        return items.map(a => {
          const data = a.payload.val();
          if(type === 'receiver') {
            // @ts-ignore
            this.getType = data.receiver;
          }else if (type === 'client') {
            // @ts-ignore
            this.getType = data.client;
          }else {
            // @ts-ignore
            this.getType = data.receiver;
          }
          const key = a.payload.key;

          // @ts-ignore
          const address: Address = {id: key, city: this.getType.city, street: this.getType.street, zip: this.getType.zip};
          return address;
        });
      }));
  }
}
