import {Component, OnInit, ViewChild} from '@angular/core';
import {} from 'googlemaps';
import {map} from "rxjs/operators";
import {AngularFireDatabase} from "@angular/fire/compat/database";
import {AgmMap} from '@agm/core';
import {FormControl} from "@angular/forms";
import {Address} from "../address/addresses";

@Component({
  selector: 'app-road',
  templateUrl: './road.component.html',
  styleUrls: ['./road.component.css']
})

export class RoadComponent implements OnInit {
  addresses: Address[];
  geoAddress: String;
  geocoder: any;
  lat: number;
  lng: number;
  zoom: number;
  date = new FormControl(new Date());

  @ViewChild(AgmMap) map: AgmMap;

  constructor(private db: AngularFireDatabase) {
  }

  ngOnInit(): void {
    this.lat = 46.85785;
    this.lng = 9.53059;
    this.zoom = 14.5;

    this.getAddresses(this.date.value).subscribe();
  }

  public getAddresses(date) {
    this.addresses = [];
    const selectedDate = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate();
    return this.db.list('order/' + selectedDate)
      .snapshotChanges()
      .pipe(map(items => {
        return items.map(a => {
          const data = a.payload.val();
          // @ts-ignore
          const receiver = data.receiver;
          const key = a.payload.key;
          // @ts-ignore
          this.addresses.push({id: key, city: receiver.city, street: receiver.street, zip: receiver.zip, lat: receiver.lat, lng: receiver.lng});
        });
      }));
  }

  onDateChanged() {
    this.getAddresses(this.date.value).subscribe();
  }
}
