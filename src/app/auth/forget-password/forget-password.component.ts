import {Component, OnInit} from '@angular/core';
import {AuthService} from "../auth.service";
import {Router} from "@angular/router";
import {FormBuilder, FormGroupDirective, Validators} from "@angular/forms";
import {DialogData, OverlayService} from "../../overlay/overlay.service";

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {

  constructor(private authService: AuthService,
              private router: Router,
              private overlay: OverlayService,
              private formBuilder: FormBuilder) {
  }

  formGroup = this.formBuilder.group({
    email: ["", [Validators.required, Validators.email]]
  });

  ngOnInit(): void {
  }

  /**
   * sends an e-mail when the user wants to reset his password
   * @param formDirective the name of the form tag
   */
  onSubmit(formDirective: FormGroupDirective) {
    this.authService.sendPasswordResetMail(this.formGroup.controls.email.value)
      .then(() => {
        console.log("sending mail successful");
        const data: DialogData = {
          title: 'Link wurde versendet',
          message: 'Wir haben dir einen Link, um das Passwort zurückzusetzen, an ' + this.formGroup.controls.email.value + ' gesendet.',
          type: 'success',
          timeout: 3000,
          primaryButton: {name: 'Ok'}
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
          type: 'error',
          primaryButton: {name: 'Ok'}
        }
        this.overlay.openDialog(data);
      });
  }

  /**
   * allows you to return to the previous component "settings"
   */
  onBack() {
    this.router.navigate(['/settings']);
  }

  /**
   * warns the user in case of an empty mandatory field
   *
   * @param inputField the blank field
   */
  getErrorMessage(inputField) {
    return inputField.hasError('required') ?
      'Dieses Feld muss ausgefüllt werden' :
        inputField.hasError('email') ?
          'Keine gültige E-Mail Adresse' : '';
  }
}
