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
  addressCount: number;
  geocoder: any;
  lat: number;
  lng: number;
  zoom: number;

  @ViewChild(AgmMap) map: AgmMap;

  constructor(private db: AngularFireDatabase,
              private mapsApiLoader: MapsAPILoader,
              private globalComponents: GlobalComponents) {
  }

  ngOnInit(): void {
    this.lat = 46.85785;
    this.lng = 9.53059;
    this.zoom = 14.5;


    this.getAddressCount();
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

  getAddressCount() {
    this.db.database.ref('address')
      .on('value',
        snap => {
          this.addressCount = snap.numChildren();
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
          if (this.addresses.length === this.addressCount) {
            this.globalComponents.geoAddressChange.next();
          }
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
          //console.log("Addresse Strasse: " + this.addresses[i].street + ", lat: " + this.addresses[i].lat + ", long: " + this.addresses[i].lng);
        } else {
          alert('Geocode was not successful for the following reason: ' + status);
        }
      });
    }
  }
}
