import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {NgForm} from "@angular/forms";
import {AuthService} from "../../login/auth.service";

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css']
})
export class PasswordComponent implements OnInit {

  constructor(private authService: AuthService,
              private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit(passwordForm: NgForm) {
    this.authService.changePassword(passwordForm.value.passwordNew);
    passwordForm.reset();
  }

  onBack() {
    this.router.navigate(['/settings']);
  }
}
