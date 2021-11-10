import {Component, OnInit} from '@angular/core';
import {AuthService} from "../auth/auth.service";
import {Router} from "@angular/router";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {GlobalComponents} from "../global-components";
import {Subscription} from "rxjs";
import {Admin} from "./user";
import {AngularFireDatabase} from "@angular/fire/compat/database";
import {DialogData, OverlayService} from "../overlay/overlay.service";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  private isValid = false;
  private subscription: Subscription;
  private adminUsers: Admin[];

  constructor(private authService: AuthService,
              private router: Router,
              private afAuth: AngularFireAuth,
              private globalComp: GlobalComponents,
              private overlay: OverlayService,
              private db: AngularFireDatabase) {
  }

  ngOnInit(): void {
    this.authService.doAuthCheck();
    this.getAdminUsers();
  }

  onAddUser() {
    this.isAdmin()
    this.subscription = this.globalComp.determinedAdmin
      .subscribe(() => {
        if (this.isValid) {
          this.router.navigate(['/settings/newUser']);
        }else {
          const data: DialogData = {
            title: 'Keine Berechtigung',
            message: 'Du bist nicht berechtigt diesen Inhalt zu sehen.',
            type: 'error',
            timeout: 3000,
            primaryButton: {name: 'Ok'}
          }
          this.overlay.openDialog(data);
        }
      })
  }

  /**
   * Write the admin users in the array adminUsers"
   */
  getAdminUsers() {
    this.adminUsers = [];
    this.db.database.ref('admin').on('child_added',
        snap => {
          const data = snap.val();
          this.adminUsers.push({username: data.username, uid: data.uid});
        });
  }

  doLogout() {
    this.authService.doLogout();
  }

  onselected() {
    const data: DialogData = {
      title: 'Keine Berechtigung',
      message: 'Du bist nicht berechtigt diesen Inhalt zu sehen.',
      type: 'error',
      timeout: 3000,
      primaryButton: {name: 'Ok'}
    }
    this.overlay.openDialog(data);
  }

  /**
   * Check the permission of the current User
   */
  isAdmin() {
    let valid = false;
    this.afAuth.authState.subscribe(user => {
      if (user) {
        for(let i = 0; i < this.adminUsers.length; i++) {
          valid = this.adminUsers[i].uid === user.uid
          if(valid === true) {
            this.isValid = valid;
          }
        }
      } else {
        this.isValid = false;
      }
      this.globalComp.determinedAdmin.next();
    });
  }
}
