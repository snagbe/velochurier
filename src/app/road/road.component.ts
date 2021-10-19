import {Component, OnInit} from '@angular/core';
import {} from 'googlemaps';
import {map} from "rxjs/operators";
import {AddressGeocoder} from "./road";
import {AngularFireDatabase} from "@angular/fire/compat/database";

@Component({
  selector: 'app-road',
  templateUrl: './road.component.html',
  styleUrls: ['./road.component.css']
})

export class RoadComponent implements OnInit {
  addresses: AddressGeocoder[];

  constructor(private db: AngularFireDatabase) {
  }

  ngOnInit(): void {
    this.getAdresses().subscribe();
    console.log(this.addresses)
  }


  public getAdresses() {
    this.addresses = [];
    return this.db.list('address')
      .snapshotChanges()
      .pipe(map(items => {
        return items.map(a => {
          const data = a.payload.val();
          const key = a.payload.key;
          // @ts-ignore
          this.addresses.push({id: key, city: data.city, street: data.street, zip: data.zip});
        });
      }));
  }
}
