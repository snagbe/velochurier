import {Component} from '@angular/core';

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

  onChildNavigate(value) {
    this.loadedFeature = value.feature;
    this.id = value.id;
    this.lat = value.lat;
    this.lng = value.lng;
    this.date = value.date;
  }
}
