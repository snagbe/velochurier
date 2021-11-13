import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../auth/auth.service";
import {Router} from "@angular/router";
import {User} from "../user";
import {FirebaseService} from "../../firebase/firebase.service";
import {DialogData, OverlayService} from "../../overlay/overlay.service";
import {AngularFireDatabase} from "@angular/fire/compat/database";

@Component({
  selector: 'app-modify-authorization',
  templateUrl: './modify-authorization.component.html',
  styleUrls: ['./modify-authorization.component.css']
})
export class ModifyAuthorizationComponent implements OnInit {
  users: User[];

  constructor(private authService: AuthService,
              private db: AngularFireDatabase,
              private firebaseService: FirebaseService,
              private router: Router,
              private overlay: OverlayService) {
  }

  ngOnInit(): void {
    this.authService.doAuthCheck();
    this.authService.doAdminCheck();
    this.users = this.firebaseService.getAllUsers();
  }

  onEditAuthorization(user) {
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

  onBack() {
    this.router.navigate(['/settings']);
  }

}
