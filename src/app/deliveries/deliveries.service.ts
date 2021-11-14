import {Injectable} from '@angular/core';
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

  /**
   * receives the orders
   * @param date the selected date
   * @param status the selected based on the database status (open/delivered)
   * @param type the type of the order address
   */
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
          const address: Address = {id: key, city: this.getType.city,displayName: this.getType.displayName, company: this.getType.company, name: this.getType.name, surname: this.getType.surname, lat: this.getType.lat, lng: this.getType.lng, street: this.getType.street, zip: this.getType.zip, description: this.getType.description};
          return address;
        });
      }));
  }
}
