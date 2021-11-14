import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../auth.service";
import {AppComponent} from "../../app.component";
import {Router} from "@angular/router";
import {DialogData, OverlayService} from "../../overlay/overlay.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  hide = true;

  constructor(private authService: AuthService,
              private nav: AppComponent,
              private overlay: OverlayService,
              private router: Router,
              private formBuilder: FormBuilder) {
  }

  loginFormGroup = this.formBuilder.group({
    email: [
      "",
      [
        Validators.required,
        Validators.email
      ]
    ],
    password: [
      "",
      [
        Validators.required,
        Validators.minLength(6)
      ]
    ]
  });

  ngOnInit(): void {
  }

  /**
   * Logs you in to the application on the home page
   */
  onSubmit() {
    if (!this.loginFormGroup.valid) {
      return;
    }
    this.authService.doLogin(this.loginFormGroup.controls.email.value, this.loginFormGroup.controls.password.value)
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
          title: 'Fehler',
          message: errorMessage,
          type: 'error',
          primaryButton: {name: 'Ok'}
        }
        this.overlay.openDialog(data);
      })
  }

  /**
   * warns the user in case of an empty mandatory field
   * @param inputField the blank field
   */
  getErrorMessage(inputField) {
    return inputField.hasError('required') ?
      'Dieses Feld muss ausgefüllt werden' :
        inputField.hasError('minlength') ?
          'Das Passwort muss mindestens sechs Zeichen beinhalten' :
          inputField.hasError('email') ?
            'Keine gültige E-Mail Adresse' : '';
  }
}
