import {Component, OnInit} from '@angular/core';
import {AuthService} from "../auth.service";
import {Router} from "@angular/router";
import {DialogData, OverlayComponent} from "../../overlay/overlay.component";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {

  constructor(private authService: AuthService,
              private router: Router,
              private overlay: OverlayComponent) {
  }

  ngOnInit(): void {
  }

  onSubmit(passwordForm: NgForm) {
    this.authService.sendPasswordResetMail(passwordForm.value.email)
      .then(() => {
        console.log("sending mail successful");
        const data: DialogData = {
          type: 'Link wurde versendet',
          message: 'Wir haben dir einen Link, um das Passwort zurückzusetzen, an ' + passwordForm.value.email + ' gesendet.'
        }
        this.overlay.openDialog(data);
        passwordForm.reset();
      })
      .catch((error) => {
        let errorMessage = error.code;
        if ('auth/user-not-found' === errorMessage) {
          errorMessage = 'Für die eingegebene E-Mail Adresse existiert kein Konto.';
        }
        const data: DialogData = {
          type: 'Fehler',
          message: errorMessage
        }
        this.overlay.openDialog(data);
      });
  }

  onBack() {
    this.router.navigate(['/settings']);
  }
}
