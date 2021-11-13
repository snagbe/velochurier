import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../auth/auth.service";
import {Router} from "@angular/router";
import {Admin} from "../user";
import {FirebaseService} from "../../firebase/firebase.service";

@Component({
  selector: 'app-modify-authorization',
  templateUrl: './modify-authorization.component.html',
  styleUrls: ['./modify-authorization.component.css']
})
export class ModifyAuthorizationComponent implements OnInit {
  users: Admin[];

  constructor(private authService: AuthService,
              private firebaseService: FirebaseService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.authService.doAuthCheck();
    this.users = this.firebaseService.getAllUsers();
  }

  onEditAuthorization(id) {
    this.router.navigate(['customer', {orderId: id}]).then(() => {
      window.location.reload();
    });
  }

  onBack() {
    this.router.navigate(['/settings']);
  }

}
