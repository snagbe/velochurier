import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroupDirective, Validators} from "@angular/forms";
import {AuthService} from "../../auth/auth.service";
import {Router} from "@angular/router";
import {DialogData, OverlayService} from "../../overlay/overlay.service";
import {AngularFireDatabase} from "@angular/fire/compat/database";

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.css']
})
export class NewUserComponent implements OnInit {

  constructor(private db: AngularFireDatabase,
              private authService: AuthService,
              private router: Router,
              private overlay: OverlayService,
              private formBuilder: FormBuilder) {
  }

  formGroup = this.formBuilder.group({
    username: ["", [Validators.required]],
    email: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required, Validators.minLength(6)]]
  });

  ngOnInit(): void {
    this.authService.doAuthCheck();
    this.authService.doAdminCheck();
  }

  onSubmit(formDirective: FormGroupDirective) {
    this.authService.createUser(this.formGroup.controls.email.value, this.formGroup.controls.password.value)
      .then(userData => {
        const user = {
          admin: false,
          uid: userData.user.uid,
          username: this.formGroup.value.username,
          email: userData.user.email
        }
        this.db.list('user').push(user)
          .then(() => {
            const data: DialogData = {
              title: 'Neuer Benutzer erstellt',
              message: 'Der Benutzer ' + this.formGroup.value.username + ' wurde erfolgreich erstellt.',
              type: 'success',
              timeout: 3000,
              primaryButton: {name: 'Ok'}
            }
            this.overlay.openDialog(data);
            this.formGroup.reset();
            formDirective.resetForm();
          })
      }).catch((error) => {
      const data: DialogData = {
        title: 'Fehler',
        message: 'Der Benutzer konnte nicht erstellt werden.',
        type: 'error',
        primaryButton: {name: 'Ok'}
      }
      this.overlay.openDialog(data);
    });
  }

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
      inputField.hasError('minlength') ?
        'Das Passwort muss mindestens sechs Zeichen beinhalten' :
        inputField.hasError('email') ?
          'Keine gültige E-Mail Adresse' : '';
  }
}
