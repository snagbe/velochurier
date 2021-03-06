import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {FormBuilder, FormGroupDirective, Validators} from "@angular/forms";
import {AuthService} from "../../auth/auth.service";
import {DialogData, OverlayService} from "../../overlay/overlay.service";

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css']
})
export class PasswordComponent implements OnInit {

  constructor(private authService: AuthService,
              private router: Router,
              private overlay: OverlayService,
              private formBuilder: FormBuilder) {
  }

  formGroup = this.formBuilder.group({
    passwordOld: ["", [Validators.required, Validators.minLength(6)]],
    passwordNew: ["", [Validators.required, Validators.minLength(6)]]
  });

  ngOnInit(): void {
    this.authService.doAuthCheck();
  }

  /**
   * checks the old password and stores a new one
   * @param formDirective the name of the form tag
   */
  onSubmit(formDirective: FormGroupDirective) {
    this.authService.reauthenticate(this.formGroup.controls.passwordOld.value)
      .then(() => {
        this.authService.changePassword(this.formGroup.controls.passwordNew.value)
          .then(() => {
            const data: DialogData = {
              title: 'Passwort geändert',
              message: 'Das Passwort wurde erfolgreich geändert.',
              type: 'success',
              timeout: 3000,
              primaryButton: {name: 'Ok'}
            }
            this.overlay.openDialog(data);
            this.formGroup.reset();
            formDirective.resetForm();
          }).catch((error) => {
          const data: DialogData = {
            title: 'Fehler',
            message: 'Das Passwort konnte nicht geändert werden.',
            type: 'error',
            primaryButton: {name: 'Ok'}
          }
          this.overlay.openDialog(data);
        });
      }).catch((error) => {
      const data: DialogData = {
        title: 'Fehler',
        message: 'Das eingegebenen Passwort ist nicht korrekt.',
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
   * @param inputField the blank field
   */
  getErrorMessage(inputField) {
    return inputField.hasError('required') ?
      'Dieses Feld muss ausgefüllt werden' :
      inputField.hasError('minlength') ?
        'Das Passwort muss mindestens sechs Zeichen beinhalten' : '';
  }
}
