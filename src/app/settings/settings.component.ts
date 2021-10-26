import {Component, OnInit} from '@angular/core';
import {AuthService} from "../login/auth.service";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  constructor(private authService: AuthService) {
  }

  ngOnInit(): void {
    this.authService.doAuthCheck();
  }

  doLogout() {
    this.authService.doLogout();
  }

  onselected() {

  }
}
