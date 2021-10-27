import {Component, OnInit} from '@angular/core';
import {FormControl, NgForm, Validators} from "@angular/forms";
import {AuthService} from "../auth.service";
import {AppComponent} from "../../app.component";
import {DialogData, OverlayComponent} from "../../overlay/overlay.component";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);
  hide = true;

  constructor(private authService: AuthService,
              private nav: AppComponent,
              private overlay: OverlayComponent,
              private router: Router) {
  }

  ngOnInit(): void {
  }

  onSubmit(loginForm: NgForm) {
    if (!loginForm.valid) {
      return;
    }
    this.authService.doLogin(this.email.value, this.password.value)
      .then(res => {
        this.router.navigate(['/deliveries']);
      }, err => {
        let errorMessage = err.code;
        switch (err.code) {
          case 'auth/invalid-email': {
            errorMessage = "Die eingegebene E-Mail Adresse ist nicht valid."
            break;
          }
          case 'auth/user-disabled': {
            errorMessage = "Das Konto wurde deaktiviert."
            break;
          }
          case 'auth/user-not-found': {
            errorMessage = "Für die eingegebene E-Mail Adresse existiert kein Konto."
            break;
          }
          case 'auth/wrong-password': {
            errorMessage = "Das eingegebene Passwort ist nicht korrekt."
            break;
          }
        }
        const data: DialogData = {
          type: 'Fehler',
          message: errorMessage
        }
        this.overlay.openDialog(data);
      })
  }

  getErrorMessage(element) {
    if (element.hasError('required')) {
      return 'Dieses Feld muss ausgefüllt werden';
    }

    return this.email.hasError('email') ? 'Keine gültige E-Mail Adresse' : '';
  }
}
