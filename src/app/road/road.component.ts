import {Component, OnInit} from '@angular/core';
import {} from 'googlemaps';
import {ViewChild} from '@angular/core';


@Component({
  selector: 'app-road',
  templateUrl: './road.component.html',
  styleUrls: ['./road.component.css']
})

export class RoadComponent implements OnInit {
  @ViewChild('map', {static: true}) mapElement: any;
  map: google.maps.Map;

  constructor() {
  }

  ngOnInit(): void {
    // The location of Uluru
    const chur = { lat: 46.85785, lng: 9.53059 };
    // The map, centered at Uluru
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 15,
      center: chur,
    });
    // The marker, positioned at Uluru
    const marker = new google.maps.Marker({
      position: chur,
      map: map,
    });
  }
}
