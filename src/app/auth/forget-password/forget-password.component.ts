import {Component, OnInit} from '@angular/core';
import {AuthService} from "../auth.service";
import {Router} from "@angular/router";
import {DialogData, OverlayComponent} from "../../overlay/overlay.component";
import {FormBuilder, FormGroupDirective, NgForm, Validators} from "@angular/forms";

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {

  constructor(private authService: AuthService,
              private router: Router,
              private overlay: OverlayComponent,
              private formBuilder: FormBuilder) {
  }

  formGroup = this.formBuilder.group({
    email: [
      "",
      [
        Validators.required,
        Validators.email
      ]
    ]
  });

  ngOnInit(): void {
  }

  onSubmit(formDirective: FormGroupDirective) {
    this.authService.sendPasswordResetMail(this.formGroup.controls.email.value)
      .then(() => {
        console.log("sending mail successful");
        const data: DialogData = {
          title: 'Link wurde versendet',
          message: 'Wir haben dir einen Link, um das Passwort zurückzusetzen, an ' + this.formGroup.controls.email.value + ' gesendet.',
          type: 'success'
        }
        this.overlay.openDialog(data);
        this.formGroup.reset();
        formDirective.resetForm();
      })
      .catch((error) => {
        let errorMessage = error.code;
        if ('auth/user-not-found' === errorMessage) {
          errorMessage = 'Für die eingegebene E-Mail Adresse existiert kein Konto.';
        }
        const data: DialogData = {
          title: 'Fehler',
          message: errorMessage,
          type: 'error'
        }
        this.overlay.openDialog(data);
      });
  }

  onBack() {
    this.router.navigate(['/settings']);
  }

  getErrorMessage(inputField) {
    return inputField.hasError('required') ?
      'Dieses Feld muss ausgefüllt werden' :
        inputField.hasError('email') ?
          'Keine gültige E-Mail Adresse' : '';
  }
}
