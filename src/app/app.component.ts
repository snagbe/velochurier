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
  index: number;
  login: String;

  onNavigate(feature: string) {
    this.loadedFeature = feature;
  }

  onChildNavigate(value) {
    this.loadedFeature = value.feature;
    this.id = value.id;
    this.index = value.index;
    this.date = value.date;
  }
}
