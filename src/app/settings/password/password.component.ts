import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {FormBuilder, FormGroupDirective, NgForm, Validators} from "@angular/forms";
import {AuthService} from "../../auth/auth.service";
import {DialogData, OverlayComponent} from "../../overlay/overlay.component";

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css']
})
export class PasswordComponent implements OnInit {

  constructor(private authService: AuthService,
              private router: Router,
              private overlay: OverlayComponent,
              private formBuilder: FormBuilder) {
  }

  formGroup = this.formBuilder.group({
    passwordOld: [
      "",
      [
        Validators.required,
        Validators.minLength(6)
      ]
    ],
    passwordNew: [
      "",
      [
        Validators.required,
        Validators.minLength(6)
      ]
    ]
  });

  ngOnInit(): void {
  }

  onSubmit(formDirective: FormGroupDirective) {
    this.authService.reauthenticate(this.formGroup.controls.passwordOld.value)
      .then(() => {
        this.authService.changePassword(this.formGroup.controls.passwordNew.value)
          .then(() => {
            const data: DialogData = {
              title: 'Passwort geändert',
              message: 'Das Passwort wurde erfolgreich geändert.'
            }
            this.overlay.openDialog(data);
            this.formGroup.reset();
            formDirective.resetForm();
          }).catch((error) => {
          const data: DialogData = {
            title: 'Fehler',
            message: 'Das Passwort konnte nicht geändert werden.'
          }
          this.overlay.openDialog(data);
        });
      }).catch((error) => {
      const data: DialogData = {
        title: 'Fehler',
        message: 'Das eingegebenen Passwort ist nicht korrekt.'
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
      inputField.hasError('minlength') ?
        'Das Passwort muss mindestens sechs Zeichen beinhalten' : '';
  }
}
