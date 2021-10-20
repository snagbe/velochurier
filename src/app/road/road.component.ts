import {Component, NgZone, OnInit, ViewChild} from '@angular/core';
import {} from 'googlemaps';
import {map} from "rxjs/operators";
import {AddressGeocoder} from "./road";
import {AngularFireDatabase} from "@angular/fire/compat/database";
import {MapsAPILoader, AgmMap} from '@agm/core';
import {GlobalComponents} from "../global-components";


@Component({
  selector: 'app-road',
  templateUrl: './road.component.html',
  styleUrls: ['./road.component.css']
})

export class RoadComponent implements OnInit {
  addresses: AddressGeocoder[];
  geoAddress: String;
  public platform: any;
  public geocoder: any;

  @ViewChild(AgmMap) map: AgmMap;

  constructor(private db: AngularFireDatabase,
              private mapsApiLoader: MapsAPILoader,
              private ngZone: NgZone,
              private globalComponents: GlobalComponents) {
    this.mapsApiLoader = mapsApiLoader;
  }

  ngOnInit(): void {
    this.getAdresses().subscribe();
    console.log(this.addresses);

    this.globalComponents.geoAddressChange.subscribe(() => {
      this.mapsApiLoader.load().then(() => {
        console.log('google script loaded');
        this.geocoder = new google.maps.Geocoder();
        this.getGeocode()
      });
    });
  }

  getAdresses() {
    this.addresses = [];
    return this.db.list('address')
      .snapshotChanges()
      .pipe(map(items => {
        return items.map(a => {
          const data = a.payload.val();
          const key = a.payload.key;
          // @ts-ignore
          this.addresses.push({id: key, city: data.city, street: data.street, zip: data.zip});
          this.globalComponents.geoAddressChange.next();
        });
      }));
  }

  getGeocode() {
    for (let i = 0; i < this.addresses.length; i++) {
      this.geoAddress = this.addresses[i].street + ' ' + this.addresses[i].zip + ' ' + this.addresses[i].city;
      this.geocoder.geocode({'address': this.geoAddress}, (results, status) => {
        if (status === 'OK') {
          this.addresses[i].lat = results[0].geometry.location.lat();
          this.addresses[i].lng = results[0].geometry.location.lng();
          console.log("lat: " + this.addresses[0].lat + ", long: " + this.addresses[0].lng);
        } else {
          console.log('Geocode was not successful for the following reason: ' + status);
          //alert('Geocode was not successful for the following reason: ' + status);
        }
      });
    }
  }
}
