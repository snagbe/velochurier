import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'velochurier';
  loadedFeature = 'deliveries';
  Index: number;

  onNavigate(feature: string) {
    this.loadedFeature = feature;
  }

  onChildNavigate(value) {
    this.loadedFeature = value.feature;
    this.Index = value.index
  }
}
