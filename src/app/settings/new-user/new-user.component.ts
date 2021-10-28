import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroupDirective, NgForm, Validators} from "@angular/forms";
import {DialogData, OverlayComponent} from "../../overlay/overlay.component";
import {AuthService} from "../../auth/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.css']
})
export class NewUserComponent implements OnInit {

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

  onSubmit(formDirective: FormGroupDirective) {
    this.authService.createUser(this.formGroup.controls.email.value, this.formGroup.controls.password.value)
      .then(() => {
        const data: DialogData = {
          title: 'Neuer Benutzer erstellt',
          message: 'Der Benutzer ' + this.formGroup.controls.email.value + ' wurde erfolgreich erstellt.',
          type: 'success'
        }
        this.overlay.openDialog(data);
        this.formGroup.reset();
        formDirective.resetForm();
      }).catch((error) => {
      const data: DialogData = {
        title: 'Fehler',
        message: 'Der Benutzer konnte nicht erstellt werden.',
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
      inputField.hasError('minlength') ?
        'Das Passwort muss mindestens sechs Zeichen beinhalten' :
        inputField.hasError('email') ?
          'Keine gültige E-Mail Adresse' : '';
  }
}
