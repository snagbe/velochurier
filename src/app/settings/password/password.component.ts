import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {NgForm} from "@angular/forms";
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
              private overlay: OverlayComponent) {
  }

  ngOnInit(): void {
  }

  onSubmit(passwordForm: NgForm) {
    this.authService.reauthenticate(passwordForm.value.passwordOld)
      .then(() => {
        this.authService.changePassword(passwordForm.value.passwordNew)
          .then(() => {
            const data: DialogData = {
              title: 'Passwort geändert',
              message: 'Das Passwort wurde erfolgreich geändert.'
            }
            this.overlay.openDialog(data);
            passwordForm.reset();
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
}
