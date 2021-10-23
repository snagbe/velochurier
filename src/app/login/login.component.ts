import {Component, OnInit} from '@angular/core';
import {FormControl, NgForm, Validators} from "@angular/forms";
import {AuthService} from "./auth.service";
import {AppComponent} from "../app.component";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);
  hide = true;

  constructor(private authService: AuthService, private nav: AppComponent) { }

  ngOnInit(): void {
  }

  onSubmit(loginForm: NgForm) {
    if (!loginForm.valid) {
      return;
    }
    this.authService.doLogin(this.email.value, this.password.value)
      .then(res => {
        this.nav.onNavigate('deliveries');
      }, err => {
        console.log(err.message);
        console.log(err.code);
      })
  }

  getErrorMessage(element) {
    if (element.hasError('required')) {
      return 'Dieses Feld muss ausgefüllt werden';
    }

    return this.email.hasError('email') ? 'Keine gültige E-Mail Adresse' : '';
  }
}
