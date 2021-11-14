import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../auth/auth.service";
import {AngularFireDatabase} from "@angular/fire/compat/database";
import {FirebaseService} from "../../firebase/firebase.service";
import {Router} from "@angular/router";
import {DialogData, OverlayService} from "../../overlay/overlay.service";
import {User} from "../user";
import {AngularFireAuth} from "@angular/fire/compat/auth";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: User = {
    id: "",
    uid: "",
    username: "",
    email: "",
    admin: false
  };

  constructor(private authService: AuthService,
              private afAuth: AngularFireAuth,
              private db: AngularFireDatabase,
              private firebaseService: FirebaseService,
              private router: Router,
              private overlay: OverlayService) {
  }

  ngOnInit(): void {
    this.authService.doAuthCheck();
    this.afAuth.authState.subscribe(user => {
      this.user = this.firebaseService.getUser();
    });
  }

  onEditProfile(user) {
    const isAdmin = this.firebaseService.checkAdminWithUid(user.id);
    const authCase = isAdmin ? 'entziehen' : 'erteilen';
    const data: DialogData = {
      title: "Berechtigung " + authCase,
      message: "Möchtest du dem Benutzer '" + user.username + "' die Admin Berechtigung wirklich " + authCase + "?",
      type: 'confirmation',
      primaryButton: {
        name: 'Berechtigung ' + authCase, function: function () {
          this.db.database.ref('user/' + user.id + '/admin').set(!isAdmin);
          this.users.find(x => x.id == user.id).admin = !isAdmin;
        }.bind(this)
      },
      secondaryButton: {
        name: 'Abbrechen'
      }
    }
    this.overlay.openDialog(data);
  }

  /**
   * allows you to return to the previous component "settings"
   */
  onBack() {
    this.router.navigate(['/settings']);
  }

}
