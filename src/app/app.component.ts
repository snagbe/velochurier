import {Component} from '@angular/core';
import {Address} from "./address/addresses";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'velochurier';
  loadedFeature = 'deliveries';
  id: any;
  date: any;
  lat: number;
  lng: number;
  receiverOrder: Address[];

  onNavigate(feature: string) {
    this.loadedFeature = feature;
  }

  onChildNavigate(value) {
    this.loadedFeature = value.feature;
    this.id = value.id;
    this.lat = value.lat;
    this.lng = value.lng;
    this.date = value.date;
  }

  onOrderNavigate(value) {
    this.loadedFeature = value.feature;
    this.receiverOrder = value.receiverOrder;

  }
}
