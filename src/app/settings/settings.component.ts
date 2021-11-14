import {Component, OnInit} from '@angular/core';
import {AuthService} from "../auth/auth.service";
import {Router} from "@angular/router";
import {DialogData, OverlayService} from "../overlay/overlay.service";
import {FirebaseService} from "../firebase/firebase.service";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  constructor(private authService: AuthService,
              private router: Router,
              private firebaseService: FirebaseService,
              private overlay: OverlayService) {
  }

  ngOnInit(): void {
    this.authService.doAuthCheck();
  }

  onAdminNavigation(newPage: String) {
        if (this.firebaseService.checkAdmin()) {
          this.router.navigate(['/settings/' + newPage]);
        }else {
          const data: DialogData = {
            title: 'Keine Berechtigung',
            message: 'Du bist nicht berechtigt diesen Inhalt zu sehen.',
            type: 'error',
            primaryButton: {name: 'Ok'}
          }
          this.overlay.openDialog(data);
        }
  }

  doLogout() {
    this.authService.doLogout();
  }

}
