import {Component, OnInit, ViewChild} from '@angular/core';
import {} from 'googlemaps';
import {map} from "rxjs/operators";
import {AngularFireDatabase} from "@angular/fire/compat/database";
import {AgmMap} from '@agm/core';
import {FormControl} from "@angular/forms";
import {Address} from "../address/addresses";
import {AuthService} from "../login/auth.service";

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
  getType: any;

  @ViewChild(AgmMap) map: AgmMap;

  constructor(private db: AngularFireDatabase,
              private authService: AuthService) {
  }

  ngOnInit(): void {
    this.authService.doAuthCheck();
    this.lat = 46.85785;
    this.lng = 9.53059;
    this.zoom = 14.5;

    this.getOrderAddresses(this.date.value, 'open', 'receiver').subscribe();
  }

  public getOrderAddresses(date, status, type) {
    this.addresses = [];
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
          this.addresses.push({id: key, city: this.getType.city, street: this.getType.street, zip: this.getType.zip, lat: this.getType.lat, lng: this.getType.lng});
        });
      }));
  }

  onDateChanged() {
    this.getOrderAddresses(this.date.value, 'open', 'receiver').subscribe();
  }
}
