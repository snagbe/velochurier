import {Component, OnInit} from '@angular/core';
import {AuthService} from "../login/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  constructor(private authService: AuthService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.authService.doAuthCheck();
  }

  doLogout() {
    this.authService.doLogout();
  }

  changePassword() {
    this.router.navigate(['settings/password']);
  }

  onselected() {

  }
}
